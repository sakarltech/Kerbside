import { NextRequest, NextResponse } from "next/server";
import { handleWebhookEvent } from "@/lib/stripe";
import prisma from "@/lib/prisma";

/**
 * POST /api/payments/webhook
 * Stripe webhook handler. Verifies signature and processes events:
 * - payment_intent.succeeded: update booking to CONFIRMED
 * - payment_intent.payment_failed: update booking to CANCELLED
 * - transfer.created: log payout
 *
 * Returns 400 for signature verification failures (Stripe will not retry).
 * Returns 500 for processing failures (Stripe will retry).
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { success: false, error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  // Step 1: Verify the webhook signature
  let event;
  try {
    event = await handleWebhookEvent(body, signature);
  } catch (error) {
    console.error("[Webhook] Signature verification failed:", error);
    const message =
      error instanceof Error ? error.message : "Signature verification failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }

  // Step 2: Process the event - failures here return 500 so Stripe retries
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as { id: string };
        // Only transition from PENDING to CONFIRMED. This prevents Stripe retries
        // from re-confirming a booking that was subsequently cancelled or completed.
        await prisma.booking.updateMany({
          where: { paymentIntentId: paymentIntent.id, status: "PENDING" },
          data: { status: "CONFIRMED" },
        });
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as { id: string };
        // Only transition from PENDING to CANCELLED. This prevents Stripe retries
        // from cancelling a booking that was already confirmed or completed.
        await prisma.booking.updateMany({
          where: { paymentIntentId: paymentIntent.id, status: "PENDING" },
          data: { status: "CANCELLED" },
        });
        break;
      }

      case "transfer.created": {
        const transfer = event.data.object as {
          id: string;
          metadata?: { bookingId?: string };
        };
        console.log(
          `[Payment] Transfer ${transfer.id} created for booking ${transfer.metadata?.bookingId}`
        );
        break;
      }

      default:
        console.log(`[Payment] Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[Webhook] Processing error:", error);
    const message =
      error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

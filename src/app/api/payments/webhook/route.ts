import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/lib/services/payment-service";

/**
 * POST /api/payments/webhook
 * Stripe webhook handler. Verifies signature and processes events:
 * - payment_intent.succeeded: update booking to CONFIRMED
 * - payment_intent.payment_failed: update booking to CANCELLED
 * - transfer.created: log payout
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    await paymentService.handleWebhook(body, signature);

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[API] POST /api/payments/webhook error:", error);
    const message =
      error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}

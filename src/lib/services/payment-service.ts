import {
  stripe,
  createPaymentIntent as stripeCreatePaymentIntent,
  createConnectAccount,
  createAccountLink,
  handleWebhookEvent,
} from "@/lib/stripe";
import prisma from "@/lib/prisma";

const PLATFORM_COMMISSION_RATE = 0.15; // 15% platform commission

/**
 * PaymentService wraps Stripe operations for the platform including
 * creating payment intents, processing refunds, handling transfers,
 * and managing Connect accounts.
 */
export class PaymentService {
  /**
   * Create a Stripe PaymentIntent with platform commission (application fee)
   */
  async createPaymentIntent(
    amount: number,
    instructorStripeAccountId: string,
    metadata?: Record<string, string>
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    const paymentIntent = await stripeCreatePaymentIntent(
      amount,
      instructorStripeAccountId,
      PLATFORM_COMMISSION_RATE
    );

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
    };
  }

  /**
   * Process a refund for a payment intent
   */
  async processRefund(paymentIntentId: string): Promise<void> {
    await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
  }

  /**
   * Create a transfer to the instructor's connected account
   */
  async createTransfer(
    amount: number,
    instructorStripeAccountId: string,
    bookingId: string
  ): Promise<string> {
    const transfer = await stripe.transfers.create({
      amount,
      currency: "gbp",
      destination: instructorStripeAccountId,
      metadata: {
        bookingId,
      },
    });

    return transfer.id;
  }

  /**
   * Get the balance for an instructor's connected account
   */
  async getInstructorBalance(
    stripeAccountId: string
  ): Promise<{ available: number; pending: number }> {
    const balance = await stripe.balance.retrieve({
      stripeAccount: stripeAccountId,
    });

    const available = balance.available.reduce(
      (sum, b) => sum + b.amount,
      0
    );
    const pending = balance.pending.reduce((sum, b) => sum + b.amount, 0);

    return { available, pending };
  }

  /**
   * Verify and process a Stripe webhook event
   */
  async handleWebhook(
    payload: string | Buffer,
    signature: string
  ): Promise<void> {
    const event = await handleWebhookEvent(payload, signature);

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as { id: string };
        await prisma.booking.updateMany({
          where: { paymentIntentId: paymentIntent.id },
          data: { status: "CONFIRMED" },
        });
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as { id: string };
        await prisma.booking.updateMany({
          where: { paymentIntentId: paymentIntent.id },
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
  }

  /**
   * Create or retrieve a Stripe Connect account for an instructor
   */
  async createOrGetConnectAccount(
    instructorId: string,
    email: string
  ): Promise<string> {
    const profile = await prisma.instructorProfile.findUnique({
      where: { id: instructorId },
    });

    if (profile?.stripeAccountId) {
      return profile.stripeAccountId;
    }

    const account = await createConnectAccount(instructorId, email);

    await prisma.instructorProfile.update({
      where: { id: instructorId },
      data: { stripeAccountId: account.id },
    });

    return account.id;
  }

  /**
   * Generate an account link for Stripe Connect onboarding
   */
  async getAccountLink(
    accountId: string,
    returnUrl: string
  ): Promise<string> {
    const link = await createAccountLink(accountId, returnUrl);
    return link.url;
  }
}

export const paymentService = new PaymentService();

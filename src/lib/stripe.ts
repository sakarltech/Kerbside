import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
});

const PLATFORM_COMMISSION_RATE = 0.15; // 15% platform commission

/**
 * Create a Stripe Connect account for an instructor
 */
export async function createConnectAccount(
  instructorId: string,
  email: string
): Promise<Stripe.Account> {
  const account = await stripe.accounts.create({
    type: "express",
    email,
    metadata: {
      instructorId,
    },
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  return account;
}

/**
 * Create an account link for onboarding an instructor to Stripe Connect
 */
export async function createAccountLink(
  accountId: string,
  returnUrl: string
): Promise<Stripe.AccountLink> {
  const accountLink = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${returnUrl}?refresh=true`,
    return_url: returnUrl,
    type: "account_onboarding",
  });

  return accountLink;
}

/**
 * Create a payment intent with platform commission
 */
export async function createPaymentIntent(
  amount: number,
  instructorStripeAccountId: string,
  commission: number = PLATFORM_COMMISSION_RATE
): Promise<Stripe.PaymentIntent> {
  const commissionAmount = Math.round(amount * commission);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: "gbp",
    application_fee_amount: commissionAmount,
    transfer_data: {
      destination: instructorStripeAccountId,
    },
    metadata: {
      commission_rate: commission.toString(),
      commission_amount: commissionAmount.toString(),
    },
  });

  return paymentIntent;
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  );

  return event;
}

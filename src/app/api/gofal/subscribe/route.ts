import { NextResponse } from "next/server";

/**
 * POST /api/gofal/subscribe
 *
 * Stripe webhook for new Gofal Pro subscriptions. Handles:
 *   - customer.subscription.created   → create gofal_subscriptions row, seed page_content
 *   - customer.subscription.updated   → update tier / status / pro_started_at
 *   - customer.subscription.deleted   → set status='cancelled'
 *   - invoice.payment_failed          → set status='paused'
 *
 * TODO (Day 3): wire Stripe checkout session creator at /api/stripe/checkout,
 * configure the £99/mo product in Stripe dashboard, and validate the webhook
 * signature here using STRIPE_WEBHOOK_SECRET.
 *
 * Configuration plan:
 *   Product: "Gofal Pro"
 *   Price:   £99/month, GBP, recurring monthly
 *   Trial:   none
 *   VAT:     UK rate, applied automatically
 *   Tax behaviour: inclusive
 *
 * On checkout success, redirect to /onboarding/welcome?slug={slug}.
 */

export async function POST(request: Request) {
  // TODO: verify Stripe signature
  // const sig = request.headers.get("stripe-signature");
  // const event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);

  // For now, return 501 so the route is registered but not yet active.
  void request;
  return NextResponse.json(
    {
      error: "not_implemented",
      message: "Gofal Pro Stripe webhook scaffold — implement in Day 3 of the build plan.",
    },
    { status: 501 }
  );
}

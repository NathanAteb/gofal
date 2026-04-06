import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { care_home_id, plan } = await request.json();

    if (!care_home_id || !plan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    const stripe = new (await import("stripe")).default(
      process.env.STRIPE_SECRET_KEY
    );

    const prices: Record<string, { amount: number; name: string }> = {
      enhanced: { amount: 2900, name: "Rhestriad Uwch / Enhanced Listing" },
      featured: { amount: 4900, name: "Rhestriad Nodwedd / Featured Listing" },
    };

    const selected = prices[plan];
    if (!selected) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: { name: selected.name },
            unit_amount: selected.amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      metadata: { care_home_id, plan },
      success_url: `https://gofal.wales/darparwyr?success=true`,
      cancel_url: `https://gofal.wales/darparwyr?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

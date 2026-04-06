import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    const stripe = new (await import("stripe")).default(
      process.env.STRIPE_SECRET_KEY
    );

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const careHomeId = session.metadata?.care_home_id;
      const plan = session.metadata?.plan;

      if (careHomeId && plan) {
        const supabase = await createServiceClient();
        await supabase
          .from("care_homes")
          .update({
            listing_tier: plan,
            is_featured: plan === "featured",
          })
          .eq("id", careHomeId);
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Webhook error" },
      { status: 400 }
    );
  }
}

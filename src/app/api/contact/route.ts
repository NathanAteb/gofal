import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send email if Resend is configured
    if (process.env.RESEND_API_KEY && process.env.NATHAN_EMAIL) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "noreply@gofal.wales",
          to: process.env.NATHAN_EMAIL,
          subject: `Neges newydd / New message — ${name}`,
          html: `
            <h2>Neges newydd o gofal.wales</h2>
            <p><strong>Enw / Name:</strong> ${name}</p>
            <p><strong>E-bost / Email:</strong> ${email}</p>
            <p><strong>Neges / Message:</strong></p>
            <p>${message}</p>
          `,
        });
      } catch {
        // Email failed but we still return success
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

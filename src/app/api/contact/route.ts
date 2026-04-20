import { NextRequest, NextResponse } from "next/server";
import { sendTransactionalEmail } from "@/lib/email/resend";

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

    if (process.env.NATHAN_EMAIL) {
      await sendTransactionalEmail({
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
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

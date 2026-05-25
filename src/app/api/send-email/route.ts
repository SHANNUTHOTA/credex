import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  const { to, subject, html } = await request.json();
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey === 'YOUR_RESEND_API_KEY' || apiKey.startsWith('YOUR_')) {
    return NextResponse.json(
      { error: 'Email service is not configured on this deployment.' },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: 'Credex <onboarding@resend.dev>', // Replace with your verified domain
      to: [to],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Error sending email:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}

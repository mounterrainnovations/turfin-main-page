import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/app/lib/supabase";
import { sendTemplateEmail } from "@/app/lib/zeptomail";
import { verifyTurnstileToken } from "@/app/lib/turnstile";
import { checkRateLimit } from "@/app/lib/rateLimit";

const POPULAR_PROVIDERS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "protonmail.com",
  "zoho.com",
  "aol.com",
  "yandex.com",
  "mail.com",
];

export async function POST(request: NextRequest) {
  try {
    // 0. Rate limiting — 5 requests per IP per minute
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      const retryAfterSec = Math.ceil(rl.retryAfterMs / 1000);
      return NextResponse.json(
        { error: `Too many requests. Please try again in ${retryAfterSec} seconds.` },
        { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
      );
    }

    const { email, turnstileToken } = await request.json();

    // 1. Bot Protection
    if (!turnstileToken) {
      return NextResponse.json(
        { error: "Security check required." },
        { status: 400 }
      );
    }
    const isHuman = await verifyTurnstileToken(turnstileToken);
    if (!isHuman) {
      return NextResponse.json(
        { error: "Security check failed. Please try again." },
        { status: 403 }
      );
    }

    // 2. Validation & Sanitization
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    const domain = cleanEmail.split("@")[1];
    if (!POPULAR_PROVIDERS.includes(domain)) {
      return NextResponse.json(
        { error: "Please use a popular email provider." },
        { status: 400 }
      );
    }

    // 3. Insert to Supabase
    const { error: dbError } = await supabaseAdmin
      .from("waitlist")
      .insert({ email: cleanEmail });

    if (dbError) {
      // Handle unique constraint violation
      if (dbError.code === "23505") {
        return NextResponse.json(
          { error: "You're already on the waitlist!" },
          { status: 409 }
        );
      }
      throw dbError;
    }

    // 4. Send Welcome Email via ZeptoMail
    const welcomeTemplate = process.env.ZEPTO_TEMPLATE_KEY_WELCOME;
    if (welcomeTemplate) {
      await sendTemplateEmail({
        to: [{ email: cleanEmail }],
        templateKey: welcomeTemplate,
        mergeInfo: {
          user_email: cleanEmail,
        },
      });
    } else {
      console.warn(`[Waitlist API] Skipping welcome email for ${cleanEmail} - ZEPTO_TEMPLATE_KEY_WELCOME is not configured.`);
    }

    return NextResponse.json(
      { message: "Welcome to the waitlist!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist API Error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

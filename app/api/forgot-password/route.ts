import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    // ✅ დინამიური URL: იყენებს Vercel-ის დომენს ან დეფოლტად studyflow.ge-ს
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studyflow.ge";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #10b981; text-align: center;">StudyFlow 🚀</h2>
        <h3 style="color: #374151; text-align: center;">პაროლის აღდგენა 🔐</h3>
        <p style="color: #4b5563; line-height: 1.5;">მივიღეთ პაროლის შეცვლის მოთხოვნა შენს ანგარიშზე. ახალი პაროლის დასაყენებლად დააჭირე ქვემოთ მოცემულ ღილაკს:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">პაროლის შეცვლა</a>
        </div>
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">თუ ეს მოთხოვნა შენ არ გაგიგზავნია, უბრალოდ იგნორირება გაუკეთე ამ მეილს.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"StudyFlow" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset your StudyFlow password 🔐",
      html: htmlTemplate,
    });

    return NextResponse.json({ success: true, message: "Reset email sent!" });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
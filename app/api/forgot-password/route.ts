import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "ელ-ფოსტის მითითება სავალდებულოა" },
        { status: 400 }
      );
    }

    // შევქმნათ აღდგენის ბმული
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://studyflow.ge";
    const resetLink = `${baseUrl}/reset-password?email=${encodeURIComponent(email)}`;

    // Transporter-ის კონფიგურაცია Gmail SMTP-ით
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"StudyFlow" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "პაროლის აღდგენა - StudyFlow",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2>პაროლის აღდგენა</h2>
          <p>გამარჯობა, თქვენ მოითხოვეთ პაროლის აღდგენა StudyFlow-ზე.</p>
          <p>პაროლის შესაცვლელად დააჭირეთ ქვემოთ მოცემულ ღილაკს:</p>
          <a href="${resetLink}" style="background-color: #10b981; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin-top: 10px;">პაროლის შეცვლა</a>
          <p style="margin-top: 20px; font-size: 12px; color: #777;">თუ ეს მოთხოვნა თქვენ არ გაგიგზავნიათ, უბრალოდ იგნორირება გაუკეთეთ ამ წერილს.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "აღდგენის ბმული წარმატებით გაიგზავნა!",
    });
  } catch (error: any) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { error: "მეილის გაგზავნა ვერ მოხერხდა: " + error.message },
      { status: 500 }
    );
  }
}
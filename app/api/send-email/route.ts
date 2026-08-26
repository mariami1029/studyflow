import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, fullName } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #10b981; font-size: 24px; margin: 0;">Welcome to StudyFlow! 🚀</h1>
        </div>
        <p style="font-size: 16px; color: #374151;">გამარჯობა <b>${fullName || "სტუდენტო"}</b>,</p>
        <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
          წარმატებით დარეგისტრირდი StudyFlow-ში! ჩვენი პლატფორმა დაგეხმარება შენი აკადემიური ცხოვრების, საგნებისა და დავალებების მარტივად მართვაში.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://localhost:3000/login" style="background-color: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">გადასვლა StudyFlow-ზე</a>
        </div>
        <hr style="border: none; border-top: 1px solid #f3f4f6; margin-top: 30px;" />
        <p style="font-size: 12px; color: #9ca3af; text-align: center;">StudyFlow Team • Academic Organizer</p>
      </div>
    `;

    
    await transporter.sendMail({
      from: `"StudyFlow" <${process.env.GMAIL_USER}>`,
      to: email, // 👈 წავა აბსოლუტურად ნებისმიერ დარეგისტრირებულ მეილზე
      subject: "Welcome to StudyFlow! 🚀",
      html: htmlTemplate,
    });

    return NextResponse.json({ success: true, message: "Email sent successfully!" });
  } catch (error: any) {
    console.error("Nodemailer Send Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
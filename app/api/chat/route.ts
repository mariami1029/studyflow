import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // განახლებული მოდელი: gemini-3.6-flash
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction: "შენ ხარ StudyFlow-ს დამხმარე ჭკვიანი AI ასისტენტი. უპასუხე სტუდენტებს მეგობრულად, ამომწურავად და გამართული ქართულით.",
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token, email, newPassword } = await req.json();

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { error: "ყველა ველის შევსება სავალდებულოა" },
        { status: 400 }
      );
    }

    
    console.log(`Password reset for ${email} with token ${token}. New password: ${newPassword}`);

    return NextResponse.json({
      success: true,
      message: "პაროლი წარმატებით შეიცვალა!",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
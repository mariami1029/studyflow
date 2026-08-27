import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase Admin-ის ინიციალიზაცია (Service Role Key-ით)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ან შენი Admin Key
);

export async function POST(req: Request) {
  try {
    const { token, email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "ყველა ველის შევსება სავალდებულოა" },
        { status: 400 }
      );
    }

    // 1. იპოვე მომხმარებელი მეილით
    const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
    const user = users?.users.find((u) => u.email === email);

    if (getUserError || !user) {
      return NextResponse.json(
        { error: "მომხმარებელი ვერ მოიძებნა" },
        { status: 404 }
      );
    }

    // 2. განაახლე პაროლი Supabase-ის Auth ბაზაში
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: "პაროლი წარმატებით შეიცვალა!",
    });
  } catch (error: any) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
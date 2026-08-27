import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "ყველა ველის შევსება სავალდებულოა" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase-ის მონაცემები ვერ მოიძებნა" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

    // მომხმარებლის მოძებნა და პაროლის განახლება
    const { data: users, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (getUserError) {
      return NextResponse.json({ error: getUserError.message }, { status: 400 });
    }

    const user = users?.users.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "მომხმარებელი ვერ მოიძებნა" },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      message: "პაროლი წარმატებით შეიცვალა!",
    });
  } catch (error: any) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
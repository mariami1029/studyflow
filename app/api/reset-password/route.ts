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
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY არ არის კონფიგურირებული Vercel-ში" },
        { status: 500 }
      );
    }

    // შექმენი Admin Client სწორი ავტორიზაციის ჰედერებით
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      },
    });

    // 1. იპოვე მომხმარებელი მეილით
    const { data: usersData, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (getUserError) {
      console.error("Supabase Admin Auth Error:", getUserError);
      return NextResponse.json({ error: getUserError.message }, { status: 401 });
    }

    const user = usersData.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      return NextResponse.json(
        { error: "ამ მეილით მომხმარებელი ვერ მოიძებნა" },
        { status: 404 }
      );
    }

    // 2. განაახლე პაროლი
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
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
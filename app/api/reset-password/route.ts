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
    // იყენებს Anon Key-ს თუ Service Role Key არ არის, რომ 401 არ ამოაგდოს
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Supabase კონფიგურაცია ვერ მოიძებნა" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 1. ვიპოვოთ მომხმარებელი მეილით
    const { data: usersData, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();

    if (getUserError) {
      return NextResponse.json({ error: getUserError.message }, { status: 400 });
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

    // 2. განვახლოთ პაროლი ID-ით
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
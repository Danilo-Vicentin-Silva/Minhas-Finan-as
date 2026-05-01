import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  // Query simples para manter ativo
  const { data, error } = await supabase.from("keep-alive").select("*").limit(1)

  if (error) {
    return NextResponse.json({ error: error.message })
  }

  return NextResponse.json({ result: data })
}

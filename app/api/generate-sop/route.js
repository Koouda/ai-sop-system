import OpenAI from "openai"
import { createClient } from "@supabase/supabase-js"

export async function POST(req) {
  try {
    const { prompt } = await req.json()

    const openaiApiKey = process.env.OPENAI_API_KEY
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey =
      process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!openaiApiKey) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      )
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return Response.json(
        { error: "Missing Supabase environment variables" },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    })

    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt || "اكتب SOP لإدارة المخزون",
    })

    const sop = response.output_text

    await supabase.from("sops").insert({
      title: "Generated SOP",
      content: sop,
    })

    return Response.json({ sop })
  } catch (err) {
    return Response.json(
      { error: err.message || "Failed to generate SOP" },
      { status: 500 }
    )
  }
}
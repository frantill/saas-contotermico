import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callOpenRouterOCR, emptyOCRResult } from "@/lib/ocr/openrouter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BodySchema = z.object({
  frontBase64: z.string().optional(),
  backBase64: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const result = await callOpenRouterOCR(parsed.data).catch(() => emptyOCRResult());
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    return NextResponse.json(emptyOCRResult(), { status: 200 });
  }
}

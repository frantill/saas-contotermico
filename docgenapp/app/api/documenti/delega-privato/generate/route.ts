import { NextRequest, NextResponse } from "next/server";
import { DelegaPayload, DelegatoConfig } from "@/lib/types";
import { renderDelegaGSEHTML } from "@/lib/templates/delega-privato/template-gse";
import { htmlToPdfBuffer } from "@/lib/pdf/htmlToPdf";
import delegatoJson from "@/config/delegato.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DelegaPayload;

    const delegato = delegatoJson as unknown as DelegatoConfig;

    // Usa sempre il template GSE
    const html = renderDelegaGSEHTML(body, delegato);

    const pdf = await htmlToPdfBuffer(html);

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=delega-privato.pdf",
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}

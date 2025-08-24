import { OCRResult } from "@/lib/types";

const OPENROUTER_API_BASE = process.env.OPENROUTER_API_BASE || "https://openrouter.ai/api/v1";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "gpt-4o-mini";

export type OCRInput = {
  frontBase64?: string; // data URL or raw base64
  backBase64?: string;
};

export function emptyOCRResult(): OCRResult {
  return {
    delegante: {
      nome: { value: "", confidence: 0 },
      cognome: { value: "", confidence: 0 },
      codice_fiscale: { value: "", confidence: 0 },
      data_nascita: { value: "", confidence: 0 },
      nascita: {
        comune: { value: "", confidence: 0 },
        provincia: { value: "", confidence: 0 },
      },
      residenza: {
        via: { value: "", confidence: 0 },
        civico: { value: "", confidence: 0 },
        cap: { value: "", confidence: 0 },
        comune: { value: "", confidence: 0 },
        provincia: { value: "", confidence: 0 },
      },
      email: { value: "", confidence: 0 },
    },
    documento_identita: {
      tipo: { value: "", confidence: 0 },
      numero: { value: "", confidence: 0 },
      rilascio: { value: "", confidence: 0 },
      scadenza: { value: "", confidence: 0 },
    },
  };
}

export async function callOpenRouterOCR(input: OCRInput): Promise<OCRResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return emptyOCRResult();
  }

  const frontUrl = input.frontBase64?.startsWith("data:")
    ? input.frontBase64
    : input.frontBase64
    ? `data:image/jpeg;base64,${input.frontBase64}`
    : undefined;
  const backUrl = input.backBase64?.startsWith("data:")
    ? input.backBase64
    : input.backBase64
    ? `data:image/jpeg;base64,${input.backBase64}`
    : undefined;

  const messages: any[] = [
    {
      role: "system",
      content:
        "Sei un assistente che estrae campi strutturati da CIE/CI formato tessera. Rispondi SOLO con JSON valido secondo lo schema richiesto. Se un campo non è leggibile, usa value=\"\" e confidence=0.",
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text:
            "Estrai i seguenti campi con formato e chiavi esatte. Formati data: YYYY-MM-DD. Campi: delegante { nome, cognome, codice_fiscale, data_nascita, nascita { comune, provincia }, residenza { via, civico, cap, comune, provincia }, email }, documento_identita { tipo (CIE|CI), numero, rilascio, scadenza }. Restituisci JSON con {value, confidence} per ogni campo.",
        },
        ...(frontUrl
          ? [
              {
                type: "image_url",
                image_url: { url: frontUrl },
              },
            ]
          : []),
        ...(backUrl
          ? [
              {
                type: "image_url",
                image_url: { url: backUrl },
              },
            ]
          : []),
      ],
    },
  ];

  const body = {
    model: OPENROUTER_MODEL,
    messages,
    response_format: { type: "json_object" },
    temperature: 0,
  };

  const res = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return emptyOCRResult();
  }

  const data = await res.json().catch(() => null);
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) return emptyOCRResult();
  try {
    const parsed: OCRResult = JSON.parse(content);
    return parsed;
  } catch (e) {
    return emptyOCRResult();
  }
}

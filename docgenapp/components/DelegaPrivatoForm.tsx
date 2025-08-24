"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { OCRResult, DelegaPayload } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";

const CONF_THRESHOLD = 0.9;

type FieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
  confidence?: number; // 0..1
  pattern?: RegExp;
  errorText?: string;
};

function LabeledInput({ label, value, onChange, required, placeholder, confidence, pattern, errorText }: FieldProps) {
  const [touched, setTouched] = useState(false);
  const invalid = pattern && touched && !pattern.test(value);
  const badge = confidence !== undefined && confidence < CONF_THRESHOLD ? (
    <Badge variant="outline" className="ml-2">Da confermare</Badge>
  ) : null;
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
        {badge}
      </Label>
      <Input
        className={invalid ? "border-red-500" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
      />
      {invalid ? <span className="text-xs text-red-600">{errorText || "Valore non valido"}</span> : null}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function DelegaPrivatoForm() {
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string>("");
  const [backPreview, setBackPreview] = useState<string>("");
  const [loadingOCR, setLoadingOCR] = useState(false);
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [error, setError] = useState<string>("");

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    codice_fiscale: "",
    data_nascita: "",
    nascita_comune: "",
    nascita_provincia: "",
    via: "",
    civico: "",
    cap: "",
    comune: "",
    provincia: "",
    email: "",
    doc_tipo: "",
    doc_numero: "",
    doc_rilascio: "",
    doc_scadenza: "",
  });

  const [conf, setConf] = useState<Record<string, number>>({});

  const onFilesChange = useCallback(async (files: FileList | null, which: "front" | "back") => {
    if (!files || !files[0]) return;
    const file = files[0];
    if (which === "front") setFrontFile(file);
    else setBackFile(file);
    const b64 = await fileToBase64(file);
    if (which === "front") setFrontPreview(b64);
    else setBackPreview(b64);
  }, []);

  const callOCR = useCallback(async () => {
    setLoadingOCR(true);
    setError("");
    try {
      const body: any = { frontBase64: frontPreview, backBase64: backPreview };
      const res = await fetch("/api/ocr/identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data: OCRResult = await res.json();
      setForm({
        nome: data.delegante.nome.value,
        cognome: data.delegante.cognome.value,
        codice_fiscale: data.delegante.codice_fiscale.value,
        data_nascita: data.delegante.data_nascita.value,
        nascita_comune: data.delegante.nascita.comune.value,
        nascita_provincia: data.delegante.nascita.provincia.value,
        via: data.delegante.residenza.via.value,
        civico: data.delegante.residenza.civico.value,
        cap: data.delegante.residenza.cap.value,
        comune: data.delegante.residenza.comune.value,
        provincia: data.delegante.residenza.provincia.value,
        email: data.delegante.email.value,
        doc_tipo: data.documento_identita.tipo.value,
        doc_numero: data.documento_identita.numero.value,
        doc_rilascio: data.documento_identita.rilascio.value,
        doc_scadenza: data.documento_identita.scadenza.value,
      });
      setConf({
        nome: data.delegante.nome.confidence,
        cognome: data.delegante.cognome.confidence,
        codice_fiscale: data.delegante.codice_fiscale.confidence,
        data_nascita: data.delegante.data_nascita.confidence,
        nascita_comune: data.delegante.nascita.comune.confidence,
        nascita_provincia: data.delegante.nascita.provincia.confidence,
        via: data.delegante.residenza.via.confidence,
        civico: data.delegante.residenza.civico.confidence,
        cap: data.delegante.residenza.cap.confidence,
        comune: data.delegante.residenza.comune.confidence,
        provincia: data.delegante.residenza.provincia.confidence,
        email: data.delegante.email.confidence,
        doc_tipo: data.documento_identita.tipo.confidence,
        doc_numero: data.documento_identita.numero.confidence,
        doc_rilascio: data.documento_identita.rilascio.confidence,
        doc_scadenza: data.documento_identita.scadenza.confidence,
      });
    } catch (e: any) {
      setError("Errore OCR. Puoi procedere compilando manualmente.");
    } finally {
      setLoadingOCR(false);
    }
  }, [frontPreview, backPreview]);

  const update = (k: keyof typeof form) => (v: string) => setForm((s) => ({ ...s, [k]: v }));

  const onGeneratePDF = useCallback(async () => {
    setLoadingPDF(true);
    setError("");
    try {
      const payload: DelegaPayload = {
        delegante: {
          nome: form.nome,
          cognome: form.cognome,
          codice_fiscale: form.codice_fiscale,
          data_nascita: form.data_nascita,
          nascita: { comune: form.nascita_comune, provincia: form.nascita_provincia },
          residenza: {
            via: form.via,
            civico: form.civico,
            cap: form.cap,
            comune: form.comune,
            provincia: form.provincia,
          },
          email: form.email,
        },
        documento_identita: {
          tipo: (form.doc_tipo as any) || "",
          numero: form.doc_numero,
          rilascio: form.doc_rilascio,
          scadenza: form.doc_scadenza,
        },
        firma: {
          luogo: form.comune || form.nascita_comune,
          data: undefined, // default handled server-side (today)
        },
      };
      const res = await fetch("/api/documenti/delega-privato/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "delega-privato.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError("Errore generazione PDF");
    } finally {
      setLoadingPDF(false);
    }
  }, [form]);

  const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const capRegex = useMemo(() => /^\d{5}$/i, []);
  const cfRegex = useMemo(() => /^[A-Z0-9]{16}$/i, []);

  return (
    <div className="max-w-3xl mx-auto w-full py-8">
      <Card>
        <CardHeader>
          <h1 className="text-xl md:text-2xl font-semibold">Delega – Generatore (Privato)</h1>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="mb-1 block">Documento fronte</Label>
              <div className="flex items-center gap-3">
                <input
                  ref={frontInputRef}
                  id="front-file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => onFilesChange(e.target.files, "front")}
                  className="hidden"
                />
                <Button type="button" variant="outline" onClick={() => frontInputRef.current?.click()}>
                  Carica fronte
                </Button>
                <span className="text-sm text-muted-foreground">
                  {frontFile ? frontFile.name : "Nessun file selezionato"}
                </span>
              </div>
              {frontPreview ? <img src={frontPreview} alt="fronte" className="mt-2 max-h-48 border border-border" /> : null}
            </div>
            <div>
              <Label className="mb-1 block">Documento retro</Label>
              <div className="flex items-center gap-3">
                <input
                  ref={backInputRef}
                  id="back-file"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => onFilesChange(e.target.files, "back")}
                  className="hidden"
                />
                <Button type="button" variant="outline" onClick={() => backInputRef.current?.click()}>
                  Carica retro
                </Button>
                <span className="text-sm text-muted-foreground">
                  {backFile ? backFile.name : "Nessun file selezionato"}
                </span>
              </div>
              {backPreview ? <img src={backPreview} alt="retro" className="mt-2 max-h-48 border border-border" /> : null}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={callOCR} disabled={loadingOCR || (!frontPreview && !backPreview)} variant="primary">
              {loadingOCR ? (<><Spinner className="mr-2" size="sm" /> Estrazione...</>) : "Estrai da documento"}
            </Button>
          </div>

          {error ? <div className="text-sm text-red-700 bg-red-50 p-3 rounded-[var(--radius-sm)]">{error}</div> : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabeledInput label="Nome" value={form.nome} onChange={update("nome")} required confidence={conf.nome} />
            <LabeledInput label="Cognome" value={form.cognome} onChange={update("cognome")} required confidence={conf.cognome} />
            <LabeledInput label="Codice fiscale" value={form.codice_fiscale} onChange={update("codice_fiscale")} required confidence={conf.codice_fiscale} pattern={cfRegex} errorText="CF non valido" />
            <LabeledInput label="Data di nascita (YYYY-MM-DD)" value={form.data_nascita} onChange={update("data_nascita")} required confidence={conf.data_nascita} />
            <LabeledInput label="Comune di nascita" value={form.nascita_comune} onChange={update("nascita_comune")} required confidence={conf.nascita_comune} />
            <LabeledInput label="Provincia di nascita" value={form.nascita_provincia} onChange={update("nascita_provincia")} required confidence={conf.nascita_provincia} />
            <LabeledInput label="Via" value={form.via} onChange={update("via")} required confidence={conf.via} />
            <LabeledInput label="Civico" value={form.civico} onChange={update("civico")} required confidence={conf.civico} />
            <LabeledInput label="CAP" value={form.cap} onChange={update("cap")} required confidence={conf.cap} pattern={capRegex} errorText="CAP non valido" />
            <LabeledInput label="Comune" value={form.comune} onChange={update("comune")} required confidence={conf.comune} />
            <LabeledInput label="Provincia" value={form.provincia} onChange={update("provincia")} required confidence={conf.provincia} />
            <LabeledInput label="Email" value={form.email} onChange={update("email")} required confidence={conf.email} pattern={emailRegex} errorText="Email non valida" />
            <LabeledInput label="Tipo documento (CIE|CI)" value={form.doc_tipo} onChange={update("doc_tipo")} confidence={conf.doc_tipo} />
            <LabeledInput label="Numero documento" value={form.doc_numero} onChange={update("doc_numero")} confidence={conf.doc_numero} />
            <LabeledInput label="Data rilascio (YYYY-MM-DD)" value={form.doc_rilascio} onChange={update("doc_rilascio")} confidence={conf.doc_rilascio} />
            <LabeledInput label="Data scadenza (YYYY-MM-DD)" value={form.doc_scadenza} onChange={update("doc_scadenza")} confidence={conf.doc_scadenza} />
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button onClick={onGeneratePDF} disabled={loadingPDF} variant="secondary">
            {loadingPDF ? (<><Spinner className="mr-2" size="sm" /> Generazione...</>) : "Genera PDF"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


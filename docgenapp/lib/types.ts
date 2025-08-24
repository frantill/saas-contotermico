export type ConfidenceField<T = string> = {
  value: T;
  confidence: number;
};

export interface OCRDelegante {
  nome: ConfidenceField;
  cognome: ConfidenceField;
  codice_fiscale: ConfidenceField;
  data_nascita: ConfidenceField<string>; // YYYY-MM-DD
  nascita: {
    comune: ConfidenceField;
    provincia: ConfidenceField;
  };
  residenza: {
    via: ConfidenceField;
    civico: ConfidenceField;
    cap: ConfidenceField;
    comune: ConfidenceField;
    provincia: ConfidenceField;
  };
  email: ConfidenceField;
}

export interface OCRDocumentoIdentita {
  tipo: ConfidenceField<"CIE" | "CI" | "">;
  numero: ConfidenceField;
  rilascio: ConfidenceField<string>; // YYYY-MM-DD
  scadenza: ConfidenceField<string>; // YYYY-MM-DD
}

export interface OCRResult {
  delegante: OCRDelegante;
  documento_identita: OCRDocumentoIdentita;
}

export interface DelegaDelegantePlain {
  nome: string;
  cognome: string;
  codice_fiscale: string;
  data_nascita: string; // YYYY-MM-DD
  nascita: { comune: string; provincia: string };
  residenza: { via: string; civico: string; cap: string; comune: string; provincia: string };
  email: string;
}

export interface DelegaDocumentoIdentitaPlain {
  tipo: "CIE" | "CI" | "";
  numero: string;
  rilascio: string; // YYYY-MM-DD
  scadenza: string; // YYYY-MM-DD
}

export interface DelegaFirmaPlain {
  luogo?: string; // default residenza.comune
  data?: string; // default today DD/MM/YYYY
}

export interface DelegaPayload {
  delegante: DelegaDelegantePlain;
  documento_identita: DelegaDocumentoIdentitaPlain;
  firma?: DelegaFirmaPlain;
}

// Delegato (Installatore) config for template mapping
export interface DelegatoIndirizzo {
  via: string;
  civico?: string;
  cap: string;
  comune: string;
  provincia: string; // es. MI
}

export interface DelegatoContatti {
  email?: string;
  telefono?: string;
}

export interface DelegatoConfig {
  nome?: string; // ragione sociale o nome
  cognome?: string; // opzionale se ragione sociale
  piva?: string;
  cf: string; // per Delega usare SEMPRE CF, non P.IVA
  indirizzo: DelegatoIndirizzo;
  contatti?: DelegatoContatti;
}

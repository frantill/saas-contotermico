import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";

export default function DocumentiPage() {
  return (
    <div className="max-w-5xl mx-auto w-full p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold">Documenti</h1>
        <p className="text-sm text-muted-foreground mt-1">Seleziona un tipo di documento per iniziare.</p>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="text-lg font-medium">Delega – Privato</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Genera la delega per persona fisica. Compila i dati o utilizza l'OCR del documento.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/documenti/delega-privato">
                <Button>Apri</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Esempi di future tile (placeholder): */}
          {/* <Card>
            <CardHeader>
              <div className="text-lg font-medium">Altro documento</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Prossimamente.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" disabled>Non disponibile</Button>
            </CardFooter>
          </Card> */}
        </div>
      </section>
    </div>
  );
}

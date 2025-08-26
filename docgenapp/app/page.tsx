import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto w-full p-6 md:p-10">
      <section className="space-y-4 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-semibold">ContoTermico Docs</h1>
        <p className="text-muted-foreground max-w-2xl">
          Genera documenti in pochi passi. Inizia dai moduli disponibili e completa i campi guidato dal nostro flusso.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link href="/documenti">
            <Button size="lg">Vai a Documenti</Button>
          </Link>
          <Link href="/design" className="inline-flex">
            <Button variant="outline" size="lg">Design System</Button>
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="text-lg font-medium">Delega – Privato</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Compila i dati e scarica il PDF della delega.</p>
            </CardContent>
            <CardFooter>
              <Link href="/documenti/delega-privato">
                <Button>Apri generatore</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  );
}

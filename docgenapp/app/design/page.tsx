import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";

export default function Page() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">Design System</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Tokens</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { name: "background", cls: "bg-background border border-border" },
            { name: "foreground", cls: "bg-foreground" },
            { name: "primary", cls: "bg-primary" },
            { name: "muted", cls: "bg-muted" },
            { name: "border", cls: "bg-background border border-border" },
          ].map((t) => (
            <div key={t.name} className="flex flex-col items-center gap-2">
              <div className={`h-12 w-full rounded ${t.cls}`} />
              <div className="text-xs text-muted-foreground">{t.name}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>
            <Spinner className="mr-2" size="sm" /> Loading
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cf">Codice fiscale</Label>
            <Input id="cf" placeholder="RSSMRA80A01H501U" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium">Card, Badge, Spinner</h2>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="font-medium">Titolo</div>
            <Badge>Nuovo</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Contenuto della card con testo descrittivo.</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost">Annulla</Button>
            <Button>Conferma</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}

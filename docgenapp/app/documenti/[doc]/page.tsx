import { notFound } from "next/navigation";
import DelegaPrivatoForm from "@/components/DelegaPrivatoForm";

export default function DocumentPage({ params }: { params: { doc: string } }) {
  const { doc } = params;
  if (doc !== "delega-privato") {
    notFound();
  }
  return <DelegaPrivatoForm />;
}

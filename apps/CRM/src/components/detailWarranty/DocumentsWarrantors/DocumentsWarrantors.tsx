import { Button } from "@repo/ui/components/ui/button.tsx";
import { Label } from "@repo/ui/components/ui/label.tsx";
import { Separator } from "@repo/ui/components/ui/separator.tsx";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Document {
  name: string;
  url: string;
}

interface DocumentsInterfaceProps {
  documents: Document[];
}

export const DocumentsWarrantors = ({ documents }: DocumentsInterfaceProps) => {
  const [showAll, setShowAll] = useState<boolean>(false);

  const showMoreDocuments = () => {
    if (documents?.length > 8) {
      setShowAll(!showAll);
    }
  };

  const visibleDocuments = showAll ? documents : documents.slice(0, 8);

  return (
    <section className="w-full flex-col flex gap-4">
      <div className="flex items-center gap-2 justify-center">
        <Label className="text-nowrap text-primary text-2xl">
          Documentos adjuntos
        </Label>
        <Separator className="flex-1 border-t-2 border-gray-400" />

        {documents?.length > 8 ? <Button
          className="flex rounded-xl p-2 w-44 items-center justify-center gap-3 bg-primary text-white"
          onClick={showMoreDocuments}
        >
          {showAll ? "Ver Menos" : "Ver Más"}
        </Button> : null}
      </div>

      <div className="grid gap-4 grid-cols-4 mb-4">
        {visibleDocuments.map((doc: any, docIndex: number) => {
          // Asegúrate de que doc.url esté definido
          if (!doc.documents.url) {
            console.error(
              `El documento con nombre ${doc.name} no tiene URL definida.`
            );
            return null;
          }

          return (
            <Link href={doc.documents.url} key={docIndex} target="_blank">
              <div className="flex h-full border rounded-xl p-4 items-center justify-center border-primary/65  hover:bg-primary/50">
                <p className="text-center">{doc.documents.name}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center">
        {!showAll && visibleDocuments.length >= 8 && <Ellipsis />}
      </div>
    </section>
  );
};

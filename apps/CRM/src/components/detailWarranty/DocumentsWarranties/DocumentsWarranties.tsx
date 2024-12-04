import { Check, X } from "lucide-react";
import Link from "next/link";

interface DocumentItem {
  id: string;
  url: string;
  name: string;
}
interface DocumentWrapper {
  documents: DocumentItem;
}
interface DocumentsWarrantyProps {
  documents: DocumentWrapper[];
}

export default function DocumentsWarrantys({ documents }: DocumentsWarrantyProps) {
  const dataMap = documents.map((docWrapper: DocumentWrapper) => {
    const document = docWrapper.documents;
    return {
      title: document.name || "Documento sin título",
      url: document.url || "",
      check: !!document.url,
    };
  });

  return (
    <section className="w-full flex gap-4">
      {dataMap.map((el, index) => (
        <Link href={el.url} key={index} target="_blank">
          <div className="flex border rounded-xl p-2  items-center justify-center gap-2 border-primary/65 hover:bg-primary/50">
            <p className="text-nowrap">{el.title}</p>
            {el.check ? <Check /> : <X />}
          </div>
        </Link>
      ))}
    </section>
  );
}

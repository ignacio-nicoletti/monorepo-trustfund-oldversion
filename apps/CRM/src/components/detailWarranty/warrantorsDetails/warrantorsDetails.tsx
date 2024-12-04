import { Label } from "@repo/ui/components/ui/label.tsx";
import { Separator } from "@repo/ui/components/ui/separator.tsx";
import { User } from "lucide-react";
interface WarrantorDetail {
  typeUser: string;
  name: string;
  lastname: string;
  phone: string;
  dni: string;
  email: string;
  isRequester: boolean;
  isOwner: boolean;
}

interface DetailWarrantorProps {
  warrantors: WarrantorDetail[];
}

export default function WarrantorsDetails({ warrantors }: DetailWarrantorProps) {
  let sortedWarrantors;
  if (warrantors && warrantors.length > 0) {
    sortedWarrantors = [...warrantors].sort((a, b) => {
      if (a.isRequester) return -1;
      if (b.isRequester) return 1;
      if (a.isOwner) return 1;
      if (b.isOwner) return -1;
      return 0;
    });
  }

  return (
    <section className="w-full flex-col flex gap-4">
      <div className="flex items-center gap-2">
        <Label className="text-nowrap text-primary text-2xl">Datos solicitante</Label>
        <Separator className="flex-1 border-t-2 border-gray-400" />
      </div>

      <div className="flex gap-4 justify-center">
        {sortedWarrantors &&
          sortedWarrantors?.length > 0 &&
          sortedWarrantors.map((warrantor, index) => {
            const typeUser = warrantor.isRequester
              ? "Solicitante"
              : warrantor.isOwner
                ? "Propietario"
                : "Co-garante";

            return (
              <div
                key={index}
                className={`flex flex-col flex-1 border rounded-xl p-2 px-5 items-start justify-center gap-1 ${
                  typeUser === "Propietario" ? "bg-primary text-white" : "bg-primary/15"
                }`}
              >
                <div className="flex gap-3">
                  {typeUser !== "Co-garante" ? (
                    <User />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 21a8 8 0 0 1 10.821-7.487" />
                      <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                      <circle cx="10" cy="8" r="5" />
                    </svg>
                  )}
                  <b>{typeUser}</b>
                </div>
                <p>{`${warrantor.name} ${warrantor.lastname}`}</p>
                <p>{warrantor.phone}</p>
                <p>{warrantor.dni}</p>
                <p>{warrantor.email}</p>
              </div>
            );
          })}
      </div>
    </section>
  );
}

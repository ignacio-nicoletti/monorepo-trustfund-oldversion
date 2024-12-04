import { Label } from "@repo/ui/components/ui/label.tsx";
import { Separator } from "@repo/ui/components/ui/separator.tsx";

interface Inmobiliaria {
  name: string;
  inmoAgent: string;
  email: string;
  phone: string;
  postal_code: string | number;
  city: string;
  province: string;
}

interface DetailInmobiliariaProps {
  inmobiliaria: Inmobiliaria;
}

export default function DetailInmobiliaria({ inmobiliaria }: DetailInmobiliariaProps) {
  return (
    <section className="w-full flex-col flex gap-4">
      <div className="flex items-center gap-2">
        <Label className="text-nowrap text-primary text-2xl">Datos inmobiliaria</Label>
        <Separator className="flex-1 border-t-2 border-gray-400" />
      </div>

      <div className="flex border rounded-[12px] p-4 gap-2 justify-evenly items-center">
        <p>{inmobiliaria.name || "-"}</p>
        <Separator orientation="vertical" className="h-6" />
        <p>{inmobiliaria.inmoAgent || "-"}</p>
        <Separator orientation="vertical" className="h-6" />
        <p>{inmobiliaria.email || "-"}</p>
        <Separator orientation="vertical" className="h-6" />
        <p>{inmobiliaria.phone || "-"}</p>
        <Separator orientation="vertical" className="h-6" />
        <p>{inmobiliaria.postal_code || "-"}</p>
        <Separator orientation="vertical" className="h-6" />
        <p>{inmobiliaria.city || "-"}</p>
        <Separator orientation="vertical" className="h-6" />
        <p>{inmobiliaria.province || "-"}</p>
      </div>
    </section>
  );
}

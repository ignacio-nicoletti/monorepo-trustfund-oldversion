"use client";
import { Card, CardContent } from "@repo/ui/components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs.tsx";
import WarrantorsDetails from "../warrantorsDetails/warrantorsDetails";
import { DocumentsWarrantors } from "../DocumentsWarrantors/DocumentsWarrantors";
import DocumentsWarrantys from "../DocumentsWarranties/DocumentsWarranties";
import { GridWarrantiesDetail } from "../GridWarrantiesDetail/GridWarrantiesDetail";
import DetailInmobiliaria from "../DetailInmobiliaria/DetailInmobiliaria";
import { DataTableWarrantiesDetailCuotas } from "../DataTableWarrantiesDetailCuotas/DataTableWarrantiesDetailCuotas";
import { DataTableWarrantiesDetailCuotasColumns } from "../DataTableWarrantiesDetailCuotas/columns/DataTableWarrantiesDetailCuotasColumns";
import { useSession } from "next-auth/react";
import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DataTableWarrantiesDetailCuotasAdminColumns } from "../DataTableWarrantiesDetailCuotas/columns/DataTableWarrantiesDetailCuotasAdminColumns";

export default function DropdownWarranties({ warranties }: any) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get the 'tab' parameter from the search params, default to 'warranty'
  const currentTab = searchParams.get("tab") || "warranty";

  // Function to update the search parameters
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  // Handle tab changes
  const handleTabChange = (value: string) => {
    router.push(`${pathname}?${createQueryString("tab", value)}`);
  };

  return (
    <Card className="w-full rounded-xl border border-slate-500/50 p-2">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full ">
        <TabsList className="w-full bg-transparent text-primary-foreground flex-1">
          <TabsTrigger
            value="warranty"
            className="flex-1 text-black rounded-tr-none rounded-br-none"
          >
            Detalle de garantía
          </TabsTrigger>
          <TabsTrigger value="quotas" className="flex-1 text-black rounded-tl-none rounded-bl-none">
            Detalle de pagos
          </TabsTrigger>
        </TabsList>
        <CardContent>
          <TabsContent value="warranty" className="flex flex-col gap-10 ">
            <GridWarrantiesDetail warranties={warranties.detailWarranties} />
            <DocumentsWarrantys documents={warranties.documentsWarranty} />
            <WarrantorsDetails warrantors={warranties.warrantors} />
            <DocumentsWarrantors documents={warranties.documentsWarrantors} />
            <DetailInmobiliaria inmobiliaria={warranties.inmobiliaria} />
            {/* {(session?.user?.id === warranties?.detailWarranties?.responsableId &&
              warranties?.detailWarranties?.status !== "Cerrado Perdido") ||
            (session?.user?.id === warranties?.detailWarranties?.responsableId &&
              warranties?.detailWarranties?.status !== "Cerrado Ganado") ? (
              <div className="flex justify-end">
                <Button className="w-1/4">
                  <Link
                    href={`/dashboard/cargar-garantia/${warranties?.detailWarranties?.warrantieId}`}
                  >
                    Editar
                  </Link>
                </Button>
              </div>
            ) : null} */}
          </TabsContent>
          <TabsContent value="quotas">
            <DataTableWarrantiesDetailCuotas
              data={warranties.quotas.sort((a: any, b: any) => a.numberOfQuota - b.numberOfQuota)}
              columns={
                session?.user?.role === 3
                  ? DataTableWarrantiesDetailCuotasAdminColumns
                  : DataTableWarrantiesDetailCuotasColumns
              }
            />
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

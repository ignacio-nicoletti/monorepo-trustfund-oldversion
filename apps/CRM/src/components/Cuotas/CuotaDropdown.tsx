"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@repo/ui/components/ui/card.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/ui/tabs.tsx";

import { QuotasByMonth } from "./types";
import { DataTable } from "../Tables/DataTableQuota/DataTable";
import { useColumns } from "../Tables/DataTableQuota/columns/quotas/columns";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import NoData from "../NoData/NoData";

//* Cuotas financiadas
const QuotaList = ({ quotaList }: { quotaList: QuotasByMonth }) => {
  const columns = useColumns();

  return (
    <>
      {quotaList.quotas.length > 0 ? (
        <DataTable data={quotaList.quotas} columns={columns} />
      ) : (
        <NoData dataType="cuotas financiadas" />
      )}
    </>
  );
};

//* Cuotas en un pago
const OneTimePaymentsList = ({ quotaList }: { quotaList: QuotasByMonth }) => {
  const columns = useColumns();

  return (
    <>
      {quotaList.quotas.length > 0 ? (
        <DataTable data={quotaList.quotas} columns={columns} />
      ) : (
        <NoData dataType="cuotas en un pago" />
      )}
    </>
  );
};

//* Tab selector
export default function CuotaDropdown({ quotaList }: { quotaList?: QuotasByMonth }) {
  const [financingType, setFinancingType] = useState(2);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    router.push(pathname + "?" + createQueryString("financingType", financingType.toString()));
  }, [financingType]);

  return (
    <Card className="w-full border-0">
      <Tabs defaultValue="quotas" className="w-full bg-transparent flex-1">
        <TabsList className="w-full bg-transparent text-primary-foreground flex-1">
          <TabsTrigger value="quotas" className="flex-1 text-black" onClick={() => setFinancingType(2)}>
            Financiadas
          </TabsTrigger>
          <TabsTrigger value="one-time" className="flex-1 text-black" onClick={() => setFinancingType(1)}>
            Un pago
          </TabsTrigger>
        </TabsList>
        <CardContent className="p-0">
          <TabsContent value="quotas">{quotaList && <QuotaList quotaList={quotaList} />}</TabsContent>
          <TabsContent value="one-time">{quotaList && <OneTimePaymentsList quotaList={quotaList} />}</TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

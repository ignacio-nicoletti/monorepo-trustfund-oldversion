import { DatePicker } from "@components/forms/inputs/DatePicker";
import { Badge } from "@repo/ui/components/ui/badge.tsx";
import { Button } from "@repo/ui/components/ui/button.tsx";
import { Input } from "@repo/ui/components/ui/input.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/components/ui/table.tsx";
import { CheckIcon, X, EditIcon } from "lucide-react";
import { useState } from "react";

interface Quota {
  numberOfQuota: string;
  amount: string;
  status: "Pendiente" | "Pago" | "Deuda";
  expiration: string;
  paidPreviously: string;
}

interface Props {
  quotas: Quota[];
  w?: string;
  setQuotas: React.Dispatch<React.SetStateAction<Quota[]>>;
  form: any;
  currency: string;
}

function DataQuotaTable({ quotas, setQuotas, form, w, currency }: Props) {
  const [quotaDates, setQuotaDates] = useState<{ [key: number]: string }>({});
  const [quotaAmounts, setQuotaAmounts] = useState<{ [key: number]: string }>(
    {}
  );
  const [quotaStatuses, setQuotaStatuses] = useState<{ [key: number]: string }>(
    {}
  );
  const [activeQuota, setActiveQuota] = useState<number | null>(null);

  const handleEdit = (quotaNum: number) => {
    if (activeQuota === quotaNum) {
      // Obtener la nueva fecha de vencimiento de la cuota editada
      const editedExpirationDate =
        quotaDates[quotaNum] ||
        quotas.find(
          (quota) => parseInt(quota.numberOfQuota) === quotaNum
        )?.expiration;
  
      // Convertir la fecha de vencimiento editada a un objeto Date
      let currentDate = new Date(editedExpirationDate!);
  
      const updatedQuotas = quotas.map((quota) => {
        const quotaNumber = parseInt(quota.numberOfQuota);
  
        if (quotaNumber === quotaNum) {
          // Actualizar la cuota editada con los nuevos valores
          return {
            ...quota,
            expiration: editedExpirationDate!,
            amount: quotaAmounts[quotaNum] || quota.amount,
            status:
              (quotaStatuses[quotaNum] as Quota["status"]) || quota.status,
          };
        } else if (quotaNumber > quotaNum) {
          // Incrementar el mes para las cuotas siguientes
          currentDate = new Date(currentDate); // Crear una nueva instancia de Date
          currentDate.setMonth(currentDate.getMonth() + 1);
          currentDate.setDate(5); // Establecer el día al 5
  
          return {
            ...quota,
            expiration: currentDate.toISOString(),
          };
        } else {
          // Dejar las cuotas anteriores sin cambios
          return quota;
        }
      });
  
      setQuotas(updatedQuotas);
      form.setValue("quotas", updatedQuotas); // Actualiza el formulario completo
      setActiveQuota(null);
    } else {
      setActiveQuota(quotaNum);
    }
  };
  

  const handleInputChange = (
    quotaNum: number,
    field: string,
    value: string
  ) => {
    if (field === "amount") {
      setQuotaAmounts((prev) => ({ ...prev, [quotaNum]: value }));
    } else if (field === "status") {
      setQuotaStatuses((prev) => ({ ...prev, [quotaNum]: value }));
    }
  };

  const handleDateChange = (date: string, quotaNum: number) => {
    setQuotaDates((prev) => ({ ...prev, [quotaNum]: date }));
  };

  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(formattedDate);
  };
  return (
    <Table className={`w-[350px] md:w-full`}>
      <TableHeader>
        <TableRow>
          <TableHead className="text-foreground text-center w-1/5">
            N.
          </TableHead>
          <TableHead className="text-foreground text-center w-1/5">
            Valor
          </TableHead>
          <TableHead className="text-foreground text-center w-1/5">
            Estado
          </TableHead>
          <TableHead className="text-foreground text-center w-1/5">
            Vencimiento
          </TableHead>
          <TableHead className="text-foreground text-center w-1/5">
            Editar
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotas.map((quota) => (
          <TableRow key={quota.numberOfQuota}>
            <TableCell className="font-medium justify-center text-center">
              {quota.numberOfQuota}
            </TableCell>
            <TableCell className="text-center ">
              {activeQuota === parseInt(quota.numberOfQuota) ? (
                <Input
                  type="text"
                  defaultValue={quota.amount}
                  onChange={(e) =>
                    handleInputChange(
                      parseInt(quota.numberOfQuota),
                      "amount",
                      e.target.value
                    )
                  }
                  className="border rounded p-1 w-3/4  m-auto text-center"
                />
              ) : (
                `${new Intl.NumberFormat("es-ES", {
                  style: "currency",
                  currency: currency ?? "ARS",
                }).format(parseFloat(quota.amount))}`
              )}
            </TableCell>
            <TableCell className="text-center">
              {activeQuota === parseInt(quota.numberOfQuota) ? (
                <select
                  defaultValue={quota.status}
                  onChange={(e) =>
                    handleInputChange(
                      parseInt(quota.numberOfQuota),
                      "status",
                      e.target.value
                    )
                  }
                  className="border rounded p-1 w-full text-center"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Pago">Pagada</option>
                  <option value="Deuda">Deuda</option>
                </select>
              ) : (
                <Badge
                  className={`${
                    quota.status === "Pendiente"
                      ? "bg-orange-400 hover:bg-orange-500"
                      : quota.status === "Pago"
                        ? "bg-green-300 hover:bg-green-400"
                        : "bg-red-300 hover:bg-red-400"
                  } w-32 py-2 text-white m-auto justify-center cursor-context-menu`}
                >
                  {quota.status === "Pendiente"
                    ? "Pendiente"
                    : quota.status === "Pago"
                      ? "Pagada"
                      : "Deuda"}
                </Badge>
              )}
            </TableCell>
            <TableCell className="w-1/5">
              {activeQuota === parseInt(quota.numberOfQuota) ? (
                <DatePicker
                  setDateValue={(date: any) =>
                    handleDateChange(date, parseInt(quota.numberOfQuota))
                  }
                  placeHolder="Fecha de cobro"
                  name={`date-${quota.numberOfQuota}`}
                  id={`date-${quota.numberOfQuota}`}
                />
              ) : (
                <div className="flex gap-2 m-auto justify-center text-center">
                  <p>{formatDate(quota.expiration)}</p>
                </div>
              )}
            </TableCell>
            <TableCell>
              {activeQuota === parseInt(quota.numberOfQuota) ? (
                <div className="flex gap-2 m-auto justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setActiveQuota(null)}
                    className="w-8 h-8 rounded-full"
                  >
                    <X />
                  </Button>
                  <Button
                    type="button"
                    onClick={() => handleEdit(parseInt(quota.numberOfQuota))}
                    className="w-8 h-8 rounded-full"
                  >
                    <CheckIcon />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 m-auto justify-center">
                  <Button
                    type="button"
                    onClick={() =>
                      setActiveQuota(parseInt(quota.numberOfQuota))
                    }
                    className="w-8 h-8 rounded-full m-auto"
                  >
                    <EditIcon />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default DataQuotaTable;

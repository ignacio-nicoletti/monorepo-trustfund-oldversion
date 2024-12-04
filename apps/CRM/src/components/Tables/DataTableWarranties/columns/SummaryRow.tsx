import React from "react";
import { Table } from "@tanstack/react-table";
import { Warranty } from "./completed-warranties/columns"; // Adjust the import path as needed
import { TableCell, TableRow } from "@repo/ui/components/ui/table.tsx";
import { Badge } from "@repo/ui/components/ui/badge.tsx";

interface SummaryRowProps {
  table: Table<Warranty>;
}

export function SummaryRow({ table }: SummaryRowProps) {
  const currencyCheck = React.useMemo(() => {
    return table.getFilteredRowModel().rows.every((row) => row.getValue("currency") === "ARS");
  }, [table.getFilteredRowModel().rows]);

  const totalAmount = React.useMemo(() => {
    return table.getFilteredRowModel().rows.reduce((sum, row) => {
      return sum + (row.getValue("reservationAmount") as number);
    }, 0);
  }, [table.getFilteredRowModel().rows]);

  const totalWarranty = React.useMemo(() => {
    return table.getFilteredRowModel().rows.reduce((sum, row) => {
      return sum + (row.getValue("warrantyAmount") as number);
    }, 0);
  }, [table.getFilteredRowModel().rows]);

  const formattedTotal = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currencyCheck ? "ARS" : "USD",
    notation: "standard",
  }).format(totalAmount);

  const formattedTotalWarranty = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currencyCheck ? "ARS" : "USD",
    notation: "standard",
  }).format(totalWarranty);

  return (
    <TableRow className="bg-primary/15">
      <TableCell colSpan={1} className="text-center font-bold">
        Total:
      </TableCell>
      <TableCell colSpan={10}></TableCell>
      <TableCell className="text-center font-medium">
        <Badge>{formattedTotalWarranty}</Badge>
      </TableCell>
      <TableCell className="text-center font-medium">
        <Badge>{formattedTotal}</Badge>
      </TableCell>
      <TableCell colSpan={3}></TableCell>
    </TableRow>
  );
}

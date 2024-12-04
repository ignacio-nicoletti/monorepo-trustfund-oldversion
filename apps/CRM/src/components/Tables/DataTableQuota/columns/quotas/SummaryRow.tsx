import React from 'react';
import { Table } from "@tanstack/react-table"; // Adjust the import path as needed
import { TableCell, TableRow } from '@repo/ui/components/ui/table.tsx';
import { Badge } from '@repo/ui/components/ui/badge.tsx';
import { Quota } from '~/src/components/detailWarranty/DataTableWarrantiesDetailCuotas/columns/types';

interface SummaryRowProps {
  table: Table<Quota>;
}

export function SummaryRow({ table }: SummaryRowProps) {
  //! Chequeamos que todas las cuotas tengan o ono ARS en el currency
  const currencyCheck = React.useMemo(() => {
    return table.getFilteredRowModel().rows.every((row) => row.getValue('currency') === "ARS");
  }, [table.getFilteredRowModel().rows]);

  //! Reducimos el valor de las cuotas y el interes de las cuotas y las formateamos con Intl.
  const totalAmount = React.useMemo(() => {
    return table.getFilteredRowModel().rows.reduce((sum, row) => {
      return sum + (row.getValue("amount") as number);
    }, 0);
  }, [table.getFilteredRowModel().rows]);

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCheck ? "ARS" : "USD",
    notation: "standard",
  }).format(totalAmount);

  const totalInterest = React.useMemo(() => {
    return table.getFilteredRowModel().rows.reduce((sum, row) => {
      return sum + (row.getValue("interest") as number);
    }, 0);
  }, [table.getFilteredRowModel().rows]);

    
  const formattedInterest = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCheck ? "ARS" : "USD",
    notation: "standard",
  }).format(totalInterest);  

  return (
    <TableRow className='bg-primary/15'>
      <TableCell colSpan={1} className='text-center font-bold'>Total:</TableCell>
      <TableCell colSpan={5} className='text-center font-bold'></TableCell>
      <TableCell className="text-center font-medium">
        <Badge>{formattedTotal}</Badge>
      </TableCell>
      <TableCell className="text-center font-medium">
        <Badge>{formattedInterest}</Badge>
      </TableCell>
      <TableCell colSpan={2}></TableCell>
    </TableRow>
  );
}
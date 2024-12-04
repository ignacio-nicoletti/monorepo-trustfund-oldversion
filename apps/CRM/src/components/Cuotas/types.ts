// Mock data structure

import { Quota } from "../detailWarranty/DataTableWarrantiesDetailCuotas/columns/types";

export type QuotasByMonth = {
  quotas: Quota[];
  total: number;
};

export type GroupedQuotas = {
  [year: number]: {
    [month: string]: {
      quotas: Quota[];
      total: number;
    };
  };
};

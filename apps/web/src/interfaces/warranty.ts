export interface WarrantyPrices {
  cashPayment: {
    rentValue: string;
    expenses: string;
    duration: string;
    quantityQuotas: string;
  };
  threeQuotas: {
    rentValue: string;
    expenses: string;
    duration: string;
    quantityQuotas: string;
    downPayment: number;
    quotas: number;
  };
  sixQuotas: {
    rentValue: string;
    expenses: string;
    duration: string;
    quantityQuotas: string;
    downPayment: number;
    quotas: number;
  };

}
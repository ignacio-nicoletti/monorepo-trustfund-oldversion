export type Status = "Pago" | "Pendiente" | "Deuda";

export type Quota = {
  id: string;
  numberOfQuota?: number;
  amount: number;
  expiration: string;
  month: string;
  year: number;
  status: Status;
  paidPreviously: boolean;
  interest: number;
  currency: string;
  warrantyId: string;
  driveFolderId?: string;
  folderName?: string;
  proofPayment?: string | null;
  receiptPayment?: string | null;
  createdAt: string;
  updatedAt: string;
  sucursal: string;
  organization: string;
};
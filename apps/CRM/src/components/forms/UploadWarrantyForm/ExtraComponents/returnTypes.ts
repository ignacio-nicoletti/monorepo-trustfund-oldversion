export interface WarrantiesWithRelations {
  warrantyWithRelations: WarrantyWithRelations;
  warrantorsWithRelations: WarrantorsWithRelation[];
}

export interface WarrantorsWithRelation {
  id: string | undefined;
  name: string | null;
  lastname: string | null;
  email: string | null;
  phone: string | null;
  dni: string | null;
  driveFolderId: string | null;
  folderName: string | null;
  nacionality: string | null;
  addressId: string | null;
  province: string | null;
  city: null | string;
  street: string | null;
  intersectionOne: string | null;
  intersectionTwo: string | null;
  number: number | null;
  isRequester: boolean;
  isOwner: boolean;
  postal_code: string | null;
  urlSign: URLSign[];
  documentsData: DocumentsDatum[];
}

export interface DocumentsDatum {
  id: string | null;
  url: string | null;
  name: string | null;
  warrantorDocumentTypesId: number | null;
  warrantyDocumentTypesId: number | null;
  warrantorId: string | null;
  warrantyId: string | null;
  quotaId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface URLSign {
  id: string | null;
  url: string;
  urlTypeId: number;
  warrantorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WarrantyWithRelations {
  warranties: Warranties;
  users: Users;
  inmobiliarias: Inmobiliarias;
  addresses: Addresses;
  statusWarranty: CurrencyTypes;
  currencyTypes: CurrencyTypes;
  dollarTypes: CurrencyTypes | null;
  financingTypes: CurrencyTypes;
  warrantyTypes: CurrencyTypes;
  datePeriods: DatePeriods;
  coverageTypes: CoverageTypes;
  quotas: Quota[];
}

export interface Addresses {
  id: string | null;
  street: string | null;
  number: string | null;
  intersectionOne: string | null;
  intersectionTwo: string | null;
  apartment: string | null;
  country: string | null;
  province: string | null;
  state: string | null;
  city: string | null;
  domicilio: null;
  postalCode: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CoverageTypes {
  id: number;
  type: string;
  percentage: number;
  percentageStr: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyTypes {
  id: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatePeriods {
  id: string | null;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Inmobiliarias {
  id: string | null;
  name: string;
  inmoAgent: string;
  phone: string | null;
  email: string | null;
  comment: string | null;
  logoUrl: string | null;
  web: string | null;
  status: string | null;
  order: number | null;
  organizationId: number | null;
  warrantiesWon: number;
  addressId: string | null;
  responsableId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  addresses: Addresses
}

export interface Quota {
  id: string | null;
  numberOfQuota: number;
  amount: number;
  expiration: string;
  status: "Pendiente" | "Pago" | "Deuda";
  paidPreviously: boolean;
  interest: number | null;
  month: string | null;
  warrantyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Users {
  id: string;
  name: string;
  lastname: string;
  email: string | null;
  password: string | null;
  warrantiesWon: number;
  status: string | null;
  image_profile: string | null;
  organizationId: number | null;
  role: number;
  addressId: null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Warranties {
  id: string | undefined;
  contractDuration: string | null;
  warrantyAmount: number | null;
  warrantyAmountLessReservation: number | null;
  reservationAmount: number | null;
  reservationDate: string | null;
  month: string | null;
  warrantyTypeId: number | null;
  coverageTypeId: number | null;
  userId: string | null;
  financingTypeId: number | null;
  inmobiliariaId: string | null;
  addressId: string | null;
  datePeriodId: string | null;
  currencyTypeId: number | null;
  dollarTypeId: number | null;
  statusWarrantyId: number | null;
  documentsData: DocumentsDatum[];
  createdAt: string;
  updatedAt: string;
}

export type WarrantiesWithoutDebt = {
  id:                            string;
  contractDuration:              string | null;
  warrantyAmount:                number | null;
  warrantyAmountLessReservation: number | null;
  reservationAmount:             number | null;
  reservationDate:               string | null;
  month:                         string | null;
  warrantyTypeId:                number | null;
  coverageTypeId:                number | null;
  userId:                        string | null;
  financingTypeId:               number | null;
  inmobiliariaId:                string | null;
  addressId:                     string | null;
  datePeriodId:                  string | null;
  currencyTypeId:                number | null;
  dollarTypeId:                  number | null;
  statusWarrantyId:              number | null;
  createdAt:                     string | null;
  updatedAt:                     string | null;
  quotasData:                        Quota[];
  documentsData:                     Document[];
  warrantorsData:                WarrantorsDatum[];
}[] | null 

export interface Document {
  id:                       string;
  url:                      string | null;
  name:                     string | null;
  warrantorDocumentTypesId: number | null;
  warrantyDocumentTypesId:  number | null;
  warrantorId:              null | string;
  warrantyId:               null | string;
  expiredWarrantyId:        string | null;
  createdAt:                string | null;
  updatedAt:                string | null;
}

export interface Quota {
  id:                string;
  numberOfQuota:     number | null;
  amount:            number | null;
  expiration:        string | null;
  status:            string | null;
  paidPreviously:    boolean | null;
  folderName:        string | null;
  driveFolderId:     string | null;
  receiptPayment:    string | null;
  proofPayment:      string | null;
  interest:          number | null;
  month:             string | null;
  warrantyId:        string | null;
  expiredWarrantyId: string | null;
  createdAt:         string | null;
  updatedAt:         string | null;
}

export interface WarrantorsDatum {
  id:                string;
  name:              string | null;
  lastname:          string | null;
  fullname:          string | null;
  phone:             string | null;
  dni:               string | null;
  email:             string | null;
  nacionality:       string | null;
  driveFolderId:     null | string;
  folderName:        string | null;
  isRequester:       boolean | null;
  isOwner:           boolean | null;
  availability:      boolean | null;
  warrantyId:        string | null;
  addressId:         string | null;
  createdAt:         string | null;
  updatedAt:         string | null;
  documents?:         Document[];
  urlSign?:           URLSign[];
}

export interface URLSign {
  id:                string;
  url:               string | null;
  urlTypeId:         number | null;
  warrantorId:       string | null;
  expiredWarrantyId: string | null;
  createdAt:         string | null;
  updatedAt:         string | null;
}

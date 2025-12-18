export interface Property {
  ListingKey: string;
  City: string;
  StateOrProvince: string;
  PostalCode: string;
  StreetNumber: string;
  StreetName: string;
  StreetSuffix: string;
  UnitNumber: string | null;
  UnparsedAddress: string;
  ListPrice: number;
  ClosePrice: number | null;
  OriginalListPrice: number;
  PropertyType: string;
  PropertySubType: string;
  BedroomsTotal: number;
  BathroomsTotalInteger: number;
  BuildingAreaTotal: number;
  BuildingAreaUnits: string;
  MlsStatus: string;
  StandardStatus: string;
  DaysOnMarket: number;
  ListingContractDate: string;
  CloseDate: string | null;
  ExpirationDate: string;
  YearBuilt: string | null;
  ApproximateAge: string | null;
  ParkingTotal: number;
  AssociationFee: number | null;
  TaxAnnualAmount: number | null;
  TaxAssessedValue: number | null;
  PublicRemarks: string;
  PrivateRemarks: string | null;
  VirtualTourURLUnbranded: string | null;
  ListingOfficeName: string;
  BuyerOfficeName: string | null;
  ListAOR: string;
  OriginatingSystemName: string;
  ModificationTimestamp: string;
  OriginalEntryTimestamp: string;
  [key: string]: any;
}

export interface PropertyResponse {
  "@odata.context": string;
  value: Property[];
}

export interface HistoryTransactional {
  ListingKey: string;
  FieldName: string;
  OldValue: string | null;
  NewValue: string | null;
  ModificationTimestamp: string;
  [key: string]: any;
}

export interface HistoryTransactionalResponse {
  "@odata.context": string;
  value: HistoryTransactional[];
}

export interface PropertyFilters {
  city?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  propertyType?: string;
  mlsStatus?: string;
  stateOrProvince?: string;
  top?: number;
}

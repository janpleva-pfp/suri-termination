export interface InsuranceCompanyGnv {
  displayed: boolean;
  email: string;
  website: string;
}

export interface InsuranceCompanyProperty {
  bankAccountNumber: string;
}

export interface InsuranceCompanyDetail {
  name: string;
  shortName: string;
  fullInfo: string;
  address: string;
  addressBlock: string;
  correspondence?: string;
  webLogoGrey: string;
  webLogo: string;
  phone: string;
  email: string;
  calculators: string[];
  bankAccountNumber: string;
  gnv: InsuranceCompanyGnv;
  property?: InsuranceCompanyProperty;
  companyIdentificationNumber: string;
}

export type InsuranceCompaniesMap = Record<string, InsuranceCompanyDetail>;
export type InsuranceCompanyOption = {
  id: string; // companyIdentificationNumber
  name: string; // shortName
  contentKey: string; // key used in the content API
};

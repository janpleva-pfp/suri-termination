export type AddressPayload = {
  q?: string;
  count?: number;
};

export interface AddressResponse {
  addresses: RuianAddress[];
}

export interface RuianAddress {
  id?: number;
  formattedText?: string;
  region?: string;
  municipality?: string;
  municipalPart?: string;
  cityDistrict?: string;
  capitalDistrict?: string;
  street?: string;
  postalCode?: string;
  houseNoType?: string;
  houseNo?: number;
  streetNo?: number;
  town?: string;
  isRandom?: boolean;
}

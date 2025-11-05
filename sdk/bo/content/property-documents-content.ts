export interface PaymentGatewayInfoContentOut {
  products: Record<string, string>;
  websitePaymentInfo: Record<
    string,
    {
      cancelTemplate: string;
      successTemplate: string;
      urlTemplate: string;
    }
  >;

  websites: Record<
    string,
    {
      infoEmail: string;
      infoPhone: string;
      name: string;
    }
  >;
}

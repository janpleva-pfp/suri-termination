import { UserType } from '@app/enums';

export const appState = {
  formData: {
    initialized: true,
    parentSettings: {
      affiliate: "develop",
      googleClientId: "511111111.1111111115",
      googleSessionId: "5111111115",
      pfpUid: "99999999-8888-7777-6666-555555555555",
      subProductName: "tpl",
      website: "srovnator.cz",
      crmNoOpp: false,
      experimentId: "",
      experimentVariant: "",
      linkId: "",
      utmCampaign: "",
      utmMedium: "",
      utmSource: ""
    },
  }
};

export const mappedData =
  {
    affiliate: "develop",
    website: "srovnator.cz",
    previousRequestId: "",
    trackingParams: {
      googleclientid: "511111111.1111111115",
      googleSessionId: "5111111115",
      ['pfp-uid']: "99999999-8888-7777-6666-555555555555",
      ['utm-source']: "",
      ['utm-medium']: "",
      ['utm-campaign']: ""
    },
    productDetailValues: {},
    productDescriptorValues: {
      policyHolder: {
        type: UserType.person,
        nationality: "cz",
        firstName: "Pan",
        lastName: "Test",
        phoneNumber: "+420777777777",
        email: "test@renomia.cz"
      },
      locality: {
        id: 21912254,
        formattedText: "Jemnická 1138/1, Michle, 14000 Praha 4",
        region: "Hlavní město Praha",
        municipality: "Praha",
        municipalPart: "Michle",
        cityDistrict: "Praha 4",
        capitalDistrict: "Praha 4",
        street: "Jemnická",
        postalCode: "14000",
        houseNoType: "č.p.",
        houseNo: 1138,
        streetNo: 1,
        zip: "14000",
        town: "Praha 4 - Michle",
        districtHouseNo: "1138",
        floodZone: 2,
        numberOfFloodsLast20y: "zero"
      },
      household: {
        buildingType: "flat",
        equipmentCategory: "rudimentary",
        limit: 300000,
        floorSpace: 35,
        propertyUse: "permanent",
        location: "higher-floor",
        floorNumber: 3
      },
      insuranceStart: "2023-04-03",
    },
    enabledCalculators: [],
    selectedTariffs: {}
  };

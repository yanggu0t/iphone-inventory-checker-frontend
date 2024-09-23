import { BasicResponse } from "@/service/api";

export type ModelsResponse = BasicResponse<Models>;
export type Models = Model[];
export type Model = {
  id: string;
  name: string;
  capacities: string[];
  colors: Color[];
  part_numbers: PartNumber[];
};
export type PartNumber = {
  capacity: string;
  color: string;
  part_number: string;
  image_url: string;
};
export type Color = {
  code: string;
  name: string;
  image: string;
};

export type LocalesResponse = BasicResponse<Locale[]>;
export type Locale = {
  country: string;
  id: string;
  lang_tag: string;
};

export type ConfigResponse = BasicResponse<Config>;
export type Config = {
  search: {
    countryCode: string;
    loadingVoText: string;
    modelMessage: string;
    pickupEnabled: true;
    pickupURL: string;
    searchMessage: string;
    suggestionsURL: string;
    validation: {
      zip: {
        invalidFormatError: string;
        pattern: string;
        requiredError: string;
      };
    };
    zipMessage: string;
  };
};

export type currentModelStockRequest = {
  path: string;
  params: currentModelStockParams;
};

export type currentModelStockParams = {
  "mts.0": string;
  "parts.0": string;
  location: string;
  cppart: string;
};

export type modelStockResponse = BasicResponse<{
  content: modelStock;
}>;
export type modelStock = {
  deliveryMessage: deliveryMessage;
  pickupMessage: pickupMessage;
};
export type deliveryMessage = {
  [partNumber: string]: {
    compact: {
      label: string;
      quote: string;
      address: {
        postalCode: string;
      };
      showDeliveryOptionsLink: boolean;
      messageType: string;
      basePartNumber: string;
      commitCodeId: string;
      subHeader: string;
      buyability: {
        reason: string;
        commitCode: string;
        isBuyable: boolean;
      };
      idl: boolean;
      defaultLocationEnabled: boolean;
      inHomeSetup: boolean;
      isBuyable: boolean;
      isElectronic: boolean;
    };
  };
};
export type pickupMessage = {
  availability: {
    isComingSoon: boolean;
  };
  filteredTopStore: boolean;
  legendLabelText: string;
  little: boolean;
  location: string;
  notAvailableNearOneStore: string;
  notAvailableNearby: string;
  overlayInitiatedFromWarmStart: boolean;
  storesCount: string;
  viewDetailsText: string;
  viewMoreHoursLinkText: string;
  viewMoreHoursVoText: string;
  warmDudeWithAPU: boolean;
  stores: Store[];
};

export type Store = {
  storeEmail: string;
  storeName: string;
  reservationUrl: string;
  makeReservationUrl: string;
  storeImageUrl: string;
  country: string;
  city: string;
  storeNumber: string;
  partsAvailability: {
    [partNumber: string]: {
      storePickEligible: boolean;
      pickupSearchQuote: string;
      partNumber: string;
      purchaseOption: string;
      ctoOptions: string;
      pickupDisplay: string;
      pickupType: string;
      messageTypes: {
        compact: {
          storeSearchEnabled: boolean;
          storePickupLabel: string;
          storeSelectionEnabled: boolean;
          storePickupQuote: string;
          storePickupLinkText: string;
          storePickupProductTitle: string;
        };
      };
      buyability: {
        isBuyable: boolean;
        reason: string;
        commitCodeId: number;
        inventory: number;
      };
    };
  };
  phoneNumber: string;
  pickupTypeAvailabilityText: string;
  address: {
    address: string;
    address3: string;
    address2: string;
    postalCode: string;
  };
  hoursUrl: string;
  storeHours: {
    storeHoursText: string;
    bopisPickupDays: string;
    bopisPickupHours: string;
    hours: Array<{
      storeTimings: string;
      storeDays: string;
    }>;
  };
  storelatitude: number;
  storelongitude: number;
  storedistance: number;
  storeDistanceWithUnit: string;
  storeDistanceVoText: string;
  retailStore: {
    storeNumber: string;
    storeUniqueId: string;
    name: string;
    storeTypeKey: string;
    storeSubTypeKey: string;
    storeType: string;
    phoneNumber: string;
    email: string;
    carrierCode: string | null;
    locationType: string | null;
    latitude: number;
    longitude: number;
    address: {
      city: string;
      companyName: string;
      countryCode: string;
      county: string | null;
      district: string | null;
      geoCode: string | null;
      label: string | null;
      languageCode: string;
      mailStop: string | null;
      postalCode: string;
      primaryAddress: boolean;
      province: string | null;
      state: string | null;
      street: string;
      street2: string;
      street3: string | null;
      suburb: string | null;
      type: string;
      addrSourceType: string | null;
      outsideCityFlag: string | null;
      daytimePhoneAreaCode: string | null;
      eveningPhoneAreaCode: string | null;
      daytimePhone: string;
      fullPhoneNumber: string | null;
      eveningPhone: string | null;
      emailAddress: string | null;
      firstName: string | null;
      lastName: string | null;
      suffix: string | null;
      lastNamePhonetic: string | null;
      firstNamePhonetic: string | null;
      title: string | null;
      bundlePaymentAddress: boolean;
      businessAddress: boolean;
      uuid: string;
      mobilePhone: string | null;
      mobilePhoneAreaCode: string | null;
      cityStateZip: string | null;
      daytimePhoneSelected: boolean;
      middleName: string | null;
      residenceStatus: string | null;
      moveInDate: string | null;
      subscriberId: string | null;
      locationType: string | null;
      carrierCode: string | null;
      addressCode: string | null;
      metadata: Record<string, unknown>;
      verificationState: string;
      expiration: string | null;
      markForDeletion: boolean;
      correctionResult: string | null;
      fullEveningPhone: string | null;
      fullDaytimePhone: string;
      twoLineAddress: string;
      addressVerified: boolean;
    };
    urlKey: string | null;
    directionsUrl: string | null;
    storeImageUrl: string;
    makeReservationUrl: string;
    hoursAndInfoUrl: string;
    storeHours: Array<{
      storeDays: string;
      voStoreDays: string | null;
      storeTimings: string;
    }>;
    storeHolidays: Array<unknown>;
    secureStoreImageUrl: string;
    distance: number;
    distanceUnit: string;
    distanceWithUnit: string;
    timezone: string;
    storeIsActive: boolean;
    lastUpdated: number;
    lastFetched: number;
    dateStamp: string;
    distanceSeparator: string;
    nextAvailableDate: string | null;
    storeHolidayLookAheadWindow: number;
    driveDistanceWithUnit: string | null;
    driveDistanceInMeters: number | null;
    dynamicAttributes: Record<string, unknown>;
    storePickupMethodByType: {
      INSTORE: {
        type: string;
        typeDirection: {
          directionByLocale: string | null;
        };
        typeCoordinate: {
          lat: number;
          lon: number;
        };
        typeMeetupLocation: {
          meetingLocationByLocale: string | null;
        };
        services: string[];
      };
    };
    storeTimings: string | null;
    availableNow: boolean;
  };
  storelistnumber: number;
  storeListNumber: number;
  pickupOptionsDetails: {
    whatToExpectAtPickup: string;
    comparePickupOptionsLink: string;
    pickupOptions: Array<{
      pickupOptionTitle: string;
      pickupOptionDescription: string;
      index: number;
    }>;
  };
  rank: number;
};
// export interface StoreStock {
//   storeName: string;
//   storeNumber: string;
//   city: string;
//   available: boolean;
//   pickupSearchQuote: string;
// }

export interface FormatModelStock {
  partNumber: string;
  productName: string;
  pickup: Pickup[];
  delivery: {
    compact: {
      label: string;
      quote: string;
      address: {
        postalCode: string;
      };
      showDeliveryOptionsLink: boolean;
      messageType: string;
      basePartNumber: string;
      commitCodeId: string;
      subHeader: string;
      buyability: {
        reason: string;
        commitCode: string;
        isBuyable: boolean;
      };
      idl: boolean;
      defaultLocationEnabled: boolean;
      inHomeSetup: boolean;
      isBuyable: boolean;
      isElectronic: boolean;
    };
  };
}

export type DeliveryOptions = {
  displayName: string;
  date: string;
  shippingCost: string;
  additionalContent: string | null;
};

export type FormSchema = {
  model: Model;
  storage: string;
  color: string;
  zipCode: string;
};

export type Pickup = {
  storeName: string;
  isAvailable: boolean;
  pickupMsg: string;
  pickupType: string;
};

export type LookupAddressRequest = {
  state: string;
  city?: string;
  district?: string;
};

export type LookupAddressResponse = BasicResponse<LookupAddressUnionResponse>;

export type LookupAddressUnionResponse =
  | StateListResponse
  | CityListResponse
  | DistrictListResponse
  | AddressResultResponse;

export type AddressData = {
  label: string;
  value: string;
};

export type StateListResponse = {
  state: {
    data: AddressData[];
  };
};

export type CityListResponse = {
  city: {
    data: AddressData[];
  };
};

export type DistrictListResponse = {
  city?: string;
  district: {
    data: AddressData[];
  };
};

export type AddressResultResponse = {
  provinceCityDistrict: string;
};

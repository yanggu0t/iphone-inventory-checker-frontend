import React, { useEffect, useState } from "react";
import { SearchFormType } from "./form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useQueries } from "@tanstack/react-query";
import { getLookupAddress } from "@/service/api/apple";
import {
  AddressData,
  AddressResultResponse,
  CityListResponse,
  DistrictListResponse,
  StateListResponse,
} from "@/service/types/apple";

interface IProps {
  form: SearchFormType;
  setIsValid: (isValid: boolean) => void;
}

const AddressPicker = ({ form, setIsValid }: IProps) => {
  const [state, setState] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isMainCity, setIsMainCity] = useState(false);

  const results = useQueries({
    queries: [
      {
        queryKey: ["states"],
        queryFn: async (): Promise<AddressData[]> => {
          const response = await getLookupAddress();

          if ("state" in response.data) {
            return (response.data as StateListResponse).state.data;
          } else {
            console.error("Unexpected response structure:", response.data);
            return [];
          }
        },
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["cities", state],
        queryFn: async (): Promise<AddressData[]> => {
          if (!state) return [];

          const response = await getLookupAddress({ state });

          if (
            "city" in response.data &&
            typeof response.data.city === "string"
          ) {
            // 直轄市的情況
            setCity(response.data.city);
            setIsMainCity(true);
            return [{ value: response.data.city, label: response.data.city }];
          } else if (
            "city" in response.data &&
            typeof response.data.city === "object" &&
            Array.isArray(response.data.city?.data)
          ) {
            // 普通省份的情況
            setIsMainCity(false);
            const cityData = response.data as CityListResponse;
            return cityData.city.data;
          } else {
            console.error("意外的響應結構:", response.data);
            return [];
          }
        },
        enabled: !!state,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["districts", state, city],
        queryFn: async (): Promise<AddressData[]> => {
          if (!state || !city) return [];

          const response = await getLookupAddress({ state, city });
          const data = response.data as DistrictListResponse;

          if (data.district && Array.isArray(data.district.data)) {
            return data.district.data;
          } else {
            console.error("意外的響應結構:", data);
            return [];
          }
        },
        enabled: !!state && !!city,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["area", state, city, district],
        queryFn: async (): Promise<string> => {
          if (!state || !city || !district) return "";

          const response = await getLookupAddress({ state, city, district });
          const data = response.data as AddressResultResponse;

          setAddress(data.provinceCityDistrict);

          return data.provinceCityDistrict;
        },
      },
    ],
  });

  const [states, cities, districts] = results.map((result) => result.data) as [
    AddressData[],
    AddressData[],
    AddressData[],
  ];

  const handleStateChange = (value: string) => {
    setState(value);
    setCity(null);
    setDistrict(null);
    setAddress(null);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setDistrict(null);
    setAddress(null);
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
    setAddress(null);
  };

  useEffect(() => {
    if (!address) {
      setIsValid(false);
      return;
    }
    form.setValue("zipCode", address);
    setIsValid(true);
  }, [address, form, setIsValid]);

  return (
    <div className="flex flex-col gap-2">
      {states && (
        <Select value={state || ""} onValueChange={handleStateChange}>
          <SelectTrigger>
            <SelectValue placeholder="选择省份"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            {states.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {cities && (
        <Select
          value={city || ""}
          onValueChange={handleCityChange}
          disabled={isMainCity}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择省份"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            {cities.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {districts && (
        <Select value={district || ""} onValueChange={handleDistrictChange}>
          <SelectTrigger>
            <SelectValue placeholder="选择省份"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            {districts.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default AddressPicker;

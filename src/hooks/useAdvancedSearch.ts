// hooks/useAdvancedSearchData.js
import axiosInstance from "@/lib/axios";
import { Country } from "@/types/countryType";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useState, useEffect } from "react";

type Company = {
  id: number;
  name: string;
};

type Keyword = {
  id: number;
  name: string;
};

export function useAdvancedSearchData() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [companyRes, keywordRes] = await Promise.all([
          fetch("/json/allCompany.json"),
          fetch("/json/keyword.json"),
        ]);

        // Parsing response sebagai JSON
        const companyData = await companyRes.json();
        const keywordData = await keywordRes.json();

        // Mengakses properti 'data' untuk mendapatkan array yang diinginkan
        setCompanies(companyData.data);
        setKeywords(keywordData.data);
      } catch (error) {
        console.error("Error fetching advanced search data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { companies, keywords, loading };
}


async function fetchCountries(): Promise<Country[]> {
    try {
      const response = await axiosInstance.get(`/configuration/countries`);
      return response.data; // Pastikan response.data sesuai dengan tipe Country[]
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  }
  
  // Hook untuk menggunakan React Query
  export const useCountries = (): UseQueryResult<Country[]> => { // Tambahkan type annotation
    return useQuery<Country[], Error>({
      queryKey: ['all/countries'],
      queryFn: fetchCountries,
      staleTime: 1000 * 60 * 5, // 5 menit
    });
  };
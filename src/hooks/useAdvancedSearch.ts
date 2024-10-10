// hooks/useAdvancedSearchData.js
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


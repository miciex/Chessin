import { useState, useEffect } from "react";

const useFetch = <T,>(
  url: string,
  initialData: T,
  options?: RequestInit
): [data: T | null, error: Error | null, loading: boolean] => {
  const [data, setData] = useState<T>(initialData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(loading);
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [url]);

  return [data, error, loading];
};

export default useFetch;

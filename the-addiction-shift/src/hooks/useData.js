import { useState, useEffect } from 'react';

export function useData(filename) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const base = import.meta.env.BASE_URL || '/';
        const res = await fetch(`${base}data/${filename}`);
        if (!res.ok) throw new Error(`Failed to load ${filename}: ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [filename]);

  return { data, loading, error };
}

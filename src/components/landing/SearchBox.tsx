"use client";

import { useEffect, useRef, useState } from "react";
import { type Stock, marketLabel } from "@/data/stock";
import { Icon } from "@/components/design-system/Icon";

// 검색창 — 입력 시 종목 후보를 드롭다운으로 노출, 선택 시 리포트 렌더 (PRD L6).
export function SearchBox({ onSelect }: { onSelect: (stock: Stock) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Stock[]>([]);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        const json = (await res.json()) as { results: Stock[] };
        setResults(json.results);
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function pick(c: Stock) {
    onSelect(c);
    setQ(c.name);
    setOpen(false);
  }

  return (
    <div className="px-5">
      <div ref={boxRef} className="relative">
        <div className="flex items-center gap-2 rounded-[12px] border border-kb-light-gray bg-white px-4 focus-within:border-[1.5px] focus-within:border-kb-black">
          <Icon name="search" size={20} color="var(--kb-gray)" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocusCapture={() => results.length && setOpen(true)}
            placeholder="종목명 또는 종목코드 검색"
            className="min-h-12 w-full bg-transparent text-base outline-none placeholder:text-kb-gray"
            aria-label="종목 검색"
          />
        </div>

        {open && results.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-[12px] border border-kb-border bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
            {results.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => pick(c)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-kb-subtle"
                >
                  <span className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold">{c.name}</span>
                    <span className="text-xs text-kb-gray">{c.code}</span>
                  </span>
                  <span className="text-xs text-kb-gray">
                    {marketLabel(c.market)}
                    {c.industry ? ` · ${c.industry}` : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

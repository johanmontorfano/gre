"use client";

import gru from "@/public/gru.png";
import data from "@/public/data.json"
import Image from "next/image";
import { useMemo, useState } from "react";
import { BsShuffle } from "react-icons/bs";

export default function Home() {
    const [search, setSearch] = useState("");
    const [mode, setMode] = useState<"asc" | "desc">("asc");
    const sorted = useMemo<typeof data>(
        () => data.filter(d => {
            return d.prompt.toLowerCase().includes(search.toLowerCase())
        }).sort((a, b) => {
            const id1 = parseInt(a.id);
            const id2 = parseInt(b.id);

            if (mode === "asc") return id1 - id2;
            else return id2 - id1;
        }),
        [search, mode]
    );
    
    return <div>
        <div className="flex justify-between items-center py-8">
            <h1 className="text-3xl font-bold">LE GRU</h1>
            <Image src={gru} height="200" alt="gru" className="rotate" />
        </div>
        <div className="flex gap-3 max-sm:flex-col w-full">
            <fieldset className="fieldset"> 
                <legend className="fieldset-legend">Order by</legend>
                <select
                    value={mode}
                    onChange={e => setMode(
                        e.target.selectedOptions.item(0)!.value as unknown as
                        typeof mode
                    )}
                    className="select w-min"
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </fieldset> 
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Random</legend>
                <button className="btn" onClick={() => {
                    const id = Math.floor(Math.random() * sorted.length);

                    window.location.assign(`/test?id=${id}`);
                }}>
                    <BsShuffle />
                </button>
            </fieldset>
            <fieldset className="fieldset w-full max-w-[800px]">
                <legend className="fieldset-legend">Search prompts</legend>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input w-full"
                    placeholder="Type to filter by prompt..."
                />
            </fieldset>
        </div>
        <ul className="list mt-4">
            {sorted.map((entry, i) => {
                return <li
                    className="list-row cursor-pointer hover:bg-base-200"
                    onClick={() => {
                        window.location.assign(`/test?id=${entry.id}`);
                    }}
                    key={i}
                >
                    <p>#{entry.id}</p>
                    <p>{entry.prompt}</p>
                    <span className="badge">{entry.type}</span>
                </li>
            })}
        </ul>
    </div>
}

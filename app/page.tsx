"use client";

import gru from "@/public/gru.png";
import data from "@/public/data.json"
import Image from "next/image";

export default function Home() {
    return <div>
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">LE GRU</h1>
            <Image src={gru} height="300" alt="gru" className="rotate" />
        </div>
        <ul className="list">
            {data.map((entry, i) => {
                return <li
                    className="list-row cursor-pointer hover:bg-base-200"
                    onClick={() => {
                        window.location.assign(`/test?id=${i}`)
                    }}
                    key={i}
                >
                    <p>#{i}</p>
                    <p>{entry.prompt}</p>
                    <span>{entry.type}</span>
                </li>
            })}
        </ul>
    </div>
}

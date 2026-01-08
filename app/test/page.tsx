"use client";

import { useSearchParams } from "next/navigation";
import data from "@/public/data.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const [cdown, setCdown] = useState(60 * 30);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const [answer, setAnswer] = useState("");
    const [final, setFinal] = useState("");

    const router = useRouter();
    const params = useSearchParams();
    const item = data[parseInt(params.get("id")!)];

    async function handleSubmit() {
        setLoading(true);
        setShow(true);

        const res = await fetch("/api/analysis", {
            method: "POST",
            body: JSON.stringify({
                prompt: item.prompt,
                answer
            })
        });

        if (res.ok) {
            setFinal((await res.json()).final);
        } else {
            setShow(false);
        }
        setLoading(false);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCdown(p => p - 1);
            if (cdown <= 0) {
                clearInterval(interval);
                router.back();
            }
        }, 1000);

        return () => clearInterval(interval);
    });

    return <div>
        <div className="stats bg-base-200">
            <div className="stat">
                <div className="stat-title">Exercise</div>
                <div className="stat-value">#{params.get("id")}</div>
            </div>
            <div className="stat"> 
                <div className="stat-title">Time remaining</div>
                <div className="stat-info">
                    <span className="countdown font-mono text-2xl">
                        <span style={{
                            "--value": parseInt(cdown / 60 as unknown as string)
                        } as Record<string, number>}>
                            00
                        </span>:
                        <span style={{
                            "--value": parseInt(cdown % 60 as unknown as string)
                        } as Record<string, number>}>
                            00
                        </span>
                    </span>
                </div>
            </div>
        </div>
        <p className="mt-4 text-xl">{item.prompt}</p>
        <p className="text-base-content/60 text-justify">{item.instructions}</p>
        <br />
        <form onSubmit={(ev) => {
            ev.preventDefault();
            handleSubmit();
        }}>
            <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                className="w-full h-[50vh] textarea"
                placeholder="Write something down here..."
            />
            <div className="w-full flex justify-end">
                <input
                    type="submit"
                    value="Submit"
                    className="btn btn-primary mt-4 w-[150px]"
                />
            </div>
        </form>
        {show && <div className="absolute top-0 left-0 w-full h-dvh bg-black/50 flex justify-center items-center">
            <div className="max-w-[600px] w-full bg-base-300">
                <div className="flex flex-col gap-2 p-4">
                    {loading ? 
                        <div className="loading loading-spinner" /> :
                        final.split("\n").map(t => <p className="text-justify">{t}</p>)}
                </div>
                <br />
                <div className="w-full flex justify-end">
                    <button className="btn" onClick={() => setShow(false)}>
                        Close
                    </button>
                </div>
            </div>
        </div>}
    </div>
}

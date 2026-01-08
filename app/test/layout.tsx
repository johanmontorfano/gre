import Link from "next/link";
import { Suspense } from "react";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className="flex flex-col">
        <Link href="/" className="link py-8">Go back</Link>
        <Suspense>
            {children}
        </Suspense>
    </div>
}

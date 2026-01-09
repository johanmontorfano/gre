import "./globals.scss";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased bg-base-300 min-h-dvh">
                <div className="mx-auto max-w-[80vw]">{children}</div>
            </body>
        </html>
    );
}

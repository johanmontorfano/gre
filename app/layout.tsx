import "./globals.scss";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <div className="mx-auto max-w-[80vw]">{children}</div>
            </body>
        </html>
    );
}

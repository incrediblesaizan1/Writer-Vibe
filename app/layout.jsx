import "./globals.css";

export const metadata = {
  title: "WriteVibe",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

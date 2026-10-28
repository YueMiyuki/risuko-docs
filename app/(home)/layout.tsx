import { Analytics } from "@vercel/analytics/next";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import "./home.css";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="font-sans antialiased">
      <HomeLayout {...baseOptions()}>{children}</HomeLayout>
      {process.env.NODE_ENV === "production" && <Analytics />}
    </div>
  );
}

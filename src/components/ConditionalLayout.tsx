"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Navbar } from "./organisms/Navbar";
import { Footer } from "./organisms/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminOrDashboard =
    pathname?.startsWith("/admin") || pathname?.startsWith("/dashboard");

  return (
    <>
      {!isAdminOrDashboard && (
        <Suspense fallback={null}>
          <Navbar/>
        </Suspense>
      )}
      {!isAdminOrDashboard}
      <main className="overflow-hidden">{children}</main>
      {!isAdminOrDashboard && <Footer></Footer>}
    </>
  );
}

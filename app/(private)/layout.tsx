"use client";
import React, { useEffect } from "react";
import { checkVerification } from "@/app/(private)/unverified/actions/checkVerification";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const checkVerfied = async () => {
    await checkVerification();
  };

  useEffect(() => {
    checkVerfied();
  }, []);
  return <>{children}</>;
};

export default Layout;

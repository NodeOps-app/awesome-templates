"use client";

import React, { Suspense } from "react";
import Layout from "./Layout";

interface LayoutWrapperProps {
  title: string;
  showViewAll?: boolean;
  showSidebar?: boolean;
  selectedCategory?: string;
  children: React.ReactNode;
}

function LayoutContent({ children, ...props }: LayoutWrapperProps) {
  return <Layout {...props}>{children}</Layout>;
}

export default function LayoutWrapper(props: LayoutWrapperProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LayoutContent {...props} />
    </Suspense>
  );
}

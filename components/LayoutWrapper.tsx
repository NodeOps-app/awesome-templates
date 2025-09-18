"use client";

import React, { Suspense } from "react";
import Layout from "./Layout";
import { Category } from "../types";

interface LayoutWrapperProps {
  title: string;
  showViewAll?: boolean;
  showSidebar?: boolean;
  selectedCategory?: string;
  categories?: Category[];
  totalCount?: number;
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

"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./QueryClient";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const CustomQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

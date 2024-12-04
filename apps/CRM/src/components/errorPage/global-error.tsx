"use client";
import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import PageError from "./ErrorPage";

interface CustomError extends Error {
  status?: number;
}

function ErrorFallback({ error }: { error: CustomError }) {
  return <PageError error={error.message} />;
}

export default function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      onError={(error: CustomError, errorInfo: React.ErrorInfo) => {
        console.error("Error capturado por Error Boundary:", error, errorInfo);
      }}
      FallbackComponent={ErrorFallback}
    >
      {children}
    </ReactErrorBoundary>
  );
}

"use client";

import { ClipLoader } from "react-spinners";

export const LoadingIndicator = () => (
  <div className="mt-40 flex items-center justify-center gap-2">
    <ClipLoader size={20} /> Loading
  </div>
);

"use client";

import CountUp from "react-countup";
import { useEffect, useState } from "react";

export const ReactCountUpWrapper = ({ value }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return "0";

  return <CountUp duration={0.5} preserveValue end={value} decimals={0} />;
};

"use client";

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode, useEffect, useState } from 'react';

const ThemeProvider = ({ children }: {
  children: ReactNode;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <NextThemesProvider attribute="class">
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider;
"use client";

import { useTheme } from "next-themes";
import { BsSunFill, BsMoonFill } from "react-icons/bs";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-6 h-6 flex items-center justify-center cursor-pointer transition:ease-in-out hover:scale-110 duration-200"
    >
      {theme === "dark" ? (
        <BsSunFill size={15} className="text-white" />
      ) : (
        <BsMoonFill className="text-black" size={15} />
      )}
    </div>
  );
}

import Sidebar from "@/components/Sidebar";
import useTheme from "@/components/ThemeContext";
import React from "react";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
 
    return (
        <div className="flex h-full">
            <Sidebar />
            {children}
        </div>
    );
}
"use client";
// @ts-ignore
import html2pdf from "html2pdf.js";

import { Button } from "./ui/button";

export default function PrintButton({ 
    element
} : { element: string }){

    return (
        <Button className="bg-primary-900 hover:bg-primary-900 hover:opacity-90 gap-3 dark:bg-primary-800 dark:text-white" onClick={() => {
            window.print();
        }}>Exportar para PDF</Button>
    )
}
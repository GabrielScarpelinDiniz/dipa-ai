"use client";
import { useState } from "react";

export default function TemperatureExplanation() {
    const [showExplanation, setShowExplanation] = useState(false);
    return (
        <span className="w-6 h-6 bg-primary-900 dark:bg-primary-600 dark:text-dark-900 rounded-full text-white items-center justify-center flex text-sm relative select-none" onMouseEnter={(e) => setShowExplanation(true)} onMouseLeave={(e) => setShowExplanation(false)}>
            ?
            
                <div className={`absolute bg-white p-4 rounded-md shadow-md text-sm text-primary-900 w-72 translate-x-1/2 -translate-y-1/2 ${showExplanation ? "opacity-100 visible" : "opacity-0 invisible"} transition-all`}>
                    <p>
                        A temperatura da inteligência artificial é um parâmetro que controla a aleatoriedade da amostra. 
                        {"\n"}
                        Quanto maior a temperatura, mais aleatória a amostra.
                        {"\n"} 
                        Quanto menor a temperatura, mais conservadora a amostra.
                    </p>
                </div>
        </span>
    )
}
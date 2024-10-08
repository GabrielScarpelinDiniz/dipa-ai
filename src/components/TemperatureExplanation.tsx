"use client";
import { useState } from "react";

export default function TemperatureExplanation() {
    const [showExplanation, setShowExplanation] = useState(false);
    return (
        <span className="w-6 h-6 bg-primary-900 dark:bg-primary-600 dark:text-dark-900 rounded-full text-white items-center justify-center flex text-sm relative select-none" onMouseEnter={(e) => setShowExplanation(true)} onMouseLeave={(e) => setShowExplanation(false)}>
            ?
            
                <div className={`absolute bg-white p-4 rounded-md shadow-md text-sm text-primary-900 w-72 translate-x-1/2 -translate-y-1/2 ${showExplanation ? "opacity-100 visible" : "opacity-0 invisible"} transition-all`}>
                    <p>
                        Cookies necessários são essenciais para o funcionamento do site e são necessários para que o site funcione corretamente. Esta categoria inclui apenas cookies que garantem funcionalidades básicas e recursos de segurança do site. Esses cookies não armazenam nenhuma informação pessoal.
                        
                    </p>
                </div>
        </span>
    )
}
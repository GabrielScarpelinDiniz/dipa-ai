import React from "react";

export default function ClusterAnalyze({ charts, title, explanation, kpis, classKey } : { charts: React.ReactNode[], title: string, explanation: string, kpis: React.ReactNode[], classKey: string }) {
    return (
        <div className="flex flex-col gap-4 mt-12">
            <h2 className="text-2xl font-semibold">{title}</h2>
            <div className="grid grid-cols-3 gap-4">
                {kpis.map((kpi, index) => (
                    <div key={index} className={`${classKey}-kpi-${index}`}>
                        {kpi}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {charts.map((chart, index) => (
                    <div key={index} className={`h-full ${classKey}-chart-${index}`}>
                        {chart}
                    </div>
                ))}
            </div>
            
            <p>{explanation}</p>
        </div>
    );
}
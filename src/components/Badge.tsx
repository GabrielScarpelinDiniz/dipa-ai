import React from "react";


function GrowingIcon({ icon }: Readonly<{ icon: string }>) {
    if (icon === "up"){
        return (
            <svg width="20" height="11" viewBox="0 0 20 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5714 0.5H19.2857V6.21429" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19.2857 0.5L11.2142 8.57143C11.0807 8.7023 10.9012 8.77561 10.7142 8.77561C10.5273 8.77561 10.3478 8.7023 10.2142 8.57143L6.92852 5.28571C6.795 5.15484 6.61549 5.08153 6.42852 5.08153C6.24155 5.08153 6.06204 5.15484 5.92852 5.28571L0.714233 10.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        )
    }
    return (
        <svg width="20" height="11" viewBox="0 0 20 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.42859 10.5H0.714303V4.78571" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M0.714338 10.5L8.78577 2.42857C8.91929 2.2977 9.0988 2.22439 9.28577 2.22439C9.47273 2.22439 9.65225 2.2977 9.78577 2.42857L13.0715 5.71429C13.205 5.84516 13.3845 5.91847 13.5715 5.91847C13.7584 5.91847 13.938 5.84516 14.0715 5.71429L19.2858 0.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}

export default function BadgeReport({ number, isPositive }: Readonly<{ number: number, isPositive: boolean }>) {
    return (
        <span className={`flex items-center px-4 py-2 rounded-md text-xs gap-2 font-bold ${isPositive ? "bg-primary-800 text-white" : "bg-red-800 text-white"}`}>
            {number.toLocaleString("pt-BR")}%
            { isPositive ? <GrowingIcon icon="up" /> : <GrowingIcon icon="down" /> }
        </span>
    )
}
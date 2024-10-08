"use client";

import ChatAI from "@/types/chats.type";
import Link from "next/link";
import React, { ReactNode, useEffect, useState } from "react";

type SidebarButtonProps = {
  href: string;
  Icon: ({ isActive, isDarkMode }: { isActive?: boolean; isDarkMode?: boolean }) => ReactNode;
  text: string;
  isHovered: boolean;
  isChat?: boolean;
  chats?: ChatAI[]; // Lista de chats antigos
};

export default function SidebarButton({
  href,
  Icon,
  text,
  isHovered,
  isChat,
  chats = [], // Lista de chats como prop opcional
}: SidebarButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setIsActive(window.location.pathname === href);
  }, [href]);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [isHovered])

  // Função para alternar a visibilidade do dropdown
  const toggleDropdown = (e: React.MouseEvent) => {
    if (isChat) {
      e.preventDefault();
      setIsDropdownOpen((prev) => !prev);
    }
  };

  return (
    <div className="">
      <Link
        href={href}
        onClick={toggleDropdown}
        className={`flex items-center gap-4 p-3.5 rounded-md mb-4 transition-colors 
        ${isActive ? "bg-green-900 dark:bg-white" : "hover:bg-neutral-300 dark:hover:bg-neutral-800"} 
        ${isHovered ? "w-full" : "w-auto"} text-white`}
      >
        <div className="flex-shrink-0">
          <Icon isActive={isActive} />
        </div>
        <span
          className={`ml-2 font-bold text-nowrap 
          ${isActive ? "dark:text-primary-900 text-text-50" : "dark:text-text-50 text-primary-900"}
          ${isHovered ? "" : "overflow-hidden"}
          `}
        >
          {text}
        </span>
      </Link>

      {/* Renderiza o dropdown quando isChat for true e o dropdown estiver aberto */}
      {isChat && isDropdownOpen && (
        <ul className="left-0 border-none rounded shadow-md w-auto z-10 ml-4">
          <li className="border-b dark:border-gray-100 border-primary-900 last:border-none">
            <Link
              href={`/chat`}
              className="block px-4 py-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-md mt-2 mb-2"
            >
              Novo chat
            </Link>
          </li>
          {chats.length > 0 ? (
            chats.map((chat) => (
              <li key={chat.id} className="border-b dark:border-gray-100 border-primary-900 last:border-none">
                <Link
                  href={`/chat/${chat.id}`}
                  className="block px-4 py-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-md mt-2 mb-2"
                >
                  {chat.createdAt}
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-center text-sm text-gray-500">Nenhum chat antigo</li>
          )}
        </ul>
      )}
    </div>
  );
}

import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";

export default async function Chat(){
    return (
        <div className="w-full h-full">
            <div className="ml-[100px] w-[100vw - 100px] px-12 h-full">
                <div className="h-full flex flex-col relative">
                    <div className="messages flex flex-col w-full p-4 gap-3 overflow-y-scroll ">
                        <div className="message w-1/2 self-end text-sm bg-primary-900 text-white p-4 rounded">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
                        <div className="message w-1/2 self-start text-sm text-white p-4 bg-primary-800 rounded">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
                        <div className="message w-1/2 self-end text-sm bg-primary-900 text-white p-4 rounded">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
                        <div className="message w-1/2 self-start text-sm text-white p-4 bg-primary-800 rounded">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
                    </div>
                    <div className="input flex flex-col gap-2 w-full flex-1 py-4">
                        <div className="flex gap-4">
                            <Input type="text" placeholder="Digite uma mensagem" className="dark:border-gray-400"/>
                            <Button className="bg-primary-900 hover:bg-primary-900 hover:opacity-90 dark:bg-primary-800 dark:text-white">Enviar</Button>
                        </div>
                        <span className="font-normal text-sm text-gray-700 dark:text-gray-300">Sua mensagem será enviada para uma mensagem generativa privada, os dados só são compartilhados dentro da própria Unipar</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
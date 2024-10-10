import TemperatureExplanation from "@/components/TemperatureExplanation";
import { Button } from "@/components/ui/button";
import "./slider.css"
import SliderDemo from "@/components/Slider";
import * as Switchh from '@radix-ui/react-switch';
import { Input } from "@/components/ui/input";
import ThemeButtonsChanger from "@/components/ThemeChanger";
import { auth } from "@/auth";
import { redirect } from "next/navigation";



export default async function ConfigPage() {
    const session = await auth();
    if (!session) {
        redirect('/access-denied');
    }
    async function updateName(formData: FormData) {
        "use server";

        console.log(formData.get('name'));
        // const response = await fetch(`/api/users/${session?.user?.id}/name`, {
        //     method: 'PATCH',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ name: formData.get('name') })
        // });
        // return response.json();
    }
    return (
            <>
                <div className="w-full">
                    <div className="ml-[100px] w-[100vw - 100px] px-12">
                        <div className="header py-8">
                            <h1 className='font-bold text-2xl text-primary-900 dark:text-white'>Configurações</h1>
                        </div>
                        <div className="content">
                            <div className="option">
                                <h3 className="font-semibold text-lg dark:text-white text-primary-900">Tema:</h3>
                                <ThemeButtonsChanger />
                            </div>
                            <div className="option mt-8">
                                <div className="flex items-center gap-4">
                                    <h3 className="font-semibold text-lg">Configurações de cookies: </h3>
                                    <TemperatureExplanation />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-4 items-center mt-4">
                                        <form>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Switchh.Root className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-primary-800 dark:bg-primary-600 data-[state=unchecked]:bg-input" id="airplane-mode" disabled defaultChecked >
                                                    <Switchh.Thumb className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
                                                </Switchh.Root>
                                            </div>
                                        </form>
                                        <p className="font-medium text-sm">Cookies necessários</p>
                                    </div>
                                    <div className="flex gap-4 items-center mt-4">
                                        <form>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Switchh.Root className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-800 data-[state=checked]:dark:bg-primary-600 data-[state=unchecked]:bg-gray-300" id="airplane-mode" defaultChecked>
                                                    <Switchh.Thumb className="pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
                                                </Switchh.Root>
                                            </div>
                                        </form>
                                        <p className="font-medium text-sm">Cookies funcionais</p>
                                    </div>
                                </div>
                            </div>
                            <div className="option mt-8">
                                <h3 className="font-semibold text-lg">
                                    Trocar nome de exibição
                                </h3>
                                <p className="mt-4 text-sm">Nome</p>
                                <form className="flex gap-4 items-center mt-1" action={updateName}>
                                    <Input about="Nome de exibição" id="display-name" placeholder="Nome de exibição" className="dark:border-gray-300" name="name"/>
                                    <Button type="submit" className="bg-primary-800 hover:bg-primary-800 hover:opacity-90 dark:bg-primary-700 dark:text-white">Salvar</Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
    );
}
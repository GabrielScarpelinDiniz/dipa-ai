import TemperatureExplanation from "@/components/TemperatureExplanation";
import { Button } from "@/components/ui/button";
import "./slider.css"
import SliderDemo from "@/components/Slider";
import * as Switchh from '@radix-ui/react-switch';
import { Input } from "@/components/ui/input";
import ThemeButtonsChanger from "@/components/ThemeChanger";

export default async function ConfigPage() {
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
                                    <h3 className="font-semibold text-lg">Temperatura da inteligência artifical: {"0,5"}</h3>
                                    <TemperatureExplanation />
                                </div>
                                <div className="flex w-80 gap-3 mt-4">
                                    <h3>0,0</h3>
                                    <SliderDemo />
                                    <h3>1,0</h3>
                                </div>
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
                                                <Switchh.Root className="peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-primary-800 dark:bg-primary-600 data-[state=unchecked]:bg-input" id="airplane-mode" defaultChecked>
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
                                <div className="flex gap-4 items-center mt-1">
                                    <Input about="Nome de exibição" id="display-name" placeholder="Nome de exibição" className="dark:border-gray-300" />
                                    <Button className="bg-primary-800 hover:bg-primary-800 hover:opacity-90 dark:bg-primary-700 dark:text-white">Salvar</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
    );
}
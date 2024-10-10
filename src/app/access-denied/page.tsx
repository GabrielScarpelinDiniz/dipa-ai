import Link from "next/link";

export default function AccessDeniedPage() {
    return (
        <div className="w-full">
            <div className="ml-[100px] w-[100vw - 100px] px-12">
                <div className="header py-8">
                    <h1 className='font-bold text-2xl text-primary-900 dark:text-white text-center'>Acesso negado</h1>
                </div>
                <div className="content">
                    <p className="text-center">Você não tem permissão para acessar essa página.</p>
                    <Link href="/signin" className="block text-center text-primary-900 dark:text-white underline mt-4">Voltar para a página de login</Link>
                </div>
            </div>
        </div>
    )
}
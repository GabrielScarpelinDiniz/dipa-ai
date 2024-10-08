import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export default function SignOutPage() {
    
    return (
        <div className="w-screen h-screen bg-gradient-to-br from-gray-100 to-blue-300 dark:from-gray-900 dark:to-gray-700 flex justify-center items-center">
        <div className="dark:bg-gray-800 p-8 flex flex-col gap-6 rounded-xl shadow-xl bg-white border border-gray-200 dark:border-gray-700 transform transition-all hover:scale-105 hover:shadow-2xl">
            <h1 className="text-3xl font-extrabold text-center text-red-500 dark:text-red-300">
                Sair da plataforma?
            </h1>
            <form action={async (formData) => {
                "use server";
                
                await signOut({ redirectTo: '/signin' });
                
            }} className="w-full flex justify-center items-center">
                <button type="submit">
                    <p className="bg-primary-800 text-white dark:bg-primary-800 dark:text-gray-100 py-3 px-6 rounded-lg font-semibold text-center transition-colors hover:bg-primary-700 dark:hover:bg-primary-700">
                        Fazer logout
                    </p>
                </button>
            </form>
        </div>
        </div>
    );
}

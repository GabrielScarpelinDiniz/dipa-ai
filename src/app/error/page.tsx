import Link from "next/link";

//NextJS page
export default function ErrorPage(
  { searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }
) {
  let message = "";
  if (searchParams.error === "AccessDenied") {
    message = "Acesso negado. Esse recurso é somente para usuários da Unipar.";
  }
  else if (searchParams.error === "Verification") {
    message = "O token está expirado";
  }
  else if (searchParams.error === "Configuration") {
    message = "Erro de configuração";
  }
  else if (searchParams.error === "Default") {
    message = "Ocorreu um erro inesperado";
  }
  else {
    message = "Ocorreu um erro inesperado";
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-100 to-blue-300 dark:from-gray-900 dark:to-gray-700 flex justify-center items-center">
      <div className="dark:bg-gray-800 p-8 flex flex-col gap-6 rounded-xl shadow-xl bg-white border border-gray-200 dark:border-gray-700 transform transition-all hover:scale-105 hover:shadow-2xl">
        <h1 className="text-5xl font-extrabold text-center text-red-500 dark:text-red-300">
          Erro
        </h1>
        <p className="text-lg text-center text-gray-700 dark:text-gray-300">
          {message}
        </p>
        <Link href="/signin">
          <p className="bg-primary-800 text-white dark:bg-primary-800 dark:text-gray-100 py-3 px-6 rounded-lg font-semibold text-center transition-colors hover:bg-primary-700 dark:hover:bg-primary-700">
            Voltar para a página de login
          </p>
        </Link>
      </div>
    </div>
  );
}

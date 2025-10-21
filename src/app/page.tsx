import Image from "next/image";
import WithdrawalForm from "./components/WithdrawalForm";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <Image src="/logo-morada.svg" alt="Logo" width={120} height={120} className="dark:invert-0" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Caixa Eletrônico
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Sistema inteligente para distribuição otimizada de cédulas. 
            Digite o valor desejado e receba a menor quantidade de notas possível.
          </p>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mb-10 mx-auto">
          <div className="flex justify-center">
            <WithdrawalForm />
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="flex items-center justify-center gap-6 text-gray-500 dark:text-gray-400">
            <span className="text-sm">Cédulas disponíveis:</span>
            <div className="flex gap-2">
              {[100, 50, 20, 10, 5, 2].map((value) => (
                <span key={value} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium">
                  R$ {value}
                </span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

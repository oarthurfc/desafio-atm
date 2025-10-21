"use client";

import { useState } from "react";
import Image from "next/image";
import { AVAILABLE_BILLS } from "@/constants/bills";

type Result = Record<string, number> | null;

export default function WithdrawalForm() {
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      setError("Informe um número válido");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/saque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valor: parsed })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Erro desconhecido');
      } else {
        setResult(data as Record<string, number>);
      }
    } catch {
      setError('Falha ao conectar com a API');
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getTotalBills = (distribution: Record<string, number>) => {
    return Object.values(distribution).reduce((sum, count) => sum + count, 0);
  };

  const clearForm = () => {
    setValue('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 px-6 py-5 text-white">
          <div className="flex items-center justify-center text-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">Saque de Cédulas</h2>
              <p className="text-blue-100 text-sm">Distribução otimizada de notas</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                Valor do saque
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  R$
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder:text-gray-400 transition-colors text-2xl"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="380"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 
                         text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700
                         focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={loading || !value.trim()}
                type="submit"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Calculando...
                  </span>
                ) : (
                  'Calcular Distribuição'
                )}
              </button>
              <button
                type="button"
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300
                         rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700
                         focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800
                         transition-colors"
                onClick={clearForm}
                disabled={loading}
              >
                Limpar
              </button>
            </div>
          </form>

          {/* Results */}
          <div className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg" role="alert">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-red-800 dark:text-red-200 font-medium text-sm">Erro</p>
                    <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {result && (
              <div className="p-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.53a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-green-800 dark:text-green-200 font-semibold">Distribuição Calculada</h3>
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      Total: {getTotalBills(result)} cédula{getTotalBills(result) !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  {AVAILABLE_BILLS.map((billValue) => {
                    const count = result[billValue.toString()] || 0;
                    if (count === 0) return null;
                    
                    return (
                      <div key={billValue} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-linear-to-r from-green-600 to-emerald-600 rounded flex items-center justify-center text-white text-xs font-bold">
                            {billValue}
                          </div>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {formatCurrency(billValue)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                            {count}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            cédula{count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                  <div className="flex justify-between items-center">
                    <span className="text-green-800 dark:text-green-200 font-medium">Valor total:</span>
                    <span className="text-xl font-bold text-green-700 dark:text-green-300">
                      {formatCurrency(Number(value) || 0)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

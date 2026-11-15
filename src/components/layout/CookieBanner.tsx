'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('obracircular_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('obracircular_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('obracircular_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-bold text-sm text-slate-900 dark:text-white">
              Sua privacidade é nossa prioridade (LGPD)
            </p>
            <p className="mt-1 leading-relaxed">
              Utilizamos cookies essenciais para manter sua sessão segura e personalizar sua experiência de compra e venda de materiais de construção. Saiba mais em nossa{' '}
              <Link href="/privacidade" className="font-semibold text-emerald-600 underline hover:text-emerald-700 dark:text-emerald-400">
                Política de Privacidade
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex w-full sm:w-auto items-center gap-2 justify-end shrink-0">
          <button
            onClick={handleDecline}
            className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition"
          >
            Apenas Essenciais
          </button>
          <button
            onClick={handleAccept}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            Aceitar Todos
          </button>
        </div>
      </div>
    </div>
  );
};

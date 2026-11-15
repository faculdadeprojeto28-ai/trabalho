import React from 'react';
import Link from 'next/link';
import { ShieldCheck, RotateCcw, AlertTriangle } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
        <strong className="block text-sm mb-1">Nota Legal de Minuta</strong>
        Este texto estabelece as diretrizes de cancelamento, custódia e devolução do marketplace ObraCircular para fins demonstrativos.
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Política de Cancelamento, Disputas e Reembolso
        </h1>
        <p className="text-xs text-slate-500">
          Mecanismos de proteção ao comprador e ao vendedor na circulação de materiais.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Custódia Protetora de Pagamento</h2>
          <p>
            Todo pagamento realizado no ObraCircular via Pix ou Cartão de Crédito permanece sob retenção fiduciária temporária. O saldo não é transferido imediatamente ao vendedor. O comprador tem o direito irrevogável de conferir visualmente o material na hora da retirada.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Cancelamento Antes da Retirada</h2>
          <p>
            O comprador pode cancelar a compra sem custos adicionais a qualquer momento antes da retirada física do material ou despacho pelo vendedor. O estorno é integral: em Pix ocorre em até 2 horas e em cartão no fechamento da fatura seguinte.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Recusa no Ato da Retirada</h2>
          <p>
            Caso o comprador chegue ao local e verifique que o material anunciado não corresponde às fotografias, está quebrado, umedecido ou em quantidade inferior, o comprador <strong className="text-slate-900 dark:text-white">não deve informar o código de retirada</strong> e deve clicar em &quot;Abrir Disputa&quot; na tela do pedido. O pagamento é congelado e reembolsado.
          </p>
        </section>
      </div>
    </div>
  );
}

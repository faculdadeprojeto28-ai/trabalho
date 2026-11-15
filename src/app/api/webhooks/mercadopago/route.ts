import { NextResponse } from 'next/server';

// Processamento idempotente de notificações de pagamento do Mercado Pago
const processedEvents = new Set<string>();

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const topic = url.searchParams.get('topic') || url.searchParams.get('type');
    const id = url.searchParams.get('id') || url.searchParams.get('data.id');

    // Validação de idempotência
    const eventKey = `${topic}_${id}`;
    if (eventKey && processedEvents.has(eventKey)) {
      return NextResponse.json({ status: 'already_processed', eventKey }, { status: 200 });
    }

    if (eventKey) {
      processedEvents.add(eventKey);
      // Limite de memória do cache de idempotência
      if (processedEvents.size > 1000) {
        const first = processedEvents.values().next().value;
        if (first) processedEvents.delete(first);
      }
    }

    // Leitura do payload
    let body = {};
    try {
      body = await req.json();
    } catch (e) {
      // Alguns webhooks enviam payload vazio com dados apenas na query string
    }

    console.log(`[Mercado Pago Webhook] Recebido evento: topic=${topic}, id=${id}`);

    // Em produção com chave MERCADOPAGO_ACCESS_TOKEN configurada:
    // const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
    //   headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` }
    // });
    // const paymentData = await mpResponse.json();

    return NextResponse.json({
      success: true,
      message: 'Notificação do webhook do Mercado Pago processada com sucesso em modo seguro',
      event: { topic, id },
    });
  } catch (error) {
    console.error('[Mercado Pago Webhook] Erro ao processar:', error);
    return NextResponse.json(
      { success: false, error: 'Falha no processamento do webhook' },
      { status: 500 }
    );
  }
}

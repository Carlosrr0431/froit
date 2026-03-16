import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM = `Eres RAGO, un asistente de construcción argentino experto.
Respondés en español argentino con tuteo rioplatense.
Podés responder preguntas sobre:
- Materiales de construcción y precios estimados en ARS
- Tipos de paredes (15cm, 20cm, 30cm), rendimientos
- Técnicas de construcción
- Regulaciones y normativas argentinas
- Tiempos de obra
- Cualquier consulta sobre el presupuesto generado

Sé amigable, usá emojis y respondé de forma clara y concisa.
Si te preguntan algo fuera de construcción, redirigí amablemente al tema.`;

export async function POST(req) {
  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 });
    }

    const messages = [
      { role: 'system', content: SYSTEM },
      ...history.slice(-8),
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return NextResponse.json({
      reply: completion.choices[0]?.message?.content || 'No pude procesar tu consulta.',
    });
  } catch (error) {
    console.error('[RAGO Chat API Error]:', error);
    return NextResponse.json({
      reply: 'Error de conexión con la IA. Verificá la configuración y probá de nuevo. 🔧',
    });
  }
}

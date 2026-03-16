import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  buildArchitecturePrompt,
  buildBlueprintPrompt,
  ARCHITECTURE_STYLES,
  CAMERA_VIEWS,
  QUALITY_PRESETS,
} from '@/lib/architectureStyles';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ═══════════════════════════════════════════════════════════════
// POST /api/rago/render
// Genera renders arquitectónicos con DALL-E 3
// ═══════════════════════════════════════════════════════════════

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      plan,
      styleId = 'moderno',
      viewId = 'exterior_frontal',
      materialIds = [],
      environmentId = 'suburbano',
      qualityId = 'hd',
      customPrompt = '',
      mode = 'render', // 'render' | 'blueprint' | 'variation'
      referenceUrl = null, // Para variaciones
    } = body;

    if (!plan?.rooms?.length && mode !== 'variation') {
      return NextResponse.json(
        { error: 'Se requiere un plano con al menos un ambiente' },
        { status: 400 }
      );
    }

    // Seleccionar preset de calidad
    const quality = QUALITY_PRESETS.find(q => q.id === qualityId) || QUALITY_PRESETS[1];

    let prompt;
    let revisedPrompt = '';

    if (mode === 'blueprint') {
      prompt = buildBlueprintPrompt({ plan, styleId });
    } else {
      prompt = buildArchitecturePrompt({
        plan,
        styleId,
        viewId,
        materialIds,
        environmentId,
        customPrompt,
      });
    }

    console.log('[RAGO Render] Prompt:', prompt.substring(0, 200) + '...');
    console.log('[RAGO Render] Quality:', quality.id, quality.size);

    // Llamar a DALL-E 3
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: quality.size,
      quality: quality.quality,
      style: mode === 'blueprint' ? 'natural' : 'vivid',
      response_format: 'url',
    });

    const imageUrl = response.data?.[0]?.url;
    revisedPrompt = response.data?.[0]?.revised_prompt || '';

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'No se pudo generar la imagen' },
        { status: 500 }
      );
    }

    // Metadata del render
    const style = ARCHITECTURE_STYLES.find(s => s.id === styleId);
    const view = CAMERA_VIEWS.find(v => v.id === viewId);

    return NextResponse.json({
      imageUrl,
      revisedPrompt,
      metadata: {
        style: style?.label || styleId,
        view: view?.label || viewId,
        quality: quality.label,
        size: quality.size,
        mode,
        prompt: prompt.substring(0, 300),
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[RAGO Render Error]:', error);

    // Mensajes de error específicos
    if (error?.code === 'content_policy_violation') {
      return NextResponse.json(
        { error: 'El contenido solicitado no cumple las políticas. Intentá con otro estilo.' },
        { status: 400 }
      );
    }

    if (error?.code === 'rate_limit_exceeded') {
      return NextResponse.json(
        { error: 'Límite de generación alcanzado. Esperá unos segundos e intentá de nuevo.' },
        { status: 429 }
      );
    }

    if (error?.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'Créditos de API insuficientes. Verificá tu plan de OpenAI.' },
        { status: 402 }
      );
    }

    return NextResponse.json(
      { error: 'Error al generar el render. Intentá de nuevo.' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// GET /api/rago/render
// Devuelve los estilos y presets disponibles
// ═══════════════════════════════════════════════════════════════

export async function GET() {
  return NextResponse.json({
    styles: ARCHITECTURE_STYLES,
    views: CAMERA_VIEWS,
    qualities: QUALITY_PRESETS,
  });
}

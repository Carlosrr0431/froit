'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Eye,
  EyeOff,
  Grid3X3,
  Armchair,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// FurnishedPlanRenderer — 2D plano amoblado realista
// Respeta 100% las dimensiones y posiciones del plano original
// ═══════════════════════════════════════════════════════════════

const SCALE = 40; // px per meter (same as FloorPlanRenderer)

// ─── Refined color palette with floor textures ───
const ROOM_STYLES = {
  living:      { floor: '#F5F0E8', wall: '#8D6E63', accent: '#A1887F', label: 'Living' },
  comedor:     { floor: '#F5F0E8', wall: '#8D6E63', accent: '#BCAAA4', label: 'Comedor' },
  cocina:      { floor: '#ECEFF1', wall: '#78909C', accent: '#B0BEC5', label: 'Cocina' },
  dormitorio:  { floor: '#E8EAF6', wall: '#7986CB', accent: '#9FA8DA', label: 'Dormitorio' },
  bano:        { floor: '#E0E0E0', wall: '#90A4AE', accent: '#B0BEC5', label: 'Baño' },
  garage:      { floor: '#CFD8DC', wall: '#607D8B', accent: '#90A4AE', label: 'Garage' },
  lavadero:    { floor: '#E0F2F1', wall: '#80CBC4', accent: '#B2DFDB', label: 'Lavadero' },
  pasillo:     { floor: '#EFEBE9', wall: '#A1887F', accent: '#BCAAA4', label: 'Pasillo' },
  hall:        { floor: '#EFEBE9', wall: '#A1887F', accent: '#D7CCC8', label: 'Hall' },
  balcon:      { floor: '#E8F5E9', wall: '#81C784', accent: '#A5D6A7', label: 'Balcón' },
  patio:       { floor: '#C8E6C9', wall: '#66BB6A', accent: '#81C784', label: 'Patio' },
  oficina:     { floor: '#E8EAF6', wall: '#7986CB', accent: '#9FA8DA', label: 'Oficina' },
  vestidor:    { floor: '#FCE4EC', wall: '#F06292', accent: '#F48FB1', label: 'Vestidor' },
  default:     { floor: '#F5F5F5', wall: '#9E9E9E', accent: '#BDBDBD', label: '' },
};

function rd(n) { return Math.round(n * 10) / 10; }

// ═══════════════════════════════════════════════════════════════
// SVG Furniture Drawers — each returns <g> elements relative to room origin
// px = room x in px, py = room y in px, pw = room width px, ph = room height px
// ═══════════════════════════════════════════════════════════════

function drawFloorPattern(px, py, pw, ph, type) {
  const lines = [];
  if (type === 'cocina' || type === 'bano' || type === 'lavadero') {
    // Tile pattern
    const tileSize = 20;
    for (let x = 0; x <= pw; x += tileSize) {
      lines.push(<line key={`tv-${x}`} x1={px + x} y1={py} x2={px + x} y2={py + ph} stroke="#00000008" strokeWidth={0.5} />);
    }
    for (let y = 0; y <= ph; y += tileSize) {
      lines.push(<line key={`th-${y}`} x1={px} y1={py + y} x2={px + pw} y2={py + y} stroke="#00000008" strokeWidth={0.5} />);
    }
  } else if (type === 'garage') {
    // Concrete pattern
    for (let y = 0; y <= ph; y += 30) {
      lines.push(<line key={`gl-${y}`} x1={px} y1={py + y} x2={px + pw} y2={py + y} stroke="#00000006" strokeWidth={0.5} />);
    }
  } else if (type === 'patio' || type === 'balcon') {
    // Outdoor tiles
    const ts = 25;
    for (let x = 0; x <= pw; x += ts) {
      lines.push(<line key={`pv-${x}`} x1={px + x} y1={py} x2={px + x} y2={py + ph} stroke="#00000010" strokeWidth={0.5} />);
    }
    for (let y = 0; y <= ph; y += ts) {
      lines.push(<line key={`ph-${y}`} x1={px} y1={py + y} x2={px + pw} y2={py + y} stroke="#00000010" strokeWidth={0.5} />);
    }
  } else {
    // Wood floor pattern
    const plankW = 30;
    const plankH = 8;
    for (let y = 0; y <= ph; y += plankH) {
      const offset = (Math.floor(y / plankH) % 2) * (plankW / 2);
      lines.push(<line key={`wh-${y}`} x1={px} y1={py + y} x2={px + pw} y2={py + y} stroke="#00000006" strokeWidth={0.3} />);
      for (let x = offset; x <= pw; x += plankW) {
        lines.push(<line key={`wv-${y}-${x}`} x1={px + x} y1={py + y} x2={px + x} y2={py + y + plankH} stroke="#00000006" strokeWidth={0.3} />);
      }
    }
  }
  return <g className="pointer-events-none">{lines}</g>;
}

function drawLiving(px, py, pw, ph) {
  const cx = px + pw / 2;
  const cy = py + ph / 2;
  const items = [];

  // Sofa (bottom center)
  const sofaW = Math.min(pw * 0.55, 100);
  const sofaH = Math.min(ph * 0.18, 28);
  const sofaX = cx - sofaW / 2;
  const sofaY = py + ph - sofaH - 10;
  items.push(<rect key="sofa" x={sofaX} y={sofaY} width={sofaW} height={sofaH} rx={4} fill="#8D6E63" opacity={0.5} />);
  items.push(<rect key="sofa-seat" x={sofaX + 3} y={sofaY + 3} width={sofaW - 6} height={sofaH - 8} rx={3} fill="#A1887F" opacity={0.5} />);
  // Cushions
  const cushW = (sofaW - 10) / 3;
  for (let i = 0; i < 3; i++) {
    items.push(<rect key={`cush-${i}`} x={sofaX + 4 + i * (cushW + 1)} y={sofaY + 4} width={cushW} height={sofaH - 12} rx={2} fill="#BCAAA4" opacity={0.4} />);
  }

  // Coffee table
  const ctW = Math.min(pw * 0.22, 44);
  const ctH = Math.min(ph * 0.1, 22);
  items.push(<rect key="ct" x={cx - ctW / 2} y={sofaY - ctH - 14} width={ctW} height={ctH} rx={3} fill="#5D4037" opacity={0.35} />);

  // TV stand (top)
  const tvW = Math.min(pw * 0.35, 70);
  items.push(<rect key="tv-stand" x={cx - tvW / 2} y={py + 8} width={tvW} height={6} rx={1} fill="#424242" opacity={0.3} />);
  items.push(<rect key="tv" x={cx - tvW / 2 + 5} y={py + 14} width={tvW - 10} height={2} rx={0.5} fill="#616161" opacity={0.25} />);

  // Side table + lamp
  if (pw > 100) {
    items.push(<circle key="side-t" cx={sofaX - 14} cy={sofaY + sofaH / 2} r={8} fill="#795548" opacity={0.3} />);
    items.push(<circle key="lamp" cx={sofaX - 14} cy={sofaY + sofaH / 2} r={3} fill="#FFE082" opacity={0.4} />);
  }

  // Rug
  const rugW = Math.min(pw * 0.5, 90);
  const rugH = Math.min(ph * 0.35, 60);
  items.push(<rect key="rug" x={cx - rugW / 2} y={cy - rugH / 2 + 5} width={rugW} height={rugH} rx={4} fill="#D7CCC8" opacity={0.2} stroke="#BCAAA4" strokeWidth={0.5} strokeDasharray="4,2" />);

  return <g>{items}</g>;
}

function drawComedor(px, py, pw, ph) {
  const cx = px + pw / 2;
  const cy = py + ph / 2;
  const items = [];

  // Table
  const tW = Math.min(pw * 0.45, 72);
  const tH = Math.min(ph * 0.3, 44);
  items.push(<rect key="table" x={cx - tW / 2} y={cy - tH / 2} width={tW} height={tH} rx={3} fill="#6D4C41" opacity={0.4} />);

  // Chairs (4-6 around table)
  const chairSize = 10;
  const chairs = [
    { x: cx - tW / 2 - chairSize - 3, y: cy - chairSize / 2 },
    { x: cx + tW / 2 + 3, y: cy - chairSize / 2 },
    { x: cx - chairSize / 2 - 12, y: cy - tH / 2 - chairSize - 3 },
    { x: cx + chairSize / 2 + 2, y: cy - tH / 2 - chairSize - 3 },
    { x: cx - chairSize / 2 - 12, y: cy + tH / 2 + 3 },
    { x: cx + chairSize / 2 + 2, y: cy + tH / 2 + 3 },
  ];
  chairs.forEach((ch, i) => {
    items.push(<rect key={`chair-${i}`} x={ch.x} y={ch.y} width={chairSize} height={chairSize} rx={2} fill="#8D6E63" opacity={0.35} />);
  });

  return <g>{items}</g>;
}

function drawCocina(px, py, pw, ph) {
  const items = [];

  // Countertop along top wall
  const counterH = Math.min(ph * 0.18, 24);
  items.push(<rect key="counter-top" x={px + 4} y={py + 4} width={pw - 8} height={counterH} rx={2} fill="#78909C" opacity={0.4} />);

  // Sink
  const sinkW = 20;
  const sinkX = px + pw / 2 - sinkW / 2;
  items.push(<rect key="sink" x={sinkX} y={py + 6} width={sinkW} height={counterH - 6} rx={3} fill="#B0BEC5" opacity={0.5} />);
  items.push(<circle key="drain" cx={sinkX + sinkW / 2} cy={py + 6 + (counterH - 6) / 2} r={2.5} fill="#90A4AE" opacity={0.5} />);

  // Stove (right side of counter)
  const stoveX = px + pw - 30;
  items.push(<rect key="stove" x={stoveX} y={py + 6} width={22} height={counterH - 4} rx={2} fill="#546E7A" opacity={0.4} />);
  // Burners
  items.push(<circle key="b1" cx={stoveX + 6} cy={py + 12} r={3} fill="none" stroke="#455A64" strokeWidth={1} opacity={0.4} />);
  items.push(<circle key="b2" cx={stoveX + 16} cy={py + 12} r={3} fill="none" stroke="#455A64" strokeWidth={1} opacity={0.4} />);
  items.push(<circle key="b3" cx={stoveX + 6} cy={py + 22} r={3} fill="none" stroke="#455A64" strokeWidth={1} opacity={0.4} />);
  items.push(<circle key="b4" cx={stoveX + 16} cy={py + 22} r={3} fill="none" stroke="#455A64" strokeWidth={1} opacity={0.4} />);

  // Fridge (left corner)
  items.push(<rect key="fridge" x={px + 6} y={py + 6} width={18} height={counterH - 2} rx={2} fill="#455A64" opacity={0.35} />);
  items.push(<line key="fridge-line" x1={px + 6} y1={py + 6 + (counterH - 2) * 0.65} x2={px + 24} y2={py + 6 + (counterH - 2) * 0.65} stroke="#37474F" strokeWidth={0.5} opacity={0.3} />);

  // Island / bottom counter (if room is big enough)
  if (ph > 120) {
    const islandW = Math.min(pw * 0.4, 60);
    const islandH = 16;
    items.push(<rect key="island" x={px + pw / 2 - islandW / 2} y={py + ph - islandH - 18} width={islandW} height={islandH} rx={3} fill="#78909C" opacity={0.3} />);
  }

  return <g>{items}</g>;
}

function drawDormitorio(px, py, pw, ph) {
  const items = [];

  // Bed (centered, towards one side)
  const isWide = pw > ph;
  const bedW = isWide ? Math.min(pw * 0.45, 80) : Math.min(pw * 0.6, 65);
  const bedH = isWide ? Math.min(ph * 0.55, 65) : Math.min(ph * 0.45, 80);
  const bedX = px + pw / 2 - bedW / 2;
  const bedY = py + 12;

  // Headboard
  items.push(<rect key="headboard" x={bedX} y={bedY} width={bedW} height={4} rx={1} fill="#5D4037" opacity={0.45} />);
  // Mattress
  items.push(<rect key="bed" x={bedX + 2} y={bedY + 4} width={bedW - 4} height={bedH - 4} rx={3} fill="#E8EAF6" opacity={0.5} stroke="#C5CAE9" strokeWidth={0.5} />);
  // Pillows
  const pillowW = (bedW - 12) / 2;
  items.push(<rect key="p1" x={bedX + 4} y={bedY + 6} width={pillowW} height={10} rx={4} fill="#FFFFFF" opacity={0.6} stroke="#C5CAE9" strokeWidth={0.3} />);
  items.push(<rect key="p2" x={bedX + bedW - pillowW - 4} y={bedY + 6} width={pillowW} height={10} rx={4} fill="#FFFFFF" opacity={0.6} stroke="#C5CAE9" strokeWidth={0.3} />);
  // Blanket fold
  items.push(<line key="blanket" x1={bedX + 4} y1={bedY + bedH * 0.4} x2={bedX + bedW - 4} y2={bedY + bedH * 0.4} stroke="#9FA8DA" strokeWidth={0.5} opacity={0.4} />);

  // Nightstands
  const nsW = 14;
  const nsH = 14;
  items.push(<rect key="ns1" x={bedX - nsW - 4} y={bedY + 2} width={nsW} height={nsH} rx={2} fill="#6D4C41" opacity={0.35} />);
  if (bedX + bedW + nsW + 4 < px + pw) {
    items.push(<rect key="ns2" x={bedX + bedW + 4} y={bedY + 2} width={nsW} height={nsH} rx={2} fill="#6D4C41" opacity={0.35} />);
  }

  // Wardrobe/closet (bottom wall)
  const wardW = Math.min(pw * 0.4, 55);
  const wardH = 14;
  items.push(<rect key="ward" x={px + pw - wardW - 8} y={py + ph - wardH - 6} width={wardW} height={wardH} rx={2} fill="#795548" opacity={0.3} />);
  items.push(<line key="ward-door" x1={px + pw - wardW / 2 - 8} y1={py + ph - wardH - 6} x2={px + pw - wardW / 2 - 8} y2={py + ph - 6} stroke="#6D4C41" strokeWidth={0.5} opacity={0.3} />);

  return <g>{items}</g>;
}

function drawBano(px, py, pw, ph) {
  const items = [];

  // Toilet (bottom-left)
  const toiletX = px + 10;
  const toiletY = py + ph - 28;
  items.push(<rect key="toilet-tank" x={toiletX} y={toiletY} width={14} height={8} rx={2} fill="#E0E0E0" opacity={0.6} stroke="#BDBDBD" strokeWidth={0.5} />);
  items.push(<ellipse key="toilet-bowl" cx={toiletX + 7} cy={toiletY + 16} rx={7} ry={9} fill="#F5F5F5" opacity={0.6} stroke="#BDBDBD" strokeWidth={0.5} />);

  // Shower / tub (top-right corner)
  const showerW = Math.min(pw * 0.35, 35);
  const showerH = Math.min(ph * 0.35, 35);
  items.push(<rect key="shower" x={px + pw - showerW - 6} y={py + 6} width={showerW} height={showerH} rx={3} fill="#B0BEC5" opacity={0.25} stroke="#90A4AE" strokeWidth={0.5} />);
  // Shower head
  items.push(<circle key="shower-head" cx={px + pw - showerW / 2 - 6} cy={py + 12} r={4} fill="none" stroke="#78909C" strokeWidth={0.5} opacity={0.4} />);
  // Drain
  items.push(<circle key="s-drain" cx={px + pw - showerW / 2 - 6} cy={py + 6 + showerH / 2} r={2} fill="#90A4AE" opacity={0.3} />);

  // Sink / vanity (top-left)
  const vanityW = Math.min(pw * 0.3, 28);
  items.push(<rect key="vanity" x={px + 6} y={py + 6} width={vanityW} height={16} rx={2} fill="#E0E0E0" opacity={0.55} stroke="#BDBDBD" strokeWidth={0.5} />);
  items.push(<ellipse key="basin" cx={px + 6 + vanityW / 2} cy={py + 14} rx={vanityW / 3} ry={5} fill="#F5F5F5" opacity={0.5} stroke="#BDBDBD" strokeWidth={0.3} />);

  // Mirror above vanity
  items.push(<rect key="mirror" x={px + 8} y={py + 4} width={vanityW - 4} height={2} rx={0.5} fill="#78909C" opacity={0.2} />);

  return <g>{items}</g>;
}

function drawGarage(px, py, pw, ph) {
  const items = [];
  const cx = px + pw / 2;
  const cy = py + ph / 2;

  // Car outline
  const carW = Math.min(pw * 0.55, 72);
  const carH = Math.min(ph * 0.65, 108);
  const carX = cx - carW / 2;
  const carY = cy - carH / 2;
  items.push(<rect key="car" x={carX} y={carY} width={carW} height={carH} rx={8} fill="none" stroke="#607D8B" strokeWidth={1} strokeDasharray="4,3" opacity={0.3} />);
  // Windshield
  items.push(<rect key="windshield" x={carX + carW * 0.15} y={carY + 8} width={carW * 0.7} height={carH * 0.15} rx={4} fill="#607D8B" opacity={0.12} />);
  // Wheels
  items.push(<rect key="wfl" x={carX - 3} y={carY + carH * 0.2} width={4} height={12} rx={2} fill="#455A64" opacity={0.3} />);
  items.push(<rect key="wfr" x={carX + carW - 1} y={carY + carH * 0.2} width={4} height={12} rx={2} fill="#455A64" opacity={0.3} />);
  items.push(<rect key="wbl" x={carX - 3} y={carY + carH * 0.7} width={4} height={12} rx={2} fill="#455A64" opacity={0.3} />);
  items.push(<rect key="wbr" x={carX + carW - 1} y={carY + carH * 0.7} width={4} height={12} rx={2} fill="#455A64" opacity={0.3} />);

  return <g>{items}</g>;
}

function drawLavadero(px, py, pw, ph) {
  const items = [];

  // Washing machine
  const wmSize = Math.min(pw * 0.3, 24);
  items.push(<rect key="wm" x={px + 8} y={py + 8} width={wmSize} height={wmSize} rx={3} fill="#B0BEC5" opacity={0.45} stroke="#90A4AE" strokeWidth={0.5} />);
  items.push(<circle key="wm-door" cx={px + 8 + wmSize / 2} cy={py + 8 + wmSize / 2} r={wmSize / 3} fill="none" stroke="#78909C" strokeWidth={0.5} opacity={0.4} />);

  // Utility sink
  const sinkW = Math.min(pw * 0.25, 22);
  items.push(<rect key="sink" x={px + pw - sinkW - 8} y={py + 8} width={sinkW} height={18} rx={2} fill="#E0F2F1" opacity={0.5} stroke="#80CBC4" strokeWidth={0.5} />);

  // Drying rack (if room big enough)
  if (ph > 100) {
    const rackW = Math.min(pw * 0.4, 40);
    items.push(<rect key="rack" x={px + pw / 2 - rackW / 2} y={py + ph - 30} width={rackW} height={16} rx={2} fill="none" stroke="#80CBC4" strokeWidth={0.5} strokeDasharray="3,2" opacity={0.3} />);
  }

  return <g>{items}</g>;
}

function drawOficina(px, py, pw, ph) {
  const items = [];
  const cx = px + pw / 2;

  // Desk
  const deskW = Math.min(pw * 0.5, 64);
  const deskH = Math.min(ph * 0.18, 24);
  items.push(<rect key="desk" x={cx - deskW / 2} y={py + 10} width={deskW} height={deskH} rx={2} fill="#6D4C41" opacity={0.35} />);

  // Monitor
  items.push(<rect key="monitor" x={cx - 8} y={py + 12} width={16} height={10} rx={1} fill="#37474F" opacity={0.3} />);

  // Chair
  items.push(<circle key="chair" cx={cx} cy={py + 10 + deskH + 14} r={8} fill="#5C6BC0" opacity={0.25} stroke="#3F51B5" strokeWidth={0.5} />);

  // Bookshelf (right wall)
  if (ph > 100) {
    const shelfH = Math.min(ph * 0.35, 50);
    items.push(<rect key="shelf" x={px + pw - 16} y={py + ph - shelfH - 8} width={10} height={shelfH} rx={1} fill="#795548" opacity={0.25} />);
    for (let i = 0; i < 4; i++) {
      items.push(<line key={`sh-${i}`} x1={px + pw - 15} y1={py + ph - shelfH - 6 + i * (shelfH / 4)} x2={px + pw - 7} y2={py + ph - shelfH - 6 + i * (shelfH / 4)} stroke="#6D4C41" strokeWidth={0.5} opacity={0.2} />);
    }
  }

  return <g>{items}</g>;
}

function drawVestidor(px, py, pw, ph) {
  const items = [];

  // Clothing racks along walls
  const rackDepth = Math.min(pw * 0.2, 18);
  // Left rack
  items.push(<rect key="rack-l" x={px + 4} y={py + 8} width={rackDepth} height={ph - 16} rx={2} fill="#F48FB1" opacity={0.15} stroke="#EC407A" strokeWidth={0.3} />);
  // Right rack
  items.push(<rect key="rack-r" x={px + pw - rackDepth - 4} y={py + 8} width={rackDepth} height={ph - 16} rx={2} fill="#F48FB1" opacity={0.15} stroke="#EC407A" strokeWidth={0.3} />);

  // Hangers (hint lines)
  for (let y = 0; y < ph - 30; y += 10) {
    items.push(<line key={`hl-${y}`} x1={px + 6} y1={py + 14 + y} x2={px + 4 + rackDepth - 2} y2={py + 14 + y} stroke="#EC407A" strokeWidth={0.3} opacity={0.2} />);
    items.push(<line key={`hr-${y}`} x1={px + pw - rackDepth - 2} y1={py + 14 + y} x2={px + pw - 6} y2={py + 14 + y} stroke="#EC407A" strokeWidth={0.3} opacity={0.2} />);
  }

  // Mirror
  items.push(<ellipse key="mirror" cx={px + pw / 2} cy={py + ph / 2} rx={8} ry={16} fill="#E1BEE7" opacity={0.15} stroke="#CE93D8" strokeWidth={0.5} />);

  return <g>{items}</g>;
}

function drawHall(px, py, pw, ph) {
  const items = [];
  // Small console table
  const tW = Math.min(pw * 0.35, 30);
  items.push(<rect key="console" x={px + pw / 2 - tW / 2} y={py + 8} width={tW} height={10} rx={2} fill="#6D4C41" opacity={0.25} />);
  // Rug
  const rugW = Math.min(pw * 0.5, 36);
  const rugH = Math.min(ph * 0.3, 24);
  items.push(<rect key="rug" x={px + pw / 2 - rugW / 2} y={py + ph / 2 - rugH / 2} width={rugW} height={rugH} rx={3} fill="#D7CCC8" opacity={0.2} stroke="#BCAAA4" strokeWidth={0.3} />);
  return <g>{items}</g>;
}

function drawPatio(px, py, pw, ph) {
  const items = [];
  const cx = px + pw / 2;
  const cy = py + ph / 2;
  // Outdoor table
  items.push(<circle key="table" cx={cx} cy={cy} r={Math.min(pw, ph) * 0.12} fill="#795548" opacity={0.2} />);
  // Plants in corners
  items.push(<circle key="plant1" cx={px + 14} cy={py + 14} r={6} fill="#81C784" opacity={0.3} />);
  items.push(<circle key="plant2" cx={px + pw - 14} cy={py + 14} r={6} fill="#66BB6A" opacity={0.25} />);
  if (ph > 100) {
    items.push(<circle key="plant3" cx={px + 14} cy={py + ph - 14} r={5} fill="#A5D6A7" opacity={0.25} />);
  }
  return <g>{items}</g>;
}

// Map type → drawer
const FURNITURE_DRAWERS = {
  living: drawLiving,
  comedor: drawComedor,
  cocina: drawCocina,
  dormitorio: drawDormitorio,
  bano: drawBano,
  'baño': drawBano,
  garage: drawGarage,
  lavadero: drawLavadero,
  pasillo: () => null,
  hall: drawHall,
  balcon: drawPatio,
  patio: drawPatio,
  oficina: drawOficina,
  vestidor: drawVestidor,
};

// ═══════════════════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════════════════

const FurnishedPlanRenderer = ({ plan, onClose }) => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [showLabels, setShowLabels] = useState(true);
  const [showDims, setShowDims] = useState(true);

  const planBounds = useMemo(() => {
    if (!plan?.rooms?.length) return { width: 12, height: 10, minX: 0, minY: 0 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    plan.rooms.forEach((rm) => {
      minX = Math.min(minX, rm.x);
      minY = Math.min(minY, rm.y);
      maxX = Math.max(maxX, rm.x + rm.width);
      maxY = Math.max(maxY, rm.y + rm.height);
    });
    return { width: maxX - minX + 2, height: maxY - minY + 2, minX: minX - 1, minY: minY - 1 };
  }, [plan]);

  const svgW = planBounds.width * SCALE;
  const svgH = planBounds.height * SCALE;

  // Auto-fit
  useEffect(() => {
    if (containerRef.current && plan?.rooms?.length) {
      const cw = containerRef.current.clientWidth - 24;
      const ch = containerRef.current.clientHeight - 24;
      const fit = Math.min(cw / svgW, ch / svgH, 1.5);
      setZoom(Math.max(0.3, Math.min(fit, 1.5)));
      setPan({ x: 0, y: 0 });
    }
  }, [plan, svgW, svgH]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(z => Math.max(0.2, Math.min(3, z + (e.deltaY > 0 ? -0.1 : 0.1))));
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  // Download as SVG
  const downloadSVG = useCallback(() => {
    if (!svgRef.current) return;
    const svgData = svgRef.current.outerHTML;
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano-amoblado-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  const getStyle = (type) => ROOM_STYLES[type] || ROOM_STYLES.default;

  if (!plan?.rooms?.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <div>
          <Armchair className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-400">Generá un plano primero para ver la vista amoblada</p>
        </div>
      </div>
    );
  }

  const totalM2 = plan.rooms.reduce((s, rm) => s + rm.width * rm.height, 0);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[300px]">
      {/* ═══ Toolbar ═══ */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-1">
          <button onClick={() => setZoom(z => Math.min(3, z + 0.2))} className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-emerald-600 transition-colors" title="Acercar">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(z => Math.max(0.2, z - 0.2))} className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-emerald-600 transition-colors" title="Alejar">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-emerald-600 transition-colors" title="Resetear">
            <Maximize2 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <button onClick={() => setShowLabels(l => !l)} className={`p-1.5 rounded-lg transition-colors ${showLabels ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-white text-slate-400'}`} title="Nombres">
            {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button onClick={() => setShowDims(d => !d)} className={`p-1.5 rounded-lg transition-colors ${showDims ? 'bg-emerald-100 text-emerald-600' : 'hover:bg-white text-slate-400'}`} title="Medidas">
            <Grid3X3 className="w-4 h-4" />
          </button>
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <button onClick={downloadSVG} className="p-1.5 hover:bg-white rounded-lg text-slate-500 hover:text-emerald-600 transition-colors" title="Descargar SVG">
            <Download className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] px-1.5 py-0.5 bg-purple-50 text-purple-600 font-semibold rounded-full border border-purple-200">
            Vista Amoblada
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{Math.round(zoom * 100)}%</span>
        </div>
      </div>

      {/* ═══ SVG Canvas ═══ */}
      <div
        ref={containerRef}
        className={`flex-1 overflow-hidden relative ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ minHeight: '300px' }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <svg
            ref={svgRef}
            width={svgW * zoom}
            height={svgH * zoom}
            viewBox={`${planBounds.minX * SCALE} ${planBounds.minY * SCALE} ${svgW} ${svgH}`}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px)`,
              transition: isPanning ? 'none' : 'transform 0.2s ease',
            }}
            className="select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background */}
            <rect
              x={planBounds.minX * SCALE}
              y={planBounds.minY * SCALE}
              width={svgW}
              height={svgH}
              fill="#FAFAF8"
            />

            {/* Rooms */}
            {plan.rooms.map((room, i) => {
              const style = getStyle(room.type);
              const px = room.x * SCALE;
              const py = room.y * SCALE;
              const pw = room.width * SCALE;
              const ph = room.height * SCALE;
              const drawFurniture = FURNITURE_DRAWERS[room.type];

              return (
                <g key={room.id || i}>
                  {/* Room floor */}
                  <rect x={px} y={py} width={pw} height={ph} fill={style.floor} />

                  {/* Floor pattern */}
                  <clipPath id={`clip-room-${room.id || i}`}>
                    <rect x={px} y={py} width={pw} height={ph} />
                  </clipPath>
                  <g clipPath={`url(#clip-room-${room.id || i})`}>
                    {drawFloorPattern(px, py, pw, ph, room.type)}
                  </g>

                  {/* Walls */}
                  <rect x={px} y={py} width={pw} height={ph} fill="none" stroke={style.wall} strokeWidth={3} />

                  {/* Furniture (clipped to room) */}
                  <g clipPath={`url(#clip-room-${room.id || i})`}>
                    {drawFurniture ? drawFurniture(px, py, pw, ph) : null}
                  </g>

                  {/* Room label */}
                  {showLabels && (
                    <g className="pointer-events-none">
                      <rect
                        x={px + pw / 2 - 30}
                        y={py + ph / 2 - 8}
                        width={60}
                        height={showDims ? 22 : 14}
                        rx={4}
                        fill="white"
                        opacity={0.75}
                      />
                      <text
                        x={px + pw / 2}
                        y={py + ph / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={Math.min(11, pw / 7)}
                        fontWeight="700"
                        fill={style.wall}
                        style={{ fontFamily: 'system-ui, sans-serif' }}
                      >
                        {room.name}
                      </text>
                      {showDims && (
                        <text
                          x={px + pw / 2}
                          y={py + ph / 2 + 11}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize={8}
                          fill="#9E9E9E"
                          style={{ fontFamily: 'system-ui, sans-serif' }}
                        >
                          {room.width}×{room.height}m
                        </text>
                      )}
                    </g>
                  )}
                </g>
              );
            })}

            {/* Doors */}
            {plan.doors?.map((door, i) => {
              const dx = door.x * SCALE;
              const dy = door.y * SCALE;
              const isH = door.orientation === 'horizontal';
              const len = (door.width || 0.9) * SCALE;
              return (
                <g key={`door-${i}`} className="pointer-events-none">
                  {/* Door opening (break in wall) */}
                  <rect
                    x={dx - 1}
                    y={dy - 1}
                    width={isH ? len + 2 : 6}
                    height={isH ? 6 : len + 2}
                    fill="#FAFAF8"
                  />
                  {/* Door arc */}
                  <path
                    d={isH
                      ? `M ${dx} ${dy} A ${len} ${len} 0 0 1 ${dx + len} ${dy}`
                      : `M ${dx} ${dy} A ${len} ${len} 0 0 0 ${dx} ${dy + len}`
                    }
                    fill="none"
                    stroke="#8D6E63"
                    strokeWidth={1}
                    opacity={0.35}
                  />
                  {/* Door line */}
                  <line
                    x1={dx} y1={dy}
                    x2={isH ? dx + len : dx}
                    y2={isH ? dy : dy + len}
                    stroke="#8D6E63"
                    strokeWidth={1.5}
                    opacity={0.45}
                  />
                </g>
              );
            })}

            {/* Windows */}
            {plan.windows?.map((win, i) => {
              const wx = win.x * SCALE;
              const wy = win.y * SCALE;
              const isH = win.orientation === 'horizontal';
              const len = (win.width || 1.2) * SCALE;
              return (
                <g key={`win-${i}`} className="pointer-events-none">
                  {/* Window opening */}
                  <rect
                    x={wx - (isH ? 0 : 2)}
                    y={wy - (isH ? 2 : 0)}
                    width={isH ? len : 4}
                    height={isH ? 4 : len}
                    fill="#FAFAF8"
                  />
                  {/* Window glass */}
                  <line
                    x1={wx} y1={wy}
                    x2={isH ? wx + len : wx}
                    y2={isH ? wy : wy + len}
                    stroke="#64B5F6"
                    strokeWidth={3}
                    opacity={0.45}
                  />
                  {/* Center mullion */}
                  <line
                    x1={isH ? wx + len / 2 : wx - 1.5}
                    y1={isH ? wy - 1.5 : wy + len / 2}
                    x2={isH ? wx + len / 2 : wx + 1.5}
                    y2={isH ? wy + 1.5 : wy + len / 2}
                    stroke="#90CAF9"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                </g>
              );
            })}

            {/* Outer dimension lines */}
            {showDims && plan.rooms.length > 0 && (() => {
              let minRX = Infinity, minRY = Infinity, maxRX = -Infinity, maxRY = -Infinity;
              plan.rooms.forEach((rm) => {
                minRX = Math.min(minRX, rm.x);
                minRY = Math.min(minRY, rm.y);
                maxRX = Math.max(maxRX, rm.x + rm.width);
                maxRY = Math.max(maxRY, rm.y + rm.height);
              });
              const totalW = maxRX - minRX;
              const totalH = maxRY - minRY;
              const off = 20;
              return (
                <g className="pointer-events-none">
                  {/* Top dimension */}
                  <line x1={minRX * SCALE} y1={minRY * SCALE - off} x2={maxRX * SCALE} y2={minRY * SCALE - off} stroke="#8D6E63" strokeWidth={0.8} />
                  <line x1={minRX * SCALE} y1={minRY * SCALE - off - 4} x2={minRX * SCALE} y2={minRY * SCALE - off + 4} stroke="#8D6E63" strokeWidth={0.8} />
                  <line x1={maxRX * SCALE} y1={minRY * SCALE - off - 4} x2={maxRX * SCALE} y2={minRY * SCALE - off + 4} stroke="#8D6E63" strokeWidth={0.8} />
                  <text x={(minRX + totalW / 2) * SCALE} y={minRY * SCALE - off - 6} textAnchor="middle" fontSize={9} fill="#8D6E63" fontWeight="600" style={{ fontFamily: 'system-ui' }}>
                    {totalW.toFixed(1)}m
                  </text>
                  {/* Left dimension */}
                  <line x1={minRX * SCALE - off} y1={minRY * SCALE} x2={minRX * SCALE - off} y2={maxRY * SCALE} stroke="#8D6E63" strokeWidth={0.8} />
                  <line x1={minRX * SCALE - off - 4} y1={minRY * SCALE} x2={minRX * SCALE - off + 4} y2={minRY * SCALE} stroke="#8D6E63" strokeWidth={0.8} />
                  <line x1={minRX * SCALE - off - 4} y1={maxRY * SCALE} x2={minRX * SCALE - off + 4} y2={maxRY * SCALE} stroke="#8D6E63" strokeWidth={0.8} />
                  <text x={minRX * SCALE - off - 6} y={(minRY + totalH / 2) * SCALE} textAnchor="middle" fontSize={9} fill="#8D6E63" fontWeight="600" style={{ fontFamily: 'system-ui' }} transform={`rotate(-90, ${minRX * SCALE - off - 6}, ${(minRY + totalH / 2) * SCALE})`}>
                    {totalH.toFixed(1)}m
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* ═══ Info Bar ═══ */}
      <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span>{plan.rooms.length} ambientes</span>
          <span>·</span>
          <span>{rd(totalM2)} m² totales</span>
          <span>·</span>
          <span className="text-purple-400">2D amoblado</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="inline-block w-3 h-0.5 bg-amber-700/40 rounded" /> Puerta
          <span className="inline-block w-3 h-0.5 bg-blue-400/50 rounded ml-1" /> Ventana
          {onClose && (
            <button onClick={onClose} className="ml-2 px-2 py-0.5 text-[10px] text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors font-semibold">
              ← Volver al plano
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FurnishedPlanRenderer;

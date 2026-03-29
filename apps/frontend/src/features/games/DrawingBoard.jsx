import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const COLORS = [
  { name: 'Red', hex: '#ef4444', vi: 'Đỏ' },
  { name: 'Orange', hex: '#f97316', vi: 'Cam' },
  { name: 'Yellow', hex: '#eab308', vi: 'Vàng' },
  { name: 'Green', hex: '#22c55e', vi: 'Xanh lá' },
  { name: 'Blue', hex: '#3b82f6', vi: 'Xanh dương' },
  { name: 'Purple', hex: '#a855f7', vi: 'Tím' },
  { name: 'Pink', hex: '#ec4899', vi: 'Hồng' },
  { name: 'Brown', hex: '#92400e', vi: 'Nâu' },
  { name: 'Black', hex: '#000000', vi: 'Đen' },
  { name: 'White', hex: '#ffffff', vi: 'Trắng' },
];

export default function DrawingBoard() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[4]); // Blue
  const [brushSize, setBrushSize] = useState(8);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Responsive canvas size
    const width = window.innerWidth - 40;
    const height = window.innerHeight - 200;
    canvas.width = Math.min(width, 1200);
    canvas.height = Math.min(height, 600);

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setContext(ctx);
  }, []);

  const startDrawing = (e) => {
    if (!context) return;
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || !context) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    context.lineWidth = brushSize;
    context.strokeStyle = color.hex;
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.closePath();
    }
  };

  const clearCanvas = () => {
    if (!context) return;
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const speakColor = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(color.name);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    synth.cancel();
    synth.speak(utterance);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'my-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b-4 border-slate-300 bg-gradient-to-r from-pink-300 to-purple-300 px-6 py-3">
        <h1 className="text-3xl font-black text-white">🎨 Bảng Vẽ Tô Màu</h1>
        <Link
          to="/dashboard"
          className="rounded-full bg-white px-4 py-2 font-bold text-purple-600 transition hover:bg-slate-100"
        >
          ← Quay lại
        </Link>
      </header>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-5 overflow-auto">
        <div className="rounded-2xl border-4 border-slate-400 bg-white shadow-2xl">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="block cursor-crosshair rounded-xl bg-white"
            style={{ touchAction: 'none' }}
          />
        </div>
      </div>

      {/* Controls Bar */}
      <footer className="border-t-4 border-slate-300 bg-slate-50 p-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 sm:justify-between">
          {/* Color Palette */}
          <div className="flex items-center gap-3">
            <p className="text-xs font-black text-slate-700 uppercase">Màu:</p>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-9 w-9 rounded-full border-4 transition transform hover:scale-110 ${
                    color.hex === c.hex ? 'border-black scale-125' : 'border-slate-300'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.vi}
                />
              ))}
            </div>
          </div>

          {/* Current Color */}
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-full border-2 border-slate-300"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-sm font-bold text-slate-700">{color.vi}</span>
            <button
              type="button"
              onClick={speakColor}
              className="rounded-full bg-sky-500 px-3 py-1 text-sm font-bold text-white transition hover:bg-sky-600"
            >
              🔊
            </button>
          </div>

          {/* Brush Size */}
          <div className="flex items-center gap-3">
            <p className="text-xs font-black text-slate-700">Cỡ: {brushSize}px</p>
            <input
              type="range"
              min="1"
              max="40"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-24"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearCanvas}
              className="rounded-full bg-red-500 px-4 py-2 font-bold text-white transition hover:bg-red-600"
            >
              🗑️ Xóa
            </button>
            <button
              type="button"
              onClick={downloadDrawing}
              className="rounded-full bg-emerald-500 px-4 py-2 font-bold text-white transition hover:bg-emerald-600"
            >
              💾 Lưu
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

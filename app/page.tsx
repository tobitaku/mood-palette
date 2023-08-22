'use client';

import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, KeyboardEvent } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Toaster, toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [mood, setMood] = useState('');
  const [color, setColor] = useState('#000033');
  const [loading, setLoading] = useState(false);
  const placeholder = 'The night sky';

  const handleClick = async () => {
    if (!mood) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${new URL(window.location.href)}/api`, {
        method: 'POST',
        body: JSON.stringify({ content: mood }),
        cache: 'no-store',
      });
      const { color } = await res.json();
      setColor(color);
      console.log('color', color);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      await handleClick();
    }
  };

  const handleColorClick = async () => {
    await navigator.clipboard.writeText(color);
    toast('Color copied to clipboard!', {
      icon: '🎨',
      style: {
        background: '#18181b',
        color: '#fff',
      },
    });
  };

  const isHighContrast = () => {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128;
  };

  return (
    <main className="flex flex-col justify-center items-center bg-black text-white space-y-10">
      <div className="flex flex-col items-center justify-center mt-20">
        <h1 className="text-6xl font-extrabold tracking-tighter">
          Mood Palette 🎨
        </h1>
        <h2>Use AI to generate a color based on your mood</h2>
      </div>
      <div className="flex justify-center items-end space-x-3">
        <input
          name="color"
          type="text"
          className="text-white placeholder-zinc-400 bg-zinc-900 h-12 rounded-lg px-6 cursor-pointer text-sm w-80 ring-1 ring-slate-900/10 shadow-sm focus:outline-none hover:bg-zinc-800"
          placeholder={placeholder}
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="px-6 text-sm text-center font-medium h-12 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-950 disabled:hover:cursor-not-allowed"
          onClick={handleClick}
          disabled={loading || !mood}
        >
          <span>Think</span>
          {loading && (
            <span className="ml-2">
              <LoadingSpinner />
            </span>
          )}
        </button>
      </div>
      {mood && !color && (
        <div>
          <p className="text-red-500">Try a different prompt.</p>
        </div>
      )}
      <div className="w-5/6 max-w-4xl h-96 border border-zinc-900 rounded-lg">
        <div
          className="rounded-lg w-full h-full flex flex-col justify-end"
          style={{ backgroundColor: color }}
        >
          <div className="flex flex-col justify-center items-center mb-14 tracking-tighter space-y-4">
            <div className="font-extrabold text-3xl">
              {color && (
                <span
                  onClick={handleColorClick}
                  className={`flex items-center rounded-lg cursor-pointer px-3 py-2 hover:bg-zinc-100/20 ${
                    isHighContrast() ? 'text-black' : 'text-white'
                  }`}
                >
                  {color.toLocaleLowerCase()}{' '}
                  <FontAwesomeIcon className="ml-4 text-sm" icon={faCopy} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {color && (
        <div className="pb-4">
          <HexColorPicker color={color} onChange={setColor} />
        </div>
      )}
      <Toaster position="bottom-center" />
    </main>
  );
}

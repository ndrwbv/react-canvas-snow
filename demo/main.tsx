import { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Snow, SnowConfig } from '../src';

const DEFAULTS: SnowConfig = {
  size: { min: 2, max: 9 },
  speed: { min: 15, max: 25 },
  count: 350,
  opacity: { min: 0.1, max: 0.5 },
  swing: { min: 20, max: 200 },
  color: 'white',
};

const PRESETS: Record<string, Partial<SnowConfig>> = {
  Default: {},
  'Light snow': {
    count: 100,
    size: { min: 1, max: 4 },
    speed: { min: 20, max: 35 },
  },
  Blizzard: {
    count: 800,
    size: { min: 3, max: 12 },
    speed: { min: 5, max: 12 },
  },
  'Golden particles': {
    count: 200,
    color: '#ffd700',
    opacity: { min: 0.3, max: 0.8 },
  },
  'Gentle drift': { count: 250, swing: { min: 5, max: 30 } },
};

function RangeInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="control-row">
      <span className="control-label">
        {label} <span className="control-value">{value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function App() {
  const [config, setConfig] = useState<SnowConfig>(DEFAULTS);
  const [open, setOpen] = useState(true);
  const [bg, setBg] = useState('#000000');

  const update = useCallback(
    (patch: Partial<SnowConfig>) =>
      setConfig((prev) => {
        const next = { ...prev, ...patch };
        if (patch.size) next.size = { ...prev.size, ...patch.size };
        if (patch.speed) next.speed = { ...prev.speed, ...patch.speed };
        if (patch.opacity) next.opacity = { ...prev.opacity!, ...patch.opacity };
        if (patch.swing) next.swing = { ...prev.swing!, ...patch.swing };
        return next;
      }),
    [],
  );

  const applyPreset = (name: string) => {
    const preset = PRESETS[name];
    const merged: SnowConfig = {
      ...DEFAULTS,
      ...preset,
      size: { ...DEFAULTS.size, ...preset.size },
      speed: { ...DEFAULTS.speed, ...preset.speed },
      opacity: { ...DEFAULTS.opacity!, ...preset.opacity },
      swing: { ...DEFAULTS.swing!, ...preset.swing },
      color: preset.color ?? DEFAULTS.color,
    };
    setConfig(merged);
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: bg,
          transition: 'background 0.3s',
        }}
      >
        <Snow config={config} style={{ position: 'absolute', inset: 0 }} />
      </div>

      <button className="toggle-btn" onClick={() => setOpen((v) => !v)}>
        {open ? '✕' : '⚙'}
      </button>

      {open && (
        <div className="panel">
          <h2>Snow Controls</h2>

          <div className="presets">
            {Object.keys(PRESETS).map((name) => (
              <button key={name} className="preset-btn" onClick={() => applyPreset(name)}>
                {name}
              </button>
            ))}
          </div>

          <fieldset>
            <legend>General</legend>
            <RangeInput
              label="Count"
              value={config.count}
              min={10}
              max={1500}
              step={10}
              onChange={(v) => update({ count: v })}
            />
            <label className="control-row">
              <span className="control-label">Color</span>
              <input
                type="color"
                value={config.color === 'white' ? '#ffffff' : config.color!}
                onChange={(e) => update({ color: e.target.value })}
              />
            </label>
            <label className="control-row">
              <span className="control-label">Background</span>
              <input
                type="color"
                value={bg}
                onChange={(e) => setBg(e.target.value)}
              />
            </label>
          </fieldset>

          <fieldset>
            <legend>Size (px)</legend>
            <RangeInput
              label="Min"
              value={config.size.min}
              min={1}
              max={20}
              step={0.5}
              onChange={(v) =>
                update({ size: { min: v, max: Math.max(v, config.size.max) } })
              }
            />
            <RangeInput
              label="Max"
              value={config.size.max}
              min={1}
              max={30}
              step={0.5}
              onChange={(v) =>
                update({ size: { min: Math.min(v, config.size.min), max: v } })
              }
            />
          </fieldset>

          <fieldset>
            <legend>Speed (seconds to fall)</legend>
            <RangeInput
              label="Min"
              value={config.speed.min}
              min={1}
              max={60}
              step={1}
              onChange={(v) =>
                update({
                  speed: { min: v, max: Math.max(v, config.speed.max) },
                })
              }
            />
            <RangeInput
              label="Max"
              value={config.speed.max}
              min={1}
              max={60}
              step={1}
              onChange={(v) =>
                update({
                  speed: { min: Math.min(v, config.speed.min), max: v },
                })
              }
            />
          </fieldset>

          <fieldset>
            <legend>Opacity</legend>
            <RangeInput
              label="Min"
              value={config.opacity!.min}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) =>
                update({
                  opacity: {
                    min: v,
                    max: Math.max(v, config.opacity!.max),
                  },
                })
              }
            />
            <RangeInput
              label="Max"
              value={config.opacity!.max}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) =>
                update({
                  opacity: {
                    min: Math.min(v, config.opacity!.min),
                    max: v,
                  },
                })
              }
            />
          </fieldset>

          <fieldset>
            <legend>Swing (px)</legend>
            <RangeInput
              label="Min"
              value={config.swing!.min}
              min={0}
              max={400}
              step={5}
              onChange={(v) =>
                update({
                  swing: { min: v, max: Math.max(v, config.swing!.max) },
                })
              }
            />
            <RangeInput
              label="Max"
              value={config.swing!.max}
              min={0}
              max={400}
              step={5}
              onChange={(v) =>
                update({
                  swing: { min: Math.min(v, config.swing!.min), max: v },
                })
              }
            />
          </fieldset>
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);

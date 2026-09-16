import React from 'react';
import { MinusIcon, PlusIcon } from './icons';

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  label = null,
}) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div className={`qty qty--${size}`}>
      {label && <span className="qty__label">{label}</span>}
      <button
        type="button"
        className="qty__btn"
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <MinusIcon width={14} height={14} />
      </button>
      <input
        className="qty__input"
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => {
          const next = parseInt(e.target.value, 10);
          onChange(Number.isNaN(next) ? min : Math.min(max, Math.max(min, next)));
        }}
        aria-label={label || 'Quantity'}
      />
      <button
        type="button"
        className="qty__btn"
        onClick={increment}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <PlusIcon width={14} height={14} />
      </button>
    </div>
  );
}
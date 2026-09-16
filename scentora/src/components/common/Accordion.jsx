import React, { useState } from 'react';
import { ChevronDown } from './icons';
import { cx } from '../../utils/helpers';

export default function Accordion({ items, defaultOpen = 0, variant = 'default' }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);

  return (
    <div className={cx('accordion', `accordion--${variant}`)}>
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={item.title || item.q}
            className={cx('accordion__item', isOpen && 'is-open')}
          >
            <button
              className="accordion__trigger"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span>{item.title || item.q}</span>
              <ChevronDown className="accordion__chevron" width={16} height={16} />
            </button>
            <div
              className="accordion__panel"
              hidden={!isOpen}
              style={{ '--content': 'auto' }}
            >
              <div className="accordion__content">{item.content || item.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
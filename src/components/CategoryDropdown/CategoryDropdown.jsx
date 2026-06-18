import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Package } from 'lucide-react';
import './CategoryDropdown.css';

export default function CategoryDropdown({ categories, activeCategory, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const activeCat = categories.find((c) => c.value === activeCategory) || categories[0];
  const ActiveIcon = activeCat.icon;

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    onSelect(value);
    setOpen(false);
  };

  return (
    <div className="category-dropdown" ref={ref}>
      <button
        className="category-dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <ActiveIcon size={16} />
        <span>{activeCat.label}</span>
        <ChevronDown size={16} className={`category-dropdown-chevron ${open ? 'open' : ''}`} />
      </button>

      {open && (
        <div className="category-dropdown-menu">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                className={`category-dropdown-item ${activeCategory === cat.value ? 'active' : ''}`}
                onClick={() => handleSelect(cat.value)}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

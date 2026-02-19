import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from '../config/api';

export default function Autocomplete({ value, onChange, onSelect, placeholder, className }) {
  const { token } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);
  const typingRef = useRef(false);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!typingRef.current || !value || value.length < 4) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(apiUrl(`/api/pokemon-list?q=${encodeURIComponent(value)}`), { headers });
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setOpen(data.length > 0);
          setActiveIndex(-1);
        }
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [value]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      selectItem(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const selectItem = (name) => {
    typingRef.current = false;
    onSelect(name);
    setOpen(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative flex-1">
      <input
        type="text"
        value={value}
        onChange={(e) => { typingRef.current = true; onChange(e.target.value); }}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        placeholder={placeholder}
        className={className}
      />
      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border-2 border-blue-200 dark:bg-gray-800 dark:border-white/20 rounded-xl overflow-hidden shadow-2xl max-h-60 overflow-y-auto">
          {suggestions.map((name, i) => (
            <li
              key={name}
              onClick={() => selectItem(name)}
              className={`px-4 py-2 cursor-pointer capitalize text-sm transition-colors ${
                i === activeIndex
                  ? 'bg-red-600 text-white'
                  : 'text-gray-800 hover:bg-blue-50 dark:text-gray-300 dark:hover:bg-white/10'
              }`}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

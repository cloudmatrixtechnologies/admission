// src/components/common/CountryPhoneInput.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { COUNTRIES, getCountryByDialCode } from '../../services/countries';
import './CountryPhoneInput.css';

export default function CountryPhoneInput({
  id,
  country = '+91',
  onCountryChange,
  value = '',
  onChange,
  disabled = false,
  required = false,
  placeholder,
  rightAction = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedName, setSelectedName] = useState(() => getCountryByDialCode(country).name);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 290 });

  const wrapperRef = useRef(null);
  const dropdownRef = useRef(null);
  const numberInputRef = useRef(null);

  const selectedCountry =
    COUNTRIES.find((c) => c.dialCode === country && c.name === selectedName) ||
    getCountryByDialCode(country);

  const updatePosition = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const dropdownWidth = Math.min(300, Math.max(rect.width, 260));
    const dropdownHeight = 265;
    const spaceBelow = window.innerHeight - rect.bottom;

    // Flip upward if there is less than 265px below the input box
    const openUpward = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

    setDropdownCoords({
      top: openUpward ? Math.max(8, rect.top - dropdownHeight - 6) : rect.bottom + 6,
      left: Math.min(rect.left, window.innerWidth - dropdownWidth - 12),
      width: dropdownWidth,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleClickOutside = (e) => {
      const insideWrapper = wrapperRef.current && wrapperRef.current.contains(e.target);
      const insideDropdown = dropdownRef.current && dropdownRef.current.contains(e.target);
      if (!insideWrapper && !insideDropdown) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, updatePosition]);

  const filteredCountries = COUNTRIES.filter((c) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.dialCode.includes(q);
  });

  const handleSelectCountry = (item) => {
    setSelectedName(item.name);
    setIsOpen(false);
    setSearchTerm('');
    if (onCountryChange) {
      onCountryChange(item.dialCode, item);
    }
    if (onChange && value.length > item.maxLen) {
      onChange(value.slice(0, item.maxLen));
    }
    requestAnimationFrame(() => {
      numberInputRef.current?.focus();
    });
  };

  return (
    <div className="cpi-wrapper" ref={wrapperRef}>
      <div className={`cpi-input-box ${disabled ? 'cpi-disabled' : ''}`}>
        <button
          type="button"
          className="cpi-toggle-btn"
          disabled={disabled}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label="Select country code"
        >
          <span className="cpi-dial">{selectedCountry.dialCode}</span>
          <span className={`cpi-caret ${isOpen ? 'open' : ''}`}>▾</span>
        </button>

        <input
          ref={numberInputRef}
          id={id}
          type="tel"
          inputMode="numeric"
          maxLength={selectedCountry.maxLen}
          required={required}
          disabled={disabled}
          className="cpi-number-input"
          placeholder={placeholder || selectedCountry.placeholder}
          value={value}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '').slice(0, selectedCountry.maxLen);
            onChange && onChange(digits);
          }}
        />

        {rightAction && <div className="cpi-right-slot">{rightAction}</div>}
      </div>

      {/* Portaled Dropdown so modal overflow:hidden never clips it */}
      {isOpen &&
        !disabled &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={dropdownRef}
            className="cpi-dropdown cpi-dropdown-portaled"
            role="listbox"
            style={{
              position: 'fixed',
              top: `${dropdownCoords.top}px`,
              left: `${dropdownCoords.left}px`,
              width: `${dropdownCoords.width}px`,
              zIndex: 99999,
            }}
          >
            <div className="cpi-search-wrap">
              <input
                type="text"
                className="cpi-search-input"
                placeholder="Search country or +code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
            <div className="cpi-list">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((item) => {
                  const isSelected =
                    item.dialCode === selectedCountry.dialCode &&
                    item.name === selectedCountry.name;
                  return (
                    <button
                      key={`${item.name}-${item.dialCode}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`cpi-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectCountry(item)}
                    >
                      <span className="cpi-opt-name">{item.name}</span>
                      <span className="cpi-opt-dial">{item.dialCode}</span>
                    </button>
                  );
                })
              ) : (
                <div className="cpi-empty">No matching country</div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
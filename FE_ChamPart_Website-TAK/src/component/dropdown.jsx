import { useState } from "react";
import Drop from '../assets/svg/button-dropdown.svg';

function Dropdown({ children, items, selected = [], onChange }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(!open);

  const handleToggle = (item) => {
    if (selected.includes(item)) {
      onChange(selected.filter(s => s !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  const handleReset = () => {
    onChange([]);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button 
        type="button" 
        className="flex items-center gap-2 px-3 py-2 hover:text-gray-600"
        onClick={handleClick}
      >
        <img 
          src={Drop} 
          alt="Dropdown" 
          className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
        />
        <span>{children}</span>
        {selected.length > 0 && (
          <span className="ml-1 bg-[#008DDA] text-white text-xs px-2 py-0.5 rounded-full">
            {selected.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-2 max-h-80 overflow-auto z-20">
            <div
              onClick={handleReset}
              className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer text-[#008DDA] font-medium"
            >
              Reset ({selected.length} dipilih)
            </div>
            <hr className="my-1"/>
            {items.map((item, i) => (
              <label 
                key={i}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(item)}
                  onChange={() => handleToggle(item)}
                  className="w-4 h-4 accent-[#008DDA]"
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Dropdown;
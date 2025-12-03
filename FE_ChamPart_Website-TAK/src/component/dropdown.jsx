import { useState } from "react";
import Drop from '../assets/svg/button-dropdown.svg';

function Dropdown({ children, items }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(children); 

  const handleClick = () => setOpen(!open);

  const handleSelect = (item) => {
    setSelected(item);   
    setOpen(false);     
  };
  const handleReset = () => {
    setSelected(null);  
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button 
        type="button" 
        className="flex items-center gap-2 px-3 py-2"
        onClick={handleClick}
      >
        <img src={Drop} alt="Dropdown" className="h-5 w-5" />
        <span>{selected ?? children}</span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 max-h-56 overflow-auto z-10">
          <div
            onClick={handleReset}
            className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer text-gray-500 font-medium"
            >
              Reset
          </div>
          <hr className="my-1"/>
          {items.map((item, i) => (
            <div 
              key={i}
              onClick={() => handleSelect(item)}
              className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default Dropdown;

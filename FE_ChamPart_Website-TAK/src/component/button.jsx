function Button({ icon, label, value, active, onClick }) {
  return (
    <button 
      type="button"
      onClick={() => onClick(value)}
      className={`space-y-2 p-4 border rounded-lg shadow-md transition-all duration-200
        ${active === value
          ? "ring-2 ring-blue-600 -translate-y-0.5"
          : "bg-white text-black border-gray-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400"
        }
      `}
    >
      <div className="mx-auto w-16 h-16 flex items-center justify-center">
        <img src={icon} alt={label} className="w-10 h-10" />
      </div>
      <div className="font-medium">{label}</div>
    </button>
  );
}

export default Button;

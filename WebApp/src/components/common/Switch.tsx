interface SwitchProps {
  label: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}

export default function CustomSwitch({ label, enabled, onChange }: SwitchProps) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <div className="relative">
        <input 
          type="checkbox" 
          className="sr-only" 
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={`block w-10 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
      </div>
      <span className="text-gray-400 font-medium">{label}</span>
    </label>
  );
}
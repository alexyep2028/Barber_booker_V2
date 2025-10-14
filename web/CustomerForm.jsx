import React from 'react';
import { User, Phone, Check } from 'lucide-react';

export default function CustomerForm({ value, onChange, onSubmit }) {
  const set = (k, v) => onChange?.({ ...value, [k]: v });
  
  const handleSubmit = () => {
    if (!value.name || !value.phone) {
      alert("Please enter your name and phone number");
      return;
    }
    onSubmit();
  };
  
  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <User size={20} className="text-gray-600" />
        <input
          className="flex-1 rounded-lg border px-3 py-2"
          placeholder="Full name"
          value={value.name}
          onChange={(e) => set('name', e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Phone size={20} className="text-gray-600" />
        <input
          className="flex-1 rounded-lg border px-3 py-2"
          placeholder="Phone number"
          value={value.phone}
          onChange={(e) => set('phone', e.target.value)}
        />
      </div>
      
      <button 
        onClick={handleSubmit}
        className="mt-2 rounded-lg bg-blue-500 px-4 py-3 text-white font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
      >
        <Check size={20} />
        Confirm Booking
      </button>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

// API Base URL - adjust if your backend runs on a different port
const API_BASE = 'http://localhost:8000/api/v1';

export default function ServiceSelector({ value, onSelect }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API_BASE}/services`);
        if (!r.ok) throw new Error(`Failed to fetch services: ${r.status}`);
        const data = await r.json();
        
        // Backend returns array directly
        setServices(Array.isArray(data) ? data : []);
      } catch (e) { 
        console.error('Service fetch error:', e);
        setErr(e.message); 
        setServices([]);
      } finally { 
        setLoading(false); 
      }
    })();
  }, []);

  const handleSelect = (service) => {
    onSelect?.(service);
    setTimeout(() => {
      document.getElementById('calendar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  if (loading) return <p className="text-gray-500">Loading services...</p>;
  if (err) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-600 flex items-center gap-2">
        <AlertCircle size={20} />
        Failed to load services: {err}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        Make sure your backend is running on port 8000
      </p>
    </div>
  );

  if (!Array.isArray(services) || services.length === 0) {
    return <p className="text-gray-600">No services available.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {services.map(s => {
        const active = value?.id === s.id;
        return (
          <button
            key={s.id}
            onClick={() => handleSelect(s)}
            className={`text-left rounded-xl p-4 shadow-md bg-white border-2 transition-all hover:shadow-lg ${
              active ? 'border-blue-500 bg-blue-50' : 'border-transparent'
            }`}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">{s.name}</h3>
              <span className="font-medium text-grey-600">${s.price}</span>
            </div>
            <p className="text-sm text-gray-500">{s.durationMin || s.duration_min} min</p>
          </button>
        );
      })}
    </div>
  );
}

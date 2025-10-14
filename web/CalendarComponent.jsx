import React, { useState, useEffect, useMemo } from 'react';
import { Calendar } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api/v1';

// Local YYYY-MM-DD (avoids UTC shift from toISOString)
const ymdLocal = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
  .toLocaleDateString('en-CA'); // yyyy-mm-dd
const addDaysLocal = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export default function CalendarComponent({ valueISO, onChange, serviceId }) {
  // Compute min/max once
  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    return {
      minDate: ymdLocal(today),
      maxDate: ymdLocal(addDaysLocal(today, 6)), // today .. today+6
    };
  }, []);

  const [dateStr, setDateStr] = useState(minDate);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Clamp if dateStr drifts outside range
  useEffect(() => {
    if (dateStr < minDate) setDateStr(minDate);
    else if (dateStr > maxDate) setDateStr(maxDate);
  }, [dateStr, minDate, maxDate]);

  useEffect(() => {
    if (!serviceId) { setSlots([]); return; }
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const r = await fetch(`${API_BASE}/availability?service_id=${serviceId}&date=${dateStr}`);
        if (!r.ok) throw new Error(`Failed to fetch availability: ${r.status}`);
        const json = await r.json();
        setSlots(json.slots || []);
      } catch (e) {
        console.error('Availability fetch error:', e);
        setErr(e.message);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [serviceId, dateStr]);

  if (!serviceId) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
        Please select a service first
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <Calendar size={20} className="text-gray-600" />
        <input
          type="date"
          className="flex-1 rounded-lg border px-3 py-2"
          style={{ color: 'black' }}
          value={dateStr}
          onChange={(e) => {
            const v = e.target.value;
            if (v < minDate) setDateStr(minDate);
            else if (v > maxDate) setDateStr(maxDate);
            else setDateStr(v);
          }}
          min={minDate}
          max={maxDate}          // 👈 restrict to 7-day window
        />
      </div>

      {err && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">Failed to load availability: {err}</p>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading available times...</p>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((iso) => {
            const active = valueISO === iso;
            const d = new Date(iso);
            return (
              <button
                key={iso}
                onClick={() => onChange?.(iso)}
                className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                  active ? 'bg-blue-500 text-white border-blue-500'
                         : 'bg-white hover:bg-gray-50 border-gray-500'
                }`}
              >
                {d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </button>
            );
          })}
          {!slots.length && !loading && (
            <p className="text-gray-500 col-span-full text-center py-4">
              No times available for this date
            </p>
          )}
        </div>
      )}
    </div>
  );
}

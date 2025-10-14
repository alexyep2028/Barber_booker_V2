import React from 'react';

export default function Summary({ service, slotISO }) {
  const dateStr = slotISO
    ? new Date(slotISO).toLocaleString([], { 
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    : '—';

  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-white p-4 border border-blue-100">
      <h3 className="font-semibold text-gray-800 mb-3">Booking Summary</h3>
      <ul className="text-sm text-gray-700 space-y-2">
        <li className="flex justify-between">
          <span className="text-gray-500">Service:</span>
          <span className="font-medium">{service?.name ?? '—'}</span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-500">Duration:</span>
          <span>{service ? `${service.durationMin || service.duration_min} min` : '—'}</span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-500">Price:</span>
          <span className="font-medium text-grey-600">
            {service ? `$${service.price}` : '—'}
          </span>
        </li>
        <li className="flex justify-between">
          <span className="text-gray-500">Date & Time:</span>
          <span className="font-medium">{dateStr}</span>
        </li>
      </ul>
    </div>
  );
}

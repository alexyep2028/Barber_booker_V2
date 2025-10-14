
// --- Confirm booking: call API (backend is source of truth) ---
const confirm = async () => {
  if (!service || !slotISO || !client?.name || !client?.phone) {
    alert("Please select a service & time and enter your name and phone.");
    return;
  }

  const payload = {
    service_id: service.id,
    start_time: slotISO,        // ✅ Changed from start_iso
    customer: {                  // ✅ Changed from client
      name: client.name,
      phone: client.phone,
      email: client.email || null
    },
    notes: null
  };

  try {
    const res = await fetch('/api/v1/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) throw new Error(text || `POST /api/v1/bookings ${res.status}`);

    // optional: read JSON if your API returns it
    // const saved = JSON.parse(text);

    alert("Booked! 🎉 You'll get an SMS shortly.");

    // reset form
    setService(null);
    setSlotISO(null);
    setClient({ name: "", phone: "", email: "" });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    console.error("Booking error:", e);
    alert(`Booking failed: ${e.message || e}`);
  }
};

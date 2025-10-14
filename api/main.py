from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from typing import List, Optional
import uvicorn

#python main.py
app = FastAPI(title="AlexYepBarber API", version="2.0.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class Service(BaseModel):
    id: int
    name: str
    duration_min: int
    durationMin: int # Frontend compatibility
    price: float

class Customer(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None

class BookingRequest(BaseModel):
    service_id: int
    start_time: str  # ISO format
    customer: Customer

class BookingResponse(BaseModel):
    id: int
    service_id: int
    start_time: str
    end_time: str
    customer: Customer
    status: str

# --- In-memory storage (MVP) ---
services_db = [
    {
        "id": 1,
        "name": "Haircut",
        "duration_min": 30,
        "durationMin": 30,
        "price": 30.0
    },
    {
        "id": 2,
        "name": "Haircut + Beard",
        "duration_min": 45,
        "durationMin": 45,
        "price": 35.0
    },
    {
        "id": 3,
        "name": "Lineup",
        "duration_min": 15,
        "durationMin": 15,
        "price": 15.0
    },
]

bookings_db = []
booking_id_counter = 1

# Working hours: Mon, Wed, Fri, Sat, Sun from 9 AM to 2 PM
WORKING_DAYS = [0, 2, 4, 5, 6]  # Monday=0, Sunday=2
WORKING_HOURS = (9, 14)  # 9 AM to 2 PM

def generate_time_slots(date_str: str, duration_min: int = 30) -> List[str]:
    """Generate available time slots for a given date"""
    slots = []
    
    try:
        date = datetime.fromisoformat(date_str.replace('Z', '+00:00'))
    except:
        date = datetime.strptime(date_str, '%Y-%m-%d')
    
    # Check if working day
    if date.weekday() not in WORKING_DAYS:
        return []
    
    # Generate slots from 9 AM to 6 PM
    start_hour, end_hour = WORKING_HOURS
    current = date.replace(hour=start_hour, minute=0, second=0, microsecond=0)
    end_time = date.replace(hour=end_hour, minute=0, second=0, microsecond=0)
    
    while current < end_time:
        # Check if slot is available (not booked)
        slot_iso = current.isoformat()
        is_booked = any(
            b['start_time'] == slot_iso or 
            (datetime.fromisoformat(b['start_time']) <= current < 
             datetime.fromisoformat(b['end_time']))
            for b in bookings_db
        )
        
        if not is_booked:
            slots.append(slot_iso)
        
        current += timedelta(minutes=30)  # 30-min intervals
    
    return slots

# --- Endpoints ---
@app.get("/api/v1/health")
def health_check():
    return {"ok": True, "status": "ok"}

@app.get("/api/v1/services", response_model=List[Service])
def get_services():
    """Get all available services"""
    return services_db

@app.get("/api/v1/availability")
def get_availability(service_id: int, date: str):
    """Get available time slots for a service on a specific date"""
    # Verify service exists
    service = next((s for s in services_db if s['id'] == service_id), None)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Generate slots
    slots = generate_time_slots(date, service['duration_min'])
    
    return {"date": date, "service_id": service_id, "slots": slots}

@app.post("/api/v1/bookings", response_model=BookingResponse)
def create_booking(booking: BookingRequest):
    """Create a new booking"""
    global booking_id_counter
    
    # Verify service exists
    service = next((s for s in services_db if s['id'] == booking.service_id), None)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Parse start time
    try:
        start_dt = datetime.fromisoformat(booking.start_time.replace('Z', '+00:00'))
    except:
        raise HTTPException(status_code=400, detail="Invalid start_time format")
    
    # Calculate end time
    end_dt = start_dt + timedelta(minutes=service['duration_min'])
    
    # Check for conflicts
    for b in bookings_db:
        existing_start = datetime.fromisoformat(b['start_time'])
        existing_end = datetime.fromisoformat(b['end_time'])
        
        # Check if times overlap
        if (start_dt < existing_end and end_dt > existing_start):
            raise HTTPException(status_code=409, detail="Time slot already booked")
    
    # Create booking
    new_booking = {
        "id": booking_id_counter,
        "service_id": booking.service_id,
        "start_time": start_dt.isoformat(),
        "end_time": end_dt.isoformat(),
        "customer": booking.customer.dict(),
        "status": "confirmed"
    }
    
    bookings_db.append(new_booking)
    booking_id_counter += 1
    
    print(f"✅ Booking created: {booking.customer.name} - {service['name']} at {start_dt}")
    
    return new_booking

@app.get("/api/v1/bookings")
def list_bookings():
    """List all bookings (admin endpoint)"""
    return bookings_db

if __name__ == "__main__":
    print("🚀 Starting AlexYepBarber API on http://localhost:8000")
    print("📖 API docs available at http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)

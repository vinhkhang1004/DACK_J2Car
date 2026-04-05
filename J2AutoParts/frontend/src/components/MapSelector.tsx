import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapSelectorProps {
  onLocationSelected: (address: string) => void;
  onClose: () => void;
}

export default function MapSelector({ onLocationSelected, onClose }: MapSelectorProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([10.762622, 106.660172], 13);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', async (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;
      setPosition(latlng);
      
      if (!markerRef.current) {
        markerRef.current = L.marker(latlng, { icon: customIcon }).addTo(map);
      } else {
        markerRef.current.setLatLng(latlng);
      }

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
        const data = await res.json();
        if (data && data.display_name) {
          setAddress(data.display_name);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      }
    });

    // Try geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map.setView([pos.coords.latitude, pos.coords.longitude], 13);
        },
        () => {}
      );
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div className="card" style={{ width: "90%", maxWidth: "800px", padding: "1.5rem", position: "relative" }}>
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", color: "var(--text)", cursor: "pointer", zIndex: 1001 }}
        >
          &times;
        </button>
        <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Chọn địa chỉ trên bản đồ</h3>
        <p className="muted" style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>Nhấp vào bản đồ để ghim vị trí nhận hàng của bạn.</p>
        
        <div 
          ref={mapContainerRef} 
          style={{ height: "400px", width: "100%", borderRadius: "8px", marginBottom: "1rem", backgroundColor: "#e5e5e5" }}
        />

        {address ? (
          <div style={{ padding: "1rem", background: "var(--bg-lighter)", borderRadius: "8px", marginBottom: "1rem" }}>
            <strong>Địa chỉ đã chọn: </strong> {address}
          </div>
        ) : (
          <div style={{ padding: "1rem", color: "var(--muted)", marginBottom: "1rem", fontStyle: "italic" }}>
            Vui lòng chọn một điểm trên bản đồ...
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
          <button className="btn btn-ghost" onClick={onClose}>Hủy</button>
          <button 
            className="btn btn-primary" 
            disabled={!position || !address} 
            onClick={() => onLocationSelected(address)}
          >
            Xác nhận địa chỉ này
          </button>
        </div>
      </div>
    </div>
  );
}

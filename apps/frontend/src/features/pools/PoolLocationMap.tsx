import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { LatLngExpression } from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Position = {
  lat: number;
  lng: number;
};

interface DraggableMarkerProps {
  readonly value: Position | null;
  readonly onChange: (position: Position) => void;
}

interface PoolLocationMapProps {
  readonly latitude?: string | number | null;
  readonly longitude?: string | number | null;
  readonly onChange: (position: Position) => void;
}

function DraggableMarker({ value, onChange }: DraggableMarkerProps) {
  const map = useMap();

  useEffect(() => {
    if (value) {
      map.setView([value.lat, value.lng], 16);
    }
  }, [value, map]);

  useMapEvents({
    click(e) {
      const newPosition = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };

      onChange(newPosition);
      map.setView([newPosition.lat, newPosition.lng], 16);
    },
  });

  return value ? (
    <Marker
      draggable
      position={[value.lat, value.lng]}
      icon={markerIcon}
      eventHandlers={{
        dragend(event) {
          const marker = event.target;
          const latlng = marker.getLatLng();

          const newPosition = {
            lat: latlng.lat,
            lng: latlng.lng,
          };

          onChange(newPosition);
          map.setView([newPosition.lat, newPosition.lng], 16);
        },
      }}
    />
  ) : null;
}

export function PoolLocationMap({
  latitude,
  longitude,
  onChange,
}: PoolLocationMapProps) {
  const defaultCenter: LatLngExpression =
    latitude && longitude
      ? [Number(latitude), Number(longitude)]
      : [37.5629, -1.2618];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={16}
      style={{
        height: "300px",
        width: "100%",
        borderRadius: "12px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <DraggableMarker
        value={
          latitude && longitude
            ? {
                lat: Number(latitude),
                lng: Number(longitude),
              }
            : null
        }
        onChange={onChange}
      />
    </MapContainer>
  );
}

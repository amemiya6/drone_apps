import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leafletのアイコン設定
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// ドローンアイコン
const droneIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14 8H20L15 12L20 16H14L12 22L10 16H4L9 12L4 8H10L12 2Z" fill="#667eea"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const DroneMap = ({ drones, selectedDrone, onDroneSelect }) => {
  const [mapCenter, setMapCenter] = useState([35.6762, 139.6503]); // 東京の座標
  const [mapZoom, setMapZoom] = useState(13);

  // ドローンが選択された場合、地図の中心を移動
  useEffect(() => {
    if (selectedDrone) {
      setMapCenter([selectedDrone.position.lat, selectedDrone.position.lng]);
      setMapZoom(15);
    }
  }, [selectedDrone]);

  // 全ドローンの中心位置を計算
  useEffect(() => {
    if (drones.length > 0 && !selectedDrone) {
      const avgLat = drones.reduce((sum, drone) => sum + drone.position.lat, 0) / drones.length;
      const avgLng = drones.reduce((sum, drone) => sum + drone.position.lng, 0) / drones.length;
      setMapCenter([avgLat, avgLng]);
    }
  }, [drones, selectedDrone]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => {
          // 地図の更新時に中心とズームを更新
          map.on('moveend', () => {
            setMapCenter(map.getCenter());
            setMapZoom(map.getZoom());
          });
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {drones.map((drone) => {
          const trajectory = drone.trajectory.map(point => [point.lat, point.lng]);
          
          return (
            <React.Fragment key={drone.id}>
              {/* ドローンマーカー */}
              <Marker
                position={[drone.position.lat, drone.position.lng]}
                icon={droneIcon}
                eventHandlers={{
                  click: () => onDroneSelect(drone),
                }}
              >
                <Popup>
                  <div style={{ minWidth: '200px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
                      🚁 {drone.id}
                    </h4>
                    <div style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                      <div><strong>位置:</strong> {drone.position.lat.toFixed(6)}, {drone.position.lng.toFixed(6)}</div>
                      <div><strong>高度:</strong> {drone.altitude.toFixed(1)}m</div>
                      <div><strong>速度:</strong> {drone.speed.toFixed(1)} km/h</div>
                      <div><strong>方向:</strong> {drone.heading.toFixed(0)}°</div>
                      <div><strong>バッテリー:</strong> {drone.battery.toFixed(1)}%</div>
                      <div><strong>状態:</strong> 
                        <span style={{ 
                          color: drone.status === 'active' ? '#28a745' : '#dc3545',
                          fontWeight: 'bold'
                        }}>
                          {drone.status === 'active' ? 'アクティブ' : '非アクティブ'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
              
              {/* 軌跡ライン */}
              {trajectory.length > 1 && (
                <Polyline
                  positions={trajectory}
                  color={drone.status === 'active' ? '#667eea' : '#ccc'}
                  weight={2}
                  opacity={0.7}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default DroneMap;

import React, { useState } from 'react';
import DroneMap from './components/DroneMap';
import ControlPanel from './components/ControlPanel';
import { useDroneTracking } from './hooks/useDroneTracking';
import './App.css';

function App() {
  const [selectedDrone, setSelectedDrone] = useState(null);
  const {
    drones,
    isSimulating,
    isConnected,
    error,
    startSimulation,
    stopSimulation,
    getStats
  } = useDroneTracking();

  const stats = getStats();

  const handleDroneSelect = (drone) => {
    setSelectedDrone(drone);
  };

  const handleStartSimulation = () => {
    startSimulation();
  };

  const handleStopSimulation = () => {
    stopSimulation();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🚁 リアルタイムドローン追跡ナビ</h1>
        <p>WebSocket通信によるリアルタイムドローン位置追跡システム</p>
      </header>
      
      <main className="main-content">
        <div className="map-container">
          <DroneMap 
            drones={drones}
            selectedDrone={selectedDrone}
            onDroneSelect={handleDroneSelect}
          />
        </div>
        
        <ControlPanel
          isSimulating={isSimulating}
          isConnected={isConnected}
          drones={drones}
          selectedDrone={selectedDrone}
          stats={stats}
          onStartSimulation={handleStartSimulation}
          onStopSimulation={handleStopSimulation}
          onDroneSelect={handleDroneSelect}
        />
      </main>
      
      {error && (
        <div className="error">
          <strong>エラー:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default App;

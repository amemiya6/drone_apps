import { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('WebSocket接続が確立されました');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('WebSocket接続が切断されました');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return { socket, isConnected };
};

export const useDroneTracking = () => {
  const [drones, setDrones] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState(null);
  const { socket, isConnected } = useSocket();

  // ドローン更新を受信
  useEffect(() => {
    if (!socket) return;

    const handleDroneUpdate = (drone) => {
      setDrones(prevDrones => {
        const existingIndex = prevDrones.findIndex(d => d.id === drone.id);
        if (existingIndex >= 0) {
          const updatedDrones = [...prevDrones];
          updatedDrones[existingIndex] = drone;
          return updatedDrones;
        } else {
          return [...prevDrones, drone];
        }
      });
    };

    const handleAllDrones = (allDrones) => {
      setDrones(allDrones);
    };

    const handleSimulationStarted = () => {
      setIsSimulating(true);
      setError(null);
    };

    const handleSimulationStopped = () => {
      setIsSimulating(false);
    };

    socket.on('droneUpdate', handleDroneUpdate);
    socket.on('allDrones', handleAllDrones);
    socket.on('simulationStarted', handleSimulationStarted);
    socket.on('simulationStopped', handleSimulationStopped);

    return () => {
      socket.off('droneUpdate', handleDroneUpdate);
      socket.off('allDrones', handleAllDrones);
      socket.off('simulationStarted', handleSimulationStarted);
      socket.off('simulationStopped', handleSimulationStopped);
    };
  }, [socket]);

  // シミュレーション制御
  const startSimulation = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('startSimulation');
    }
  }, [socket, isConnected]);

  const stopSimulation = useCallback(() => {
    if (socket && isConnected) {
      socket.emit('stopSimulation');
    }
  }, [socket, isConnected]);

  // 統計情報の計算
  const getStats = useCallback(() => {
    if (drones.length === 0) {
      return {
        totalDrones: 0,
        activeDrones: 0,
        averageSpeed: 0,
        averageAltitude: 0,
        totalDistance: 0
      };
    }

    const activeDrones = drones.filter(drone => drone.status === 'active');
    const averageSpeed = activeDrones.reduce((sum, drone) => sum + drone.speed, 0) / activeDrones.length;
    const averageAltitude = activeDrones.reduce((sum, drone) => sum + drone.altitude, 0) / activeDrones.length;
    
    // 総移動距離の計算（簡略化）
    const totalDistance = activeDrones.reduce((sum, drone) => {
      if (drone.trajectory.length > 1) {
        return sum + drone.trajectory.length * 0.1; // 概算
      }
      return sum;
    }, 0);

    return {
      totalDrones: drones.length,
      activeDrones: activeDrones.length,
      averageSpeed: Math.round(averageSpeed * 10) / 10,
      averageAltitude: Math.round(averageAltitude),
      totalDistance: Math.round(totalDistance * 10) / 10
    };
  }, [drones]);

  return {
    drones,
    isSimulating,
    isConnected,
    error,
    startSimulation,
    stopSimulation,
    getStats
  };
};

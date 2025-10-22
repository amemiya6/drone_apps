const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// ミドルウェア設定
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// ドローン位置データの管理
class DroneTracker {
  constructor() {
    this.drones = new Map();
    this.simulationInterval = null;
    this.isSimulating = false;
  }

  // ドローンを追加
  addDrone(droneId, initialPosition) {
    this.drones.set(droneId, {
      id: droneId,
      position: initialPosition,
      altitude: initialPosition.altitude || 0,
      speed: 0,
      heading: 0,
      battery: 100,
      status: 'active',
      trajectory: [initialPosition],
      lastUpdate: Date.now()
    });
  }

  // ドローン位置を更新
  updateDronePosition(droneId, newPosition) {
    const drone = this.drones.get(droneId);
    if (drone) {
      drone.position = newPosition;
      drone.trajectory.push(newPosition);
      
      // 軌跡を最新100点に制限
      if (drone.trajectory.length > 100) {
        drone.trajectory = drone.trajectory.slice(-100);
      }
      
      drone.lastUpdate = Date.now();
      
      // 速度と方向を計算
      if (drone.trajectory.length > 1) {
        const prev = drone.trajectory[drone.trajectory.length - 2];
        const curr = drone.trajectory[drone.trajectory.length - 1];
        
        drone.speed = this.calculateSpeed(prev, curr);
        drone.heading = this.calculateHeading(prev, curr);
      }
      
      return drone;
    }
    return null;
  }

  // 速度計算（km/h）
  calculateSpeed(prev, curr) {
    const distance = this.calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
    const timeDiff = (curr.timestamp - prev.timestamp) / 1000; // 秒
    return timeDiff > 0 ? (distance / timeDiff) * 3.6 : 0; // km/h
  }

  // 方向計算（度）
  calculateHeading(prev, curr) {
    const lat1 = prev.lat * Math.PI / 180;
    const lat2 = curr.lat * Math.PI / 180;
    const deltaLng = (curr.lng - prev.lng) * Math.PI / 180;
    
    const y = Math.sin(deltaLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);
    
    let heading = Math.atan2(y, x) * 180 / Math.PI;
    return (heading + 360) % 360;
  }

  // 距離計算（km）
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 地球の半径（km）
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // シミュレーション開始
  startSimulation() {
    if (this.isSimulating) return;
    
    this.isSimulating = true;
    
    // デモ用ドローンを追加
    this.addDrone('drone-001', {
      lat: 35.6762,
      lng: 139.6503,
      altitude: 50,
      timestamp: Date.now()
    });

    this.simulationInterval = setInterval(() => {
      this.drones.forEach((drone, droneId) => {
        // ランダムな移動をシミュレート
        const moveDistance = 0.001; // 約100m
        const angle = Math.random() * 2 * Math.PI;
        
        const newLat = drone.position.lat + (Math.cos(angle) * moveDistance);
        const newLng = drone.position.lng + (Math.sin(angle) * moveDistance);
        
        const newPosition = {
          lat: newLat,
          lng: newLng,
          altitude: Math.max(10, drone.position.altitude + (Math.random() - 0.5) * 10),
          timestamp: Date.now()
        };
        
        const updatedDrone = this.updateDronePosition(droneId, newPosition);
        
        // バッテリー消費をシミュレート
        updatedDrone.battery = Math.max(0, updatedDrone.battery - 0.1);
        
        // クライアントに位置更新を送信
        io.emit('droneUpdate', updatedDrone);
      });
    }, 1000); // 1秒間隔
  }

  // シミュレーション停止
  stopSimulation() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.isSimulating = false;
  }

  // 全ドローン情報を取得
  getAllDrones() {
    return Array.from(this.drones.values());
  }

  // ドローン情報を取得
  getDrone(droneId) {
    return this.drones.get(droneId);
  }
}

const droneTracker = new DroneTracker();

// Socket.IO接続処理
io.on('connection', (socket) => {
  console.log('クライアントが接続しました:', socket.id);

  // 全ドローン情報を送信
  socket.emit('allDrones', droneTracker.getAllDrones());

  // シミュレーション開始リクエスト
  socket.on('startSimulation', () => {
    droneTracker.startSimulation();
    socket.emit('simulationStarted');
  });

  // シミュレーション停止リクエスト
  socket.on('stopSimulation', () => {
    droneTracker.stopSimulation();
    socket.emit('simulationStopped');
  });

  // ドローン情報取得リクエスト
  socket.on('getDrone', (droneId) => {
    const drone = droneTracker.getDrone(droneId);
    socket.emit('droneData', drone);
  });

  // 接続切断処理
  socket.on('disconnect', () => {
    console.log('クライアントが切断しました:', socket.id);
  });
});

// API エンドポイント
app.get('/api/drones', (req, res) => {
  res.json(droneTracker.getAllDrones());
});

app.get('/api/drones/:id', (req, res) => {
  const drone = droneTracker.getDrone(req.params.id);
  if (drone) {
    res.json(drone);
  } else {
    res.status(404).json({ error: 'ドローンが見つかりません' });
  }
});

// React アプリケーションを配信
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
  console.log(`http://localhost:${PORT} でアクセスできます`);
});

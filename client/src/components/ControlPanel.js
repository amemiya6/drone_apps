import React from 'react';

const ControlPanel = ({ 
  isSimulating, 
  isConnected, 
  drones, 
  selectedDrone, 
  stats, 
  onStartSimulation, 
  onStopSimulation, 
  onDroneSelect 
}) => {
  return (
    <div className="control-panel">
      {/* 接続状態 */}
      <div className="control-section">
        <h3>接続状態</h3>
        <div style={{ 
          padding: '0.5rem', 
          borderRadius: '6px', 
          backgroundColor: isConnected ? '#d4edda' : '#f8d7da',
          color: isConnected ? '#155724' : '#721c24',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          <span className={`status-indicator ${isConnected ? 'status-active' : 'status-inactive'}`}></span>
          {isConnected ? 'サーバーに接続中' : 'サーバーに接続されていません'}
        </div>
      </div>

      {/* シミュレーション制御 */}
      <div className="control-section">
        <h3>シミュレーション制御</h3>
        {!isSimulating ? (
          <button 
            className="button" 
            onClick={onStartSimulation}
            disabled={!isConnected}
          >
            🚁 シミュレーション開始
          </button>
        ) : (
          <button 
            className="button stop" 
            onClick={onStopSimulation}
          >
            ⏹️ シミュレーション停止
          </button>
        )}
      </div>

      {/* 統計情報 */}
      <div className="control-section">
        <h3>統計情報</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{stats.totalDrones}</div>
            <div className="stat-label">総ドローン数</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.activeDrones}</div>
            <div className="stat-label">アクティブ</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.averageSpeed}</div>
            <div className="stat-label">平均速度(km/h)</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.averageAltitude}</div>
            <div className="stat-label">平均高度(m)</div>
          </div>
        </div>
      </div>

      {/* ドローン一覧 */}
      <div className="control-section">
        <h3>ドローン一覧</h3>
        {drones.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            padding: '1rem',
            fontSize: '0.9rem'
          }}>
            ドローンが検出されていません
          </div>
        ) : (
          drones.map((drone) => (
            <div 
              key={drone.id} 
              className={`drone-info ${selectedDrone?.id === drone.id ? 'selected' : ''}`}
              style={{
                cursor: 'pointer',
                border: selectedDrone?.id === drone.id ? '2px solid #667eea' : '1px solid #e0e0e0',
                backgroundColor: selectedDrone?.id === drone.id ? '#f0f4ff' : '#f8f9fa'
              }}
              onClick={() => onDroneSelect(drone)}
            >
              <h4>
                <span className={`status-indicator ${drone.status === 'active' ? 'status-active' : 'status-inactive'}`}></span>
                {drone.id}
              </h4>
              
              <div className="info-row">
                <span className="info-label">位置:</span>
                <span className="info-value">
                  {drone.position.lat.toFixed(4)}, {drone.position.lng.toFixed(4)}
                </span>
              </div>
              
              <div className="info-row">
                <span className="info-label">高度:</span>
                <span className="info-value">{drone.altitude.toFixed(1)}m</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">速度:</span>
                <span className="info-value">{drone.speed.toFixed(1)} km/h</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">方向:</span>
                <span className="info-value">{drone.heading.toFixed(0)}°</span>
              </div>
              
              <div className="info-row">
                <span className="info-label">バッテリー:</span>
                <span className="info-value">{drone.battery.toFixed(1)}%</span>
              </div>
              
              <div className="battery-bar">
                <div 
                  className="battery-fill" 
                  style={{ 
                    width: `${drone.battery}%`,
                    backgroundColor: drone.battery > 50 ? '#66bb6a' : drone.battery > 20 ? '#ffa726' : '#ff6b6b'
                  }}
                ></div>
              </div>
              
              <div className="info-row">
                <span className="info-label">軌跡点数:</span>
                <span className="info-value">{drone.trajectory.length}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 操作説明 */}
      <div className="control-section">
        <h3>操作方法</h3>
        <div style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.4' }}>
          <p>• 地図上のドローンマーカーをクリックして詳細情報を表示</p>
          <p>• 左側のドローン一覧から選択して追跡</p>
          <p>• 軌跡ラインでドローンの移動経路を確認</p>
          <p>• シミュレーションでリアルタイム追跡を体験</p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;

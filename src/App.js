// src/App.js
import React, { useState } from 'react';
import WebGLCanvas from './WebGLCanvas';

function App() {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  const handleRotationChange = (event) => {
    setRotation(event.target.value);
  };

  const handleScaleChange = (event) => {
    setScale(event.target.value);
  };

  return (
    <div>
      <h1>WebGL Shader Viewer</h1>
      <div>
        <label>
          Rotation:
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={handleRotationChange}
          />
        </label>
        <label>
          Scale:
          <input
            type="number"
            value={scale}
            onChange={handleScaleChange}
            step="0.1"
            min="0.1"
          />
        </label>
      </div>
      <WebGLCanvas width={800} height={600} rotation={rotation} scale={scale} />
    </div>
  );
}

export default App;

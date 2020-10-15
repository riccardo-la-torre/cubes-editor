import React from 'react';
import './LeftPanel.css';

const LeftPanel = ({ numberOfCubes, createCube, resetCamera, resetScale }) => (
  <div className="LeftPanel">
    <h2>Cubes: {numberOfCubes}</h2>
    <button onClick={createCube}>CREATE</button>
    <button onClick={resetCamera}>RESET CAMERA</button>
    <button onClick={resetScale}>RESET SCALE</button>
  </div>
);

export default LeftPanel;


import React from 'react';
import './LeftPanel.css';

const LeftPanel = ({ numberOfCubes, createCube, resetCamera, resetScale }) => (
  <div className="LeftPanel">
    <h3>Cubes: {numberOfCubes}</h3>
    <button onClick={createCube}>CREATE</button>
    <button onClick={resetCamera}>RESET CAMERA</button>
    <button onClick={resetScale}>RESET SCALE</button>
  </div>
);

export default LeftPanel;


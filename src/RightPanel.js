import React from 'react';
import './RightPanel.css';

const LeftPanel = ({ activeId, color, scale, changeColor, scaleCube, confirmDelete }) => {
  const handleColorChange = ({ target: { value } = {} }) => {
    if (value) {
      changeColor(activeId, value);
    }
  }

  const handleScaleChange = ({ target: { value } = {} }) => {
    if (value) {
      scaleCube(activeId, Number(value));
    }
  }

  const handleDelete = () => {
    if (!window.confirm(`Delete Cube ${activeId}?`)) return;
    confirmDelete(activeId);
  }
  return (
    <div className="RightPanel">
      <h2>ACTIVE: {activeId || '-'}</h2>
      { activeId && (
        <>
        <div>
          <label htmlFor="colorPicker">COLOR</label><br />
          <input id="colorPicker" type="color" value={color} onChange={handleColorChange} />
        </div>
        <div>
          <label htmlFor="scaleSlider">SCALE</label><br />
          <input id="scaleSlider" type="range" min="0.1" max="5" step="0.2" value={scale} onChange={handleScaleChange} />
        </div>
        <button onClick={handleDelete}>DELETE</button>
        </>
      )}
    </div>
  );
}

export default LeftPanel;


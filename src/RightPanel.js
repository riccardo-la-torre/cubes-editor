import React from 'react';
import './RightPanel.css';

const LeftPanel = ({ activeId, color, scale, changeColor, scaleCube, requestDelete }) => {
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
  return (
    <div className="RightPanel">
      <h3>ACTIVE: {activeId || '-'}</h3>
      { activeId && (
        <>
        <div>
          <label htmlFor="colorPicker">COLOR</label>
          <input id="colorPicker" type="color" value={color} onChange={handleColorChange} />
        </div>
        <div>
          <label htmlFor="scaleSlider">SCALE</label>
          <input id="scaleSlider" type="range" min="0.1" max="5" value={scale} onChange={handleScaleChange} />
        </div>
        <button onClick={requestDelete}>DELETE</button>
        </>
      )}
    </div>
  );
}

export default LeftPanel;


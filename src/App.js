import React, { useReducer } from 'react';
import _ from 'lodash';
import './App.css';
import reducer from './AppReducer';
import Canvas from './Canvas';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

let lastId = 0;

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function App() {

  const [state, dispatch] = useReducer(reducer, {
    active: null,
    hover: null,
    cubes: {},
    camera: { initial: true },
    deleteModal: false
  });

  const setCamera = (initial) => dispatch({ type: 'setCamera', payload: { initial }});
  const resetCamera = () => dispatch({ type: 'setCamera', payload: { initial: false }});
  const createCube = () => {
    const id = `${++lastId}`;
    const x = (Math.random() - 0.5) * 500;
    const y = (Math.random() - 0.5) * 500;
    const z = Math.random() * 500;
    const color = getRandomColor();
    dispatch({ type: 'createCube', payload: { id, x, y, z, color }});
  };
  const scaleCube = (id, scale) => dispatch({ type: 'scaleCube', payload: { id, scale }});
  const resetScale = () => dispatch({ type: 'resetScale' });
  const changeColor = (id, color) => dispatch({ type: 'changeColor', payload: { id, color }});
  const requestDelete = () => dispatch({ type: 'requestDelete' });
  const cancelDelete = () => dispatch({ type: 'cancelDelete' });
  const confirmDelete = (id) => dispatch({ type: 'confirmDelete', payload: { id }});
  const setHover = (id) => dispatch({ type: 'setHover', payload: { id }});
  const setActive = (id) => dispatch({ type: 'setActive', payload: { id }});

  const { cubes, active } = state;
  const numberOfCubes = _.size(cubes);
  const activeCube = cubes[active];

  return (
    <>
      <Canvas {...state} setActive={setActive} setHover={setHover} setCamera={setCamera} />
      <LeftPanel numberOfCubes={numberOfCubes} createCube={createCube} resetCamera={resetCamera} resetScale={resetScale} />
      <RightPanel activeId={active} color={activeCube && activeCube.color} scale={activeCube && activeCube.scale} changeColor={changeColor} scaleCube={scaleCube} requestDelete={requestDelete} />
    </>
  );
}

export default App;

import React, { useEffect, useCallback, memo, useLayoutEffect, useRef } from 'react';
import './App.css';
import { Scene, PerspectiveCamera, WebGLRenderer, OrbitControls, Raycaster, Vector2, Vector3, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import _ from 'lodash';

let scene;
let camera;
let renderer;
let controls;
const cubeMeshes = {};
const raycaster = new Raycaster();
const mouse = new Vector2(0, 0);
const currentHoverId = '';

let geometry;
let material;

function hexToIntColor(rgb) {
  return parseInt(rgb.substring(1), 16);
}

 
function Canvas({ active, hover, cubes, camera: { initial }, setActive, setHover, setCamera }) {

  const updateHover = useCallback(() => {
    raycaster.setFromCamera( mouse, camera );
    const intersects = raycaster.intersectObjects( scene.children );
    if (intersects.length) {
      if (currentHoverId !== intersects[0].object.name) {
        currentHoverId = intersects[0].object.name;
        setHover(currentHoverId);
      }
    } else {
      if (currentHoverId) {
        currentHoverId = '';
        setHover(null);
      }
    }
  }, [])

  const animate = useCallback(() => {
    requestAnimationFrame(animate);
    updateHover();
    renderer.render(scene, camera);
  },[]);

  const updateCamera = useCallback(() => {
    if (initial) setCamera(false);
  },[]);
  const setRef= useCallback(node => {
    scene = new Scene();
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new WebGLRenderer({ canvas: node });
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;
    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', updateCamera);
    geometry = new BoxGeometry();
    material = new MeshBasicMaterial();
    animate();
  }, []);

  useLayoutEffect(() => {
    function updateSize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
    }
    function onMouseMove( event ) {
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }
    function onClick() {
      if (currentHoverId) setActive(currentHoverId);
    } 
    window.addEventListener('resize', updateSize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
    };
  }, []);

  const prevState = useRef({
    active: null,
    hover: null,
    cubes: {},
    initial: true
  });

  useEffect(() => {
    const { active: prevActive, hover: prevHover, cubes: prevCubes, initial: prevInitial } = prevState.current;
    if (prevCubes !== cubes) {
      const deleted = _.difference(_.keys(prevCubes), _.keys(cubes));
      deleted.forEach(id => {
        const cubeMesh = cubeMeshes[id];
        if (!cubeMesh) return;
        scene.remove(cubeMesh);
      });
      const added = _.omit(cubes, _.keys(prevCubes));
      _.forOwn(added, ({ color, position: { x, y, z }}, id) => {
        const cubeMesh = new Mesh(geometry, material);
        cubeMesh.material.color.set(hexToIntColor(color));
        cubeMesh.position.set(new Vector3(x, y, z));
        cubeMeshes[id] = cubeMesh;
        scene.add(cubeMesh);
      });
      const changed = _.intersection(_.keys(prevCubes), _.keys(cubes));
      changed.forEach(id => {
        if (prevCubes[id] === cubes[id]) return;
        const cubeMesh = cubeMeshes[id];
        if (!cubeMesh) return;
        if (prevCubes[id].color !== cubes[id].color) {
          cubeMesh.material.color.set(hexToIntColor(cubes[id].color));
        }
        if (prevCubes[id].scale !== cubes[id].scale) {
          cubeMesh.scale.set(new Vector3(cubes[id].scale, cubes[id].scale, cubes[id].scale));
        }
      });
    }
    if (prevActive !== active) {
      if (prevActive) {
        const cubeMesh = cubeMeshes[prevActive];
        const cube = cubes[prevActive];
        if (cubeMesh && cube) {
          cubeMesh.material.color.set(hexToIntColor(cube.color));
        }
      }
      if (active) {
        const cubeMesh = cubeMeshes[active];
        const cube = cubes[active];
        if (cubeMesh && cube) {
          cubeMesh.material.color.set(hexToIntColor('#0000FF'));
        }
      }
    }
    if (prevHover !== hover) {
      if (prevHover && prevHover !== active) {
        const cubeMesh = cubeMeshes[prevHover];
        const cube = cubes[prevHover];
        if (cubeMesh && cube) {
          cubeMesh.material.color.set(hexToIntColor(cube.color));
        }
      }
      if (hover) {
        const cubeMesh = cubeMeshes[hover];
        const cube = cubes[hover];
        if (cubeMesh && cube) {
          cubeMesh.material.color.set(hexToIntColor('#00FF00'));
        }
      }
    }
    if (!prevInitial && initial) {
      camera.rotation.set(new Vector3(0, 0, 0));
      camera.zoom = 1;
      controls.update();
    }
    prevState.current.active = active;
    prevState.current.hover = hover;
    prevState.current.cubes = cubes;
    prevState.current.initial = initial;
  }, [active, hover, cubes, initial]);


  return (
    <canvas ref={setRef} width="100%" height="100%"></canvas>
      
  );
}

export default memo(Canvas);

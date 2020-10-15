import React, { useEffect, useCallback, memo, useLayoutEffect } from 'react';
import { Scene, PerspectiveCamera, WebGLRenderer, Raycaster, Vector2, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import _ from 'lodash';

let scene;
let camera;
let renderer;
let controls;
const cubeMeshes = {};
const raycaster = new Raycaster();
const mouse = new Vector2(0, 0);
let currentHoverId = '';

let geometry;

const prevState = {};

 
function Canvas({ active, hover, cubes, camera: { initial }, setActive, setHover, setCamera }) {

  const updateHover = () => {
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
  };

  const animate = () => {
    requestAnimationFrame(animate);
    updateHover();
    renderer.render(scene, camera);
  };

  const updateCamera = () => {
    if (initial) setCamera(false);
  };
  const setRef= useCallback(node => {
    scene = new Scene();
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new WebGLRenderer({ canvas: node });
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 5;
    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', updateCamera);
    geometry = new BoxGeometry();
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


  useEffect(() => {
    const { active: prevActive, hover: prevHover, cubes: prevCubes, initial: prevInitial } = prevState;
    if (prevCubes !== cubes) {
      const deleted = _.difference(_.keys(prevCubes), _.keys(cubes));
      deleted.forEach(id => {
        const cubeMesh = cubeMeshes[id];
        if (!cubeMesh) return;
        scene.remove(cubeMesh);
        cubeMesh.material.dispose();
      });
      const added = _.omit(cubes, _.keys(prevCubes));
      _.forOwn(added, ({ color, position: { x, y, z }}, id) => {
        const material = new MeshBasicMaterial({ color });
        const cubeMesh = new Mesh(geometry, material);
        cubeMesh.position.set(x, y, z);
        cubeMesh.name = id;
        cubeMeshes[id] = cubeMesh;
        scene.add(cubeMesh);
      });
      const changed = _.intersection(_.keys(prevCubes), _.keys(cubes));
      changed.forEach(id => {
        if (prevCubes[id] === cubes[id]) return;
        const cubeMesh = cubeMeshes[id];
        if (!cubeMesh) return;
        if (prevCubes[id].color !== cubes[id].color && id !== active) {
          cubeMesh.material.color.set(cubes[id].color);
        }
        if (prevCubes[id].scale !== cubes[id].scale) {
          cubeMesh.scale.set(cubes[id].scale, cubes[id].scale, cubes[id].scale);
        }
      });
    }
    if (prevActive !== active) {
      if (prevActive) {
        const cubeMesh = cubeMeshes[prevActive];
        const cube = cubes[prevActive];
        if (cubeMesh && cube) {
          cubeMesh.material.color.set(cube.color);
        }
      }
      if (active) {
        const cubeMesh = cubeMeshes[active];
        const cube = cubes[active];
        if (cubeMesh && cube) {
          cubeMesh.material.color.set('#0000FF');
        }
      }
    }
    if (prevHover !== hover) {
      if (prevHover && prevHover !== active) {
        const cubeMesh = cubeMeshes[prevHover];
        const cube = cubes[prevHover];
        if (cubeMesh && cube) {
          cubeMesh.material.color.set(cube.color);
        }
      }
      if (hover && hover !== active) {
        const cubeMesh = cubeMeshes[hover];
        const cube = cubes[hover];
        if (cubeMesh && cube) {
          cubeMesh.material.color.set('#00FF00');
        }
      }
    }
    if (!prevInitial && initial) {
      controls.reset();
    }
    prevState.active = active;
    prevState.hover = hover;
    prevState.cubes = cubes;
    prevState.initial = initial;
  }, [active, hover, cubes, initial]);


  return (
    <canvas ref={setRef} width="100%" height="100%"></canvas>
      
  );
}

export default memo(Canvas);

import _ from 'lodash';

const reducer = (state, { type, payload }) => {
  switch (type) {
    case 'setCamera':
      return {
        ...state,
        camera: { initial: payload.initial }
      };
    case 'createCube':
      return {
        ...state,
        cubes: {
          ...state.cubes,
          [payload.id]: {
            position: { x: payload.x, y: payload.y, z: payload.z },
            color: payload.color,
            scale: 1
          }
        }
      };
    case 'scaleCube':
      return {
        ...state,
        cubes: {
          ...state.cubes,
          [payload.id]: {
            ...state.cubes[payload.id],
            scale: payload.scale
          }
        }
      };
    case 'resetScale': 
      return {
        ...state,
        cubes: _.mapValues(state.cubes, cube => ({ ...cube, scale: 1 }))
      };
    case 'changeColor':
      return {
        ...state,
        cubes: {
          ...state.cubes,
          [payload.id]: {
            ...state.cubes[payload.id],
            color: payload.color
          }
        }
      };
    case 'requestDelete':
      return {
        ...state,
        deleteModal: true
      };
    case 'cancelDelete':
      return {
        ...state,
        deleteModal: false
      };
    case 'confirmDelete':
      return {
        ...state,
        active: state.active === payload.id ? null : state.active,
        hovered: state.hovered === payload.id ? null : state.hovered,
        cubes: _.omit(state.cubes, [ payload.id ]),
        deleteModal: false
      };
    case 'setHover':
      return {
        ...state,
        hover: payload.id
      };
    case 'setActive':
      return {
        ...state,
        active: payload.id
      };
    default:
      return state;
  }
};

export default reducer;
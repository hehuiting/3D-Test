import store from "@/store";

/**
 * @description: 记录此时相机位置和视角
 * @param {*} manager
 * @return {*}
 */
export const recordCamera = (manager, bool = true) => {
  let params = {};
  const camera = manager.viewer.camera;
  const { heading, pitch, roll, position, upWC, direction } = camera;
  params = {
    x: position.x,
    y: position.y,
    z: position.z,
    heading: heading,
    pitch: pitch,
    roll: roll,
    upWCX: upWC.x,
    upWCY: upWC.y,
    upWCZ: upWC.z,
    directionX: direction.x,
    directionY: direction.y,
    directionZ: direction.z,
  };
  if (bool) {
    store.dispatch("map/setCurCamara", params);
  }

  return params;
};

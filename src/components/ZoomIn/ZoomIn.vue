<!--
 * @Author: liuzhy
 * @Date: 2020-07-13 09:31:16
 * @LastEditors: weicong
 * @LastEditTime: 2020-12-29 09:48:05
 * @Description: 地图放大
-->
<template>
  <div></div>
</template>
<script>
import { getManager } from "@/utils/map";
let manager = null;
const MAX_DISTANCE = 50;
export default {
  name: "ZoomIn",
  data() {
    return {};
  },
  mounted() {
    manager = getManager();
    this.zoomIn();
  },
  methods: {
    zoomIn() {
      const pitch = manager.viewer.camera.pitch;
      const height = this.getHeight();
      const len = Math.abs(height * Math.sin(pitch));
      if (len >= MAX_DISTANCE) {
        manager.viewer.camera.zoomIn(50);
      }
    },
    getHeight() {
      const scene = manager.viewer.scene;
      const ellipsoid = scene.globe.ellipsoid;
      const height = ellipsoid.cartesianToCartographic(
        manager.viewer.camera.position
      ).height;
      return height;
    },
  },
};
</script>

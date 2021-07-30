<!--
 * @Author: heht
 * @Date: 2021-07-04 19:30:03
 * @LastEditors: heht
 * @LastEditTime: 2021-07-07 10:09:57
 * @Description: 
-->
<template>
  <div class="secne-viewer">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import { getCesiumScript } from "./utils/registerApi";
export default {
  name: "SupermapMap",
  data() {
    return {
      viewer: null,
      Cesium: null,
    };
  },
  created() {
    this.reset();
  },
  methods: {
    reset() {
      const { initViewer } = this;
      getCesiumScript().then(initViewer);
    },

    initViewer(Cesium) {
      this.Cesium = Cesium;
      const viewer = new Cesium.Viewer("cesiumContainer");
      this.viewer = viewer;
      this.$emit("ready", {
        Cesium,
        viewer,
      });
    },
  },
};
</script>
<style lang="scss">
.secne-viewer {
  height: 100%;
  position: relative;
  #cesiumContainer {
    height: 100%;
  }
  .tool-bar {
    position: absolute;
    top: 0;
    left: 10px;
  }
}
</style>

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
export default {
  name: "SecneViewer",
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
      const { getCesiumScript, initViewer } = this;
      getCesiumScript().then(initViewer);
    },
    getCesiumScript() {
      if (!global.Cesium) {
        let cesiumPath = "/static/Cesium";
        if (cesiumPath.charAt(cesiumPath.length - 1) !== "/") {
          cesiumPath = cesiumPath + "/";
        }
        global.Cesium = {};
        global.Cesium._preloader = new Promise((resolve) => {
          global._initCesium = function () {
            resolve(global.Cesium);
            global.Cesium._preloader = null;
            global._initCesium = null;
          };

          const $link = document.createElement("link");
          $link.rel = "stylesheet";
          global.document.head.appendChild($link);
          $link.href = `${cesiumPath}Widgets/widgets.css`;

          const $script = document.createElement("script");
          global.document.head.appendChild($script);
          $script.src = `${cesiumPath}Cesium.js`;
          $script.onload = function () {
            global._initCesium();
          };
        });
        return global.Cesium._preloader;
      } else if (!global.Cesium._preloader) {
        return Promise.resolve(global.Cesium);
      } else {
        return global.Cesium._preloader;
      }
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

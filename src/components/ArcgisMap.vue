<template>
  <div class="secne-viewer">
    <div id="viewerContainer"></div>
  </div>
</template>

<script>
import { loadArcGISAPI } from "./utils/registerApi";
import loadModules from "./utils/loadModules";

export default {
  name: "ArcgisMap",
  created() {
    loadArcGISAPI().then(() => {
      console.log("arcgis api 加载完成");
      this.initMap();
    });
  },
  methods: {
    async initMap() {
      const { Map, SceneView } = await loadModules(
        "esri/Map",
        "esri/views/SceneView"
      );

      const map = new Map({
        basemap: "dark-gray-vector",
        ground: "world-elevation",
      });
      const view = new SceneView({
        container: "viewerContainer", // Reference to the scene div created in step 5
        map: map, // Reference to the map object created before the scene
        camera: {
          position: [-74.0338, 40.6913, 707],
          tilt: 81,
          heading: 50,
        },
      });
      const arcgisManager = {
        map: map,
        view: view,
      };
      this.$emit("ready", arcgisManager);
    },
  },
};
</script>

<style>
.secne-viewer {
  width: 100%;
  height: 100%;
}
#viewerContainer {
  width: 100%;
  height: 100%;
}
</style>

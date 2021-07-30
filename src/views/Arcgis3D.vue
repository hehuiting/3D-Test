<template>
  <div class="arcgis-map">
    <arcgis-map @ready="mapReady"></arcgis-map>
  </div>
</template>

<script>
import loadModules from "../components/utils/loadModules";
export default {
  data() {
    return {
      map: null,
    };
  },
  methods: {
    mapReady(para) {
      this.map = para.map;
      this.addSceneLayer();
    },

    async addSceneLayer() {
      const { SceneLayer } = await loadModules("esri/layers/SceneLayer");
      const sceneLayer = new SceneLayer({
        portalItem: {
          id: "2e0761b9a4274b8db52c4bf34356911e",
        },
        popupEnabled: false,
      });
      this.map.add(sceneLayer);

      const symbol = {
        type: "mesh-3d",
        symbolLayers: [
          {
            type: "fill", // autocasts as new FillSymbol3DLayer()
            // If the value of material is not assigned, the default color will be grey
            material: {
              color: [244, 247, 134],
            },
          },
        ],
      };
      sceneLayer.renderer = {
        type: "simple",
        symbol: symbol,
      };
    },
  },
};
</script>

<style>
.arcgis-map {
  width: 100%;
  height: 100%;
}
</style>

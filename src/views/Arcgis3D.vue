<template>
  <div class="arcgis-map">
    <arcgis-map @ready="mapReady"></arcgis-map>
  </div>
</template>

<script>
import { addLayer } from "@/utils/layerUtils";

export default {
  data() {
    return {
      layerInfos: [
        {
          guid: "HZ_2016",
          platform: "arcgis",
          type: "tiled",
          url: "https://geo.xdata.group:9019/geoserver/rest/services/XZSJ/HZ_2016/MapServer",
          layerID: "0",
          layerAliasName: "影像图层",
          visible: true,
        },
      ],
    };
  },
  methods: {
    async mapReady(para) {
      this.viewManager = para;
      await addLayer(para.view, this.layerInfos[0], { isLocate: true });
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

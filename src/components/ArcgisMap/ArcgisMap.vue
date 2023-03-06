<template>
  <div class="secne-viewer">
    <div id="viewerContainer"></div>
  </div>
</template>


<script>
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import { createLayer } from "@/utils/layerUtils";

export default {
  name: "ArcgisMap",
  data() {
    return {
      tileInfo: {
        dpi: 96,
        rows: 256,
        cols: 256,
        origin: {
          x: -180,
          y: 90,
        },
        spatialReference: {
          wkid: 4490,
        },
        lods: [
          {
            level: 0,
            levelValue: 1,
            resolution: 0.703125,
            scale: 295828763.7958547,
          },
          {
            level: 1,
            levelValue: 2,
            resolution: 0.3515625,
            scale: 147914381.89792734,
          },
          {
            level: 2,
            levelValue: 3,
            resolution: 0.17578125,
            scale: 73957190.94896367,
          },
          {
            level: 3,
            levelValue: 4,
            resolution: 0.087890625,
            scale: 36978595.474481836,
          },
          {
            level: 4,
            levelValue: 5,
            resolution: 0.0439453125,
            scale: 18489297.737240918,
          },
          {
            level: 5,
            levelValue: 6,
            resolution: 0.02197265625,
            scale: 9244648.868620459,
          },
          {
            level: 6,
            levelValue: 7,
            resolution: 0.010986328125,
            scale: 4622324.4343102295,
          },
          {
            level: 7,
            levelValue: 8,
            resolution: 0.0054931640625,
            scale: 2311162.2171551147,
          },
          {
            level: 8,
            levelValue: 9,
            resolution: 0.00274658203125,
            scale: 1155581.1085775574,
          },
          {
            level: 9,
            levelValue: 10,
            resolution: 0.001373291015625,
            scale: 577790.5542887787,
          },
          {
            level: 10,
            levelValue: 11,
            resolution: 0.0006866455078125,
            scale: 288895.27714438934,
          },
          {
            level: 11,
            levelValue: 12,
            resolution: 0.00034332275390625,
            scale: 144447.63857219467,
          },
          {
            level: 12,
            levelValue: 13,
            resolution: 0.000171661376953125,
            scale: 72223.81928609734,
          },
          {
            level: 13,
            levelValue: 14,
            resolution: 0.0000858306884765625,
            scale: 36111.90964304867,
          },
          {
            level: 14,
            levelValue: 15,
            resolution: 0.00004291534423828125,
            scale: 18055.954821524334,
          },
          {
            level: 15,
            levelValue: 16,
            resolution: 0.000021457672119140625,
            scale: 9027.977410762167,
          },
          {
            level: 16,
            levelValue: 17,
            resolution: 0.000010728836059570312,
            scale: 4513.9887053810835,
          },
          {
            level: 17,
            levelValue: 18,
            resolution: 0.000005364418029785156,
            scale: 2256.9943526905417,
          },
          {
            level: 18,
            levelValue: 19,
            resolution: 0.000002682209014892578,
            scale: 1128.4971763452709,
          },
          {
            level: 19,
            levelValue: 20,
            resolution: 0.000001341104507446289,
            scale: 564.2485881726354,
          },
        ],
      },
      resolution: [
        0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125,
        0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125,
        0.001373291015625, 0.0006866455078125, 0.00034332275390625,
        0.000171661376953125, 0.0000858306884765625, 0.00004291534423828125,
        0.000021457672119140625, 0.000010728836059570312,
        0.000005364418029785156, 0.000002682209014892578,
        0.000001341104507446289,
      ],
    };
  },

  mounted() {
    this.initMap();
  },

  methods: {
    async initMap() {
      let baseLayerInfos = [
        {
          guid: "baselayer-tdt",
          platform: "ogc",
          type: "tdt",
          tileInfo: this.tileInfo,
          url: "https://{subDomain}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILECOL={col}&TILEROW={row}&TILEMATRIX={level}&tk=5d4236a2a06043cd0b0880bbf270c958",
        },
        {
          guid: "XZQH_SJ",
          platform: "arcgis",
          type: "tiled",
          url: "https://geo.xdata.group:9019/geoserver/rest/services/XZQH_SJ/MapServer",
          layerID: "1",
          layerAliasName: "省级行政区划",
          visible: true,
        },
        {
          guid: "HZ_2016",
          platform: "arcgis",
          type: "tiled",
          tileInfo: this.tileInfo,
          url: "https://geo.xdata.group:9019/geoserver/rest/services/XZSJ/HZ_2016/MapServer",
          layerID: "0",
          layerAliasName: "影像图层",
          visible: true,
        },
      ];

      const tdtLayer = createLayer(baseLayerInfos[1]);
      const map = new Map({
        layers: [tdtLayer],
      });
      const view = new SceneView({
        container: "viewerContainer", // Reference to the scene div created in step 5
        map: map, // Reference to the map object created before the scene
        camera: {
          position: {
            x: 118, // lon
            y: 30, // lat
            z: 1000000, // elevation in meters
          },
          tilt: 30,
        },
      });
      const manager = Object.assign({ map: map, view: view });
      this.$emit("ready", manager);
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



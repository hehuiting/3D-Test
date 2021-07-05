<!--
 * @Author: heht
 * @Date: 2021-07-04 19:30:03
 * @LastEditors: heht
 * @LastEditTime: 2021-07-05 13:45:18
 * @Description: 
-->
<template>
  <div class="home">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      viewer: null,
      Cesium: null,
    };
  },
  mounted() {
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

      viewer.scene.camera.setView({
        destination: new Cesium.Cartesian3(
          -1206939.1925299785,
          5337998.241228442,
          3286279.2424502545
        ),
        orientation: {
          heading: 1.4059101895600987,
          pitch: -0.20917672793046682,
          roll: 2.708944180085382e-13,
        },
      });
      this.addTerrainLayer();
      // this.addImageLayer();
      // this.addS3MLayer();
    },

    addTerrainLayer() {
      const { Cesium, viewer } = this;
      //创建地形服务提供者的实例，url为SuperMap iServer发布的TIN地形服务
      const url =
        "http://www.supermapol.com/realspace/services/3D-dixingyingxiang/rest/realspace/datas/DatasetDEM";
      const terrainLayer = new Cesium.CesiumTerrainProvider({
        url: url,
        isSct: true, //地形服务源自SuperMap iServer发布时需设置isSct为true
        invisibility: true,
      });
      viewer.terrainProvider = terrainLayer;
    },
    addImageLayer() {
      const { Cesium } = this;
      //添加SuperMap iServer发布的影像服务
      const url =
        "http://www.supermapol.com/realspace/services/3D-dixingyingxiang/rest/realspace/datas/MosaicResult";
      const imageryProvider = new Cesium.SuperMapImageryProvider({
        url: url,
      });
      // 通过影像提供者创建影像图层
      this.viewer.imageryLayers.addImageryProvider(imageryProvider);
    },

    addS3MLayer() {
      const { Cesium, viewer } = this;
      const scene = viewer.scene;
      const promise = scene.open(
        "http://www.supermapol.com/realspace/services/3D-suofeiya_church/rest/realspace"
      );
      Cesium.when(
        promise,
        function () {
          // var layer = scene.layers.find("Config");
          // sceneLayer = layer;
          //设置相机位置，定位至模型
          scene.camera.setView({
            //将经度、纬度、高度的坐标转换为笛卡尔坐标
            destination: new Cesium.Cartesian3(
              -2653915.6463913363,
              3571045.726807149,
              4570293.566342328
            ),
            orientation: {
              heading: 2.1953426301495345,
              pitch: -0.33632707158103625,
              roll: 6.283185307179586,
            },
          });
        },
        function () {}
      );
    },
  },
};
</script>

<!--
 * @Author: heht
 * @Date: 2021-07-04 19:30:03
 * @LastEditors: heht
 * @LastEditTime: 2021-08-26 11:07:52
 * @Description: 
-->
<template>
  <div class="home">
    <supermap-map @ready="ready"></supermap-map>
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

  methods: {
    ready(manager) {
      this.Cesium = manager.Cesium;
      this.viewer = manager.viewer;
      // this.initViewer();
      // this.addTerrainLayer();
      // this.addImageLayer();
      // this.addKMLData();
      this.addS3MLayer();
    },

    initViewer() {
      const { Cesium, viewer } = this;
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
      // const promise = scene.open(
      //   "http://www.supermapol.com/realspace/services/3D-suofeiya_church/rest/realspace"
      // );
      const promise = scene.addS3MTilesLayerByScp(
        "http://www.supermapol.com/realspace/services/3D-suofeiya_church/rest/realspace/datas/Config/config",
        { name: "Config" }
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

    addKMLData() {
      const { Cesium, viewer } = this;
      viewer.dataSources.add(
        Cesium.KmlDataSource.load("/static/登顶四姑娘山三峰.kml", {
          camera: viewer.scene.camera,
          canvas: viewer.scene.canvas,
          clamptoGround: true,
        })
      );
    },

    changeHeight(tileset, height) {
      const { Cesium } = this;
      height = Number(height);
      if (isNaN(height)) {
        return;
      }
      // 3DTiles中心点坐标
      const cartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
      );
      // 原垂直向量
      const surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        cartographic.height
      );
      // 变换后垂直向量
      const offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        height
      );
      // 变换向量
      const translation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
      );
      // 平移向量
      tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
    },
  },
};
</script>
<style lang="scss">
.home {
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

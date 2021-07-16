<template>
  <div class="fly-route">
    <scene-viewer @ready="ready"></scene-viewer>
    <div id="toolbar" class="param-container tool-bar">
      <span type="button" id="play" class="button black" title="开始"></span>
      <span type="button" id="pause" class="button black" title="暂停"></span>
      <span type="button" id="stop" class="button black" title="停止"></span>
      <div style="width: 150px">
        <select id="stopList" class="form-control" style="width: 100%">
          <!--<option disabled selected value>&#45;&#45;选择站点&#45;&#45;</option>-->
        </select>
      </div>
      <div class="checkbox">
        <label>
          <input type="checkbox" id="show-line" checked /> 显示飞行路线
        </label>
      </div>
      <div class="checkbox">
        <label>
          <input type="checkbox" id="show-stop" checked /> 显示飞行站点
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FlyRoute",
  data() {
    return {};
  },
  methods: {
    ready(para) {
      this.Cesium = para.Cesium;
      this.viewer = para.viewer;

      this.addLayer();
    },

    initViewer() {
      const { Cesium, viewer } = this;
      //设置视角
      viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(116.3801, 39.9874, 12.0),
        orientation: {
          heading: 6.260995919619558, // 方位角
          pitch: 0, // 俯仰角
          roll: 0, // 滚动角
        },
      });
    },

    addLayer() {
      const { Cesium, viewer } = this;

      // 添加Bing影像底图
      viewer.imageryLayers.addImageryProvider(
        new Cesium.BingMapsImageryProvider({
          url: "https://dev.virtualearth.net",
          mapStyle: Cesium.BingMapsStyle.AERIAL,
          key: "AhVuGO6sO-v4sclhnlLs2N1vuYkJQvGPYD9v8e3Kx1Aew7L_B1q5RF30dXE9z3W5",
        })
      );

      //添加S3M图层服务
      var promise = viewer.scene.open(
        "https://www.supermapol.com/realspace/services/3D-OlympicGreen20200416/rest/realspace"
      );
      // viewer.scene.addS3MTilesLayerByScp(
      //   "https://www.supermapol.com/realspace/services/3D-OlympicGreen20200416/rest/realspace/datas/Building@OlympicGreen/config",
      //   { name: "Building@OlympicGreen" }
      // );
      promise.then(() => {
        this.initViewer();
        this.addFlyRoutes();
      });

      const terrainProvider = new Cesium.CesiumTerrainProvider({
        url: "http://www.supermapol.com/realspace/services/3D-dixingyingxiang/rest/realspace/datas/DatasetDEM",
        isSct: true,
      });
      viewer.terrainProvider = terrainProvider;
    },

    addFlyRoutes() {
      const { Cesium, viewer } = this;
      //  1.添加fpf飞行文件
      const routes = new Cesium.RouteCollection(viewer.entities);
      const fpfUrl = "/static/flyRoutes.fpf";
      routes.fromFile(fpfUrl);

      // 2.初始化飞行管理
      const flyManager = new Cesium.FlyManager({
        scene: viewer.scene,
        routes: routes,
      });

      // 3.注册站点到达事件
      flyManager.stopArrived.addEventListener((routeStop) => {
        routeStop.waitTime = 0.2; // 每个站点处停留0.2s
      });

      // 4.飞行路线就绪
      flyManager.readyPromise.then(() => {
        const currentRoute = flyManager.currentRoute;
        currentRoute.isLineVisible = true;
        currentRoute.isStopVisible = true;
        // 生成飞行文件中的所有站点列表
        const allStops = flyManager.getAllRouteStops();
        const menu = document.getElementById("stopList");
        for (let i = 0, j = allStops.length; i < j; i++) {
          var option = document.createElement("option");
          option.innerHTML = "站点 " + (i + 1);
          option.value = allStops[i].index;
          menu.appendChild(option);
        }

        // 注册站点切换事件
        menu.addEventListener("change", (evt) => {
          flyManager && flyManager.stop();
          debugger;
          const index = Number(evt.target.value);
          const route = flyManager.currentRoute;
          const stop = route.get(index);
          flyManager.currentStopIndex = index;
          flyManager.viewToStop(stop);
        });

        document.getElementById("play").addEventListener("click", () => {
          flyManager && flyManager.play();
        });
        document.getElementById("pause").addEventListener("click", () => {
          flyManager && flyManager.pause();
        });
        document.getElementById("stop").addEventListener("click", () => {
          flyManager && flyManager.stop();
        });

        document
          .getElementById("show-line")
          .addEventListener("change", (evt) => {
            currentRoute.isLineVisible = evt.target.checked;
          });

        document
          .getElementById("show-stop")
          .addEventListener("change", (evt) => {
            currentRoute.isStopVisible = evt.target.checked;
          });
      });
    },
  },
};
</script>

<style lang="scss">
.fly-route {
  height: 100%;
  position: relative;
  #cesiumContainer {
    height: 100%;
  }
  .tool-bar {
    position: absolute;
    top: 0;
    left: 10px;
    #play {
      content: url(../assets/play.png);
      height: 30px;
      padding: 5px;
    }

    #pause {
      content: url(../assets/pause.png);
      height: 30px;
      padding: 5px;
    }

    #stop {
      content: url(../assets/stop.png);
      height: 30px;
      padding: 5px;
    }

    .bootstrap-select {
      width: 150px;
    }
  }
}
</style>

<template>
  <div class="base-tools">
    <supermap-map @ready="ready"></supermap-map>
    <div class="map-toggle">
      <DropdownMenu slot="list">
        <DropdownItem></DropdownItem>
      </DropdownMenu>
    </div>
    <div class="tools-wrapper">
      <div
        class="tool-item"
        v-for="item in toolList"
        :key="item.name"
        @click="handlerIconClick(item.name)"
      >
        <Icon :type="item.icon" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    return {
      toolList: [
        {
          name: "ZoomIn",
          icon: "md-add-circle",
        },
        {
          name: "ZoomOut",
          icon: "md-remove-circle",
        },
        {
          name: "FullExtent",
          icon: "ios-home",
        },
      ],
      baseMapTypes: [
        {
          name: "全球矢量地图服务",
          type: "VEC_C",
        },
      ],
    };
  },
  methods: {
    ready(manager) {
      this.Cesium = manager.Cesium;
      this.viewer = manager.viewer;
      this.defaultPos = this.viewer.camera.position;
    },
    handlerIconClick(name) {
      switch (name) {
        case "ZoomIn":
          this.zoomIn();
          break;
        case "ZoomOut":
          this.zoomOut();
          break;
        case "FullExtent":
          this.fullExtent();
          break;
      }
    },

    zoomIn() {
      this.viewer.camera.zoomIn(500000);
    },

    zoomOut() {
      this.viewer.camera.zoomOut(500000);
    },

    fullExtent() {
      // 飞行时间，默认以秒为单位
      const duraction = 3;
      this.viewer.camera.flyHome(duraction);
    },

    getHeight() {
      const scene = this.viewer.scene;
      const ellipsoid = scene.globe.ellipsoid;
      const height = ellipsoid.cartesianToCartographic(
        this.viewer.camera.position
      ).height;
      return height;
    },
  },
};
</script>
<style lang="scss" scoped>
.tools-wrapper {
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  .tool-item {
    width: 3rem;
    height: 3rem;
    line-height: 2rem;
    background: #fff;
    margin: 0.5rem;
    padding: 0.5rem;
    border-radius: 2px;
    font-size: 1.6rem;
  }
}
/deep/ .sm-compass-outer-ring {
  display: none;
}
</style>

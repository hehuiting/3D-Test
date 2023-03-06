/*
 * @Author: heht
 * @Date: 2023-03-06 15:33:33
 * @LastEditors: heht
 * @LastEditTime: 2023-03-06 16:34:54
 * @Description:
 */
import WebTileLayer from "@arcgis/core/layers/WebTileLayer";
import TileInfo from "@arcgis/core/layers/support/TileInfo";
import Extent from "@arcgis/core/geometry/Extent";
import TileLayer from "@arcgis/core/layers/TileLayer";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import IntegratedMeshLayer from "@arcgis/core/layers/IntegratedMeshLayer";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import BuildingSceneLayer from "@arcgis/core/layers/BuildingSceneLayer";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer";
import PointCloudLayer from "@arcgis/core/layers/PointCloudLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";

import { locateByExtent } from "./locateUtils";

export const LAYER_TYPE = {
  ARCGIS_DYNAMIC: "arcgis-dynamic", // arcgis动态图层
  ARCGIS_TILED: "arcgis-tiled", // arcgis切片图层
  ARCGIS_VECTORTILE: "arcgis-vectortile", // arcgis矢量切片
  ARCGIS_ELEVATION: "arcgis-elevation", // arcgis高程数据
  ARCGIS_3DOBJECT: "arcgis-3dobject", // arcgis白膜
  ARCGIS_MESH: "arcgis-mesh", // arcgis倾斜摄影
  ARCGIS_BUILDING: "arcgis-building", // arcgis建筑模型
  ARCGIS_POINTCLOUD: "arcgis-pointcloud", // arcgis点云

  GRAPHICS: "graphics", // 矢量图形数据
  GEOSJON: "geojson", // geosjon数据

  OGC_TDT: "ogc-tdt", // 天地图
  OGC_WMTS: "ogc-wmts", // wmts
  OGC_WMS: "ogc-wms", // wms
  OGC_WFS: "ogc-wfs", // wfs
};

/**
 * @description: 加载单个图层
 * @param {viewIns} viewIns 视图实例
 * @param {ILayerOptions} layerInfo 图层信息
 * @param {any} options 加载配置项，包括isLocate:是否定位
 * @return {*}
 */
export function addLayer(viewIns, layerInfo, options) {
  return new Promise((resolve) => {
    let layerIns = null;
    const { url, layerID, guid } = layerInfo;
    // 判断layer是否已经加载到地图上，若加载，改变图层显隐并渲染至最上层；
    const layerGuid = guid || `${url}_shadow_${layerID}`;
    layerInfo.guid = layerGuid;
    layerIns = viewIns.map.findLayerById(layerGuid);
    if (layerIns) {
      layerIns.visible = true;
      viewIns.map.reorder(layerIns, viewIns.map.layers.length);
    } else {
      // 若未加载，则创建并加载
      layerIns = createLayer(layerInfo);
      viewIns.map.add(layerIns);
    }
    viewIns.whenLayerView(layerIns).then((layerView) => {
      if (options?.isLocate) {
        locateByExtent(viewIns, layerView.layer.fullExtent);
      }
      console.log("图层加载完成！");
      resolve(layerView.layer);
    });
  });
}

export function createLayer(layerInfo) {
  const { platform, type } = layerInfo;
  let layerType = platform ? platform + "-" + type : type;
  switch (layerType) {
    case LAYER_TYPE.ARCGIS_DYNAMIC:
      return createMapImageLayer(layerInfo);
    case LAYER_TYPE.ARCGIS_TILED:
      return createTileLayer(layerInfo);
    case LAYER_TYPE.OGC_TDT:
      return createTDTLayer(layerInfo);
    case LAYER_TYPE.ARCGIS_MESH:
      return createIntegratedMeshLayer(layerInfo);
    case LAYER_TYPE.ARCGIS_3DOBJECT:
      return createSceneLayer(layerInfo);
    case LAYER_TYPE.ARCGIS_BUILDING:
    case LAYER_TYPE.arcgis_BUILDING:
      return createBuildingSceneLayer(layerInfo);
    case LAYER_TYPE.ARCGIS_ELEVATION:
      return createElevationLayer(layerInfo);
    case LAYER_TYPE.ARCGIS_POINTCLOUD:
      return createPointCloudLayer(layerInfo);
    case LAYER_TYPE.GRAPHICS:
      return createGraphicsLayer(layerInfo);
    case LAYER_TYPE.GEOSJON:
      return createGeoJSONLayer(layerInfo);
    default:
      console.log("暂不支持此类型图层加载", layerType);
      return null;
  }
}

export function createTDTLayer(layerInfo) {
  try {
    const { guid, url, tileInfo, visible = true, options } = layerInfo;
    let params = Object.assign(
      { spatialReference: { wkid: tileInfo?.spatialReference?.wkid } },
      options
    );
    const layerIns = new WebTileLayer({
      id: guid,
      urlTemplate: url,
      tileInfo: new TileInfo(tileInfo),
      subDomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
      fullExtent: new Extent({
        xmin: -180,
        ymin: -90,
        xmax: 180,
        ymax: 90,
        spatialReference: { wkid: tileInfo?.spatialReference?.wkid },
      }),
      visible,
      ...params,
    });
    return layerIns;
  } catch (err) {
    throw new Error("创建wmts图层方法createWmtsLayer失败!", err);
  }
}

function createMapImageLayer(layerInfo) {
  try {
    const {
      guid,
      url,
      layerID,
      opacity = 1,
      definitionExpression,
      visible = true,
      options,
    } = layerInfo;
    const params =
      layerID === -1
        ? { id: guid, url, opacity, ...options }
        : {
            id: guid,
            url,
            opacity,
            sublayers: [
              {
                id: layerID,
                visible,
                definitionExpression,
              },
            ],
            ...options,
          };
    const layerIns = new MapImageLayer(params);
    return layerIns;
  } catch (err) {
    throw new Error("创建动态图层方法createMapImageLayer失败!", err);
  }
}

function createTileLayer(layerInfo) {
  try {
    const { guid, url, visible = true, options } = layerInfo;
    const layerIns = new TileLayer({
      id: guid,
      url,
      visible,
      ...options,
    });
    return layerIns;
  } catch (err) {
    throw new Error("创建切片图层方法createTileLayer失败!", err);
  }
}

function createIntegratedMeshLayer(layerInfo) {
  try {
    const { guid, url, visible = true, options } = layerInfo;
    const layerIns = new IntegratedMeshLayer({
      id: guid,
      url,
      visible,
      ...options,
    });
    return layerIns;
  } catch (err) {
    throw new Error("创建倾斜摄影图层方法createIntegratedMeshLayer失败!", err);
  }
}

function createSceneLayer(layerInfo) {
  try {
    const { guid, url, visible = true, layerID = 0, options } = layerInfo;
    const layerIns = new SceneLayer({
      id: guid,
      url,
      layerId: layerID,
      visible,
      outFields: ["*"],
      popupEnabled: false,
      ...options,
    });
    return layerIns;
  } catch (err) {
    throw new Error("创建场景图层方法createSceneLayer失败!", err);
  }
}

function createBuildingSceneLayer(layerInfo) {
  try {
    const { guid, url, visible = true, layerID = 0, options } = layerInfo;
    const layerIns = new BuildingSceneLayer({
      id: guid,
      url,
      layerId: layerID,
      visible,
      ...options,
    });
    return layerIns;
  } catch (err) {
    throw new Error(
      "创建建筑模型场景图层方法createBuildingSceneLayer失败!",
      err
    );
  }
}

function createElevationLayer(layerInfo) {
  try {
    const { guid, url, visible = true, options } = layerInfo;
    const layerIns = new ElevationLayer({
      id: guid,
      url,
      visible,
      ...options,
    });
    return layerIns;
  } catch (err) {
    throw new Error("创建高程图层方法createElevationLayer失败!", err);
  }
}

function createPointCloudLayer(layerInfo) {
  try {
    const { guid, url, visible = true, options } = layerInfo;
    const layerIns = new PointCloudLayer({
      id: guid,
      url,
      visible,
      ...options,
    });
    return layerIns;
  } catch (err) {
    throw new Error("创建点云图层方法createPointCloudLayer失败!", err);
  }
}

function createGraphicsLayer(layerInfo) {
  try {
    const { guid, visible = true, options } = layerInfo;
    const layerIns = new GraphicsLayer({
      id: guid,
      visible,
      ...options,
    });
    return layerIns;
  } catch (err) {
    throw new Error("创建矢量图形图层方法createGraphicsLayer失败!", err);
  }
}

function createGeoJSONLayer(layerInfo) {
  try {
    const { guid, url, visible = true, options } = layerInfo;
    const layerIns = new GeoJSONLayer({
      id: guid,
      url,
      visible,
      ...options,
    });
    return layerIns;
  } catch (err) {
    throw new Error("创建GeoJSON图层方法createGeoJSONLayer失败!", err);
  }
}

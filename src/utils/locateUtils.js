/*
 * @Author: heht
 * @Date: 2023-03-06 16:00:17
 * @LastEditors: heht
 * @LastEditTime: 2023-03-06 16:01:02
 * @Description:
 */
import Extent from "@arcgis/core/geometry/Extent";

/**
 * @description: 根据范围定位
 * @param {GeoSceneView} geosceneView
 * @param {object} extent 内含四至范围
 * @param {object} options 包含 isExpand:是否放大范围，duration:视图定位时长
 * @return {*}
 */
export function locateByExtent(geosceneView, extent, options) {
  let tempExtent;
  let spatialReference = geosceneView.spatialReference;
  if (Array.isArray(extent) && extent.length === 4) {
    tempExtent = new Extent({
      xmin: extent[0],
      ymin: extent[1],
      xmax: extent[2],
      ymax: extent[3],
      spatialReference,
    });
  }
  tempExtent = new Extent({
    xmin: extent.xmin,
    ymin: extent.ymin,
    xmax: extent.xmax,
    ymax: extent.ymax,
    spatialReference,
  });
  if (options?.isExpand) {
    tempExtent = tempExtent.expand(2);
  }
  let duration = options?.duration ? options.duration : 200;
  geosceneView.goTo(tempExtent, {
    duration,
  });
}

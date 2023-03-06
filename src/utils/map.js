/*
 * @Author: weicong
 * @Date: 2020-11-06 13:58:10
 * @LastEditTime: 2020-11-18 10:32:37
 * @LastEditors: weicong
 * @Description: 该文件只允许在微件内部使用，微件内部使用的话，manager才有值
 */
let manager = null;
export const getManager = () => manager;
export const setManager = (val) => {
  manager = val;
};

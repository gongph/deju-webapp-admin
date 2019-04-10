/**
 * Banner接口
 */

import request from '@/utils/request'

/**
 * 获取Banner列表
 */
export function getList(query) {
  return request({
    url: '/api/v3/banners',
    method: 'get',
    params: query
  })
}

/**
 * 注册Banner
 */

export function saveOrUpdate(data, method = 'post') {
  return request({
    url: '/api/v3/banners',
    method,
    data
  })
}

/**
 * 修改Banner
 */

export function deleteById(id) {
  return request({
    url: '/api/v3/banners',
    method: 'delete',
    params: id
  })
}

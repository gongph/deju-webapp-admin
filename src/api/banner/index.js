/**
 * Banner接口
 */

import request from '@/utils/request'

/**
 * 获取Banner列表
 */
export function getList(query) {
  return request({
    url: '/api/beanners',
    method: 'get',
    params: query
  })
}

/**
 * 注册Banner
 */

export function add(data) {
  return request({
    url: '/api/beanners',
    method: 'post',
    data
  })
}

/**
 * 修改Banner
 */

export function update(data) {
  return request({
    url: '/api/beanners',
    method: 'put',
    data
  })
}

/**
 * 产品接口
 */

import request from '@/utils/request'

/**
 * 获取产品列表
 */
export function getList(query) {
  return request({
    url: '/api/products',
    method: 'get',
    params: query
  })
}

/**
 * 新增产品
 */

export function addProduct(data) {
  return request({
    url: '/api/products',
    method: 'post',
    data
  })
}

/**
 * 获取审核列表
 */

export function getAudits() {
  return request({
    url: '/api/application-current-infos',
    method: 'get'
  })
}

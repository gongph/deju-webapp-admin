/**
 * 产品接口
 */

import request from '@/utils/request'

/**
 * 获取产品列表
 */
export function getList(query) {
  return request({
    url: '/api/v3/products',
    method: 'get',
    params: query
  })
}

/**
 * 新增或更新产品
 */

export function saveOrUpdate(data, method = 'post') {
  return request({
    url: '/api/v3/products',
    method,
    data
  })
}

/**
 * 删除产品
 */

export function deleteProductById(id) {
  return request({
    url: `/api/v3/products/${id}`,
    method: 'delete'
  })
}

/**
 * 获取审核列表
 */
export function getAudits(query) {
  return request({
    url: '/api/v3/application-infos',
    method: 'get',
    params: query
  })
}

/**
 * 更新审核信息
 * @param data
 */
export function updateAudits(data) {
  return request({
    url: '/api/v3/application-infos',
    method: 'put',
    data
  })
}

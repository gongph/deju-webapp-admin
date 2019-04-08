/**
 * 产品接口
 */

import request from '@/utils/request'

/**
 * 获取代理商列表
 */
export function getList() {
  return request({
    url: '/api/users',
    method: 'get'
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

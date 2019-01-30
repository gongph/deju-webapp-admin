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
export function getAudits() {
  return request({
    url: '/api/application-infos',
    method: 'get'
  })
}

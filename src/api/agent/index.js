/**
 * 代理商接口
 */

import request from '@/utils/request'

/**
 * 获取产品列表
 */
export function getList(query) {
  return request({
    url: '/api/users',
    method: 'get',
    params: query
  })
}

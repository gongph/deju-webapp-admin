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

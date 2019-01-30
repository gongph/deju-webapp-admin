/**
 * 代理商接口
 */

import request from '@/utils/request'

/**
 * 获取代理商列表
 */
export function getList(query) {
  return request({
    url: '/api/users',
    method: 'get',
    params: query
  })
}

/**
 * 注册代理商
 */

export function register(data) {
  return request({
    url: '/api/register',
    method: 'post',
    data
  })
}

/**
 * 修改代理商
 */

export function modify(data) {
  return request({
    url: '/api/users',
    method: 'put',
    data
  })
}

/**
 * 重置密码
 */

export function resetpwd(data) {
  return request({
    url: '/api/resetpwd',
    method: 'put',
    data
  })
}


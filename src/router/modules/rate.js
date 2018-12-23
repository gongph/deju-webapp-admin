/** 利率管理 */

import Layout from '@/views/layout/Layout'

const roles = ['ROLE_ADMIN']

const rateRouter = {
  path: '/rate',
  component: Layout,
  redirect: '/rate/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/rateMg/index'),
      name: 'RateList',
      meta: {
        title: '利率管理',
        icon: 'component',
        roles
      }
    }
  ]
}

export default rateRouter

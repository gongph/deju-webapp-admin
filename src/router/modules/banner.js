/** Banner管理 */

import Layout from '@/views/layout/Layout'

const roles = ['ROLE_ADMIN']

const bannerRouter = {
  path: '/banners',
  component: Layout,
  redirect: '/banners/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/bannerMg/index'),
      name: 'BannerList',
      meta: {
        title: 'Banner管理',
        icon: 'component',
        roles
      }
    },
    {
      path: '/banner/add',
      component: () => import('@/views/bannerMg/add'),
      name: 'ProductAdd',
      meta: {
        title: '添加产品',
        icon: 'component',
        roles
      }
    }
  ]
}

export default bannerRouter

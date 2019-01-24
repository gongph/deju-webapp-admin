/** 产品 */

import Layout from '@/views/layout/Layout'

const roles = ['ROLE_ADMIN']

const productRouter = {
  path: '/products',
  component: Layout,
  redirect: '/products/index',
  name: 'Products',
  meta: {
    title: '产品管理',
    icon: 'component'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/productMg/index'),
      name: 'ProductList',
      meta: {
        title: '产品列表',
        icon: 'list',
        roles
      }
    },
    {
      path: '/product/add',
      component: () => import('@/views/productMg/add'),
      name: 'ProductAdd',
      meta: {
        title: '添加产品',
        icon: 'form',
        roles
      }
    },
    {
      path: '/product/edit',
      hidden: true,
      component: () => import('@/views/productMg/edit'),
      name: 'ProductEdit',
      meta: {
        title: '编辑产品',
        icon: 'edit',
        roles
      }
    }
  ]
}

export default productRouter

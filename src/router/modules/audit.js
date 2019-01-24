/** 审核管理 */

import Layout from '@/views/layout/Layout'

const roles = ['ROLE_ADMIN']

const auditRouter = {
  path: '/audits',
  component: Layout,
  redirect: '/audits/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/auditMg/index'),
      name: 'AuditList',
      meta: {
        title: '审核管理',
        icon: 'nested',
        roles
      }
    }
  ]
}

export default auditRouter

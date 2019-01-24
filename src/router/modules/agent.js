/** 代理商 */

import Layout from '@/views/layout/Layout'

const roles = ['ROLE_ADMIN']

const agentRouter = {
  path: '/agents',
  component: Layout,
  redirect: '/agents/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/agentMg/index'),
      name: 'AgentList',
      meta: {
        title: '代理商管理',
        icon: 'peoples',
        roles
      }
    }
  ]
}

export default agentRouter

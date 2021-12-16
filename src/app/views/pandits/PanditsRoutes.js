import React from 'react'

const panditsRoutes = [
    {
        path: '/pandits/list',
        component: React.lazy(() => import('./List')),
    },
    {
        path: '/pandits/call_history',
        component: React.lazy(() => import('./History')),
    },
]

export default panditsRoutes

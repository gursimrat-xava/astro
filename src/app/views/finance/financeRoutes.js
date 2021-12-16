import React from 'react'

const dashboardRoutes = [
    {
        path: '/finance',
        component: React.lazy(() => import('./finance')),
    }
]

export default dashboardRoutes

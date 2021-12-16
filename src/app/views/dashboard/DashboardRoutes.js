import React from 'react'

const dashboardRoutes = [
    {
        path: '/home',
        component: React.lazy(() => import('./Analytics')),
    }
]

export default dashboardRoutes

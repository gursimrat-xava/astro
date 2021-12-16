import React from 'react'

const reportsRoutes = [
    {
        path: '/reports/calls',
        component: React.lazy(() => import('./Calls')),
    },
]

export default reportsRoutes

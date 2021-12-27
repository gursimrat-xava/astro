import React from 'react'

const vendorsRoutes = [
    {
        path: '/vendors/list',
        component: React.lazy(() => import('./List')),
    },
]

export default vendorsRoutes

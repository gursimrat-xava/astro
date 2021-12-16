import React from 'react'

const usersRoutes = [
    {
        path: '/users/list',
        component: React.lazy(() => import('./List')),
    },
]

export default usersRoutes

import React from 'react'

const bannerRoutes = [
    {
        path: '/banners',
        component: React.lazy(() => import('./Banners')),
    },

]

export default bannerRoutes

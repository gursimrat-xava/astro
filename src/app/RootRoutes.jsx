import React from 'react'
import { Redirect } from 'react-router-dom'

import dashboardRoutes from './views/dashboard/DashboardRoutes'
import usersRoutes from './views/users/UsersRoutes'
import panditsRoutes from './views/pandits/PanditsRoutes'
import reportsRoutes from './views/reports/ReportsRoutes'
import financeRoutes from './views/finance/financeRoutes'
import bannerRoutes from './views/banners/BannerRoutes'


const redirectRoute = [
    {
        path: '/',
        exact: true,
        component: () => <Redirect to={process.env.PUBLIC_URL + "/home/default"} />,
    },
]

const errorRoute = [
    {
        component: () => <Redirect to={process.env.PUBLIC_URL + "/session/404"} />,
    },
]

let routes = [
    ...dashboardRoutes,
    ...redirectRoute,
    ...usersRoutes,
    ...panditsRoutes,
    ...bannerRoutes,
    ...reportsRoutes,
    ...financeRoutes,
    {
        path: '/coupons',
        component: React.lazy(() => import('./views/coupons/Coupons')),
    },
    ...errorRoute
]
routes = routes.map(route => { return { ...route, path: process.env.PUBLIC_URL + route.path}})

export default routes
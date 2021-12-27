import React from 'react'
import { Redirect } from 'react-router-dom'

import dashboardRoutes from './views/dashboard/DashboardRoutes'
import usersRoutes from './views/users/UsersRoutes'
import panditsRoutes from './views/pandits/PanditsRoutes'
import vendorsRoutes from './views/vendors/VendorsRoutes'
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
    ...vendorsRoutes,
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

let vendorRootRoutes = [
    ...dashboardRoutes,
    ...redirectRoute,
    ...panditsRoutes,
    ...errorRoute
]
vendorRootRoutes = vendorRootRoutes.map(route => { return { ...route, path: process.env.PUBLIC_URL + route.path}})

const mainRoutes = {routes, vendorRootRoutes}

export default mainRoutes

export const navigations = [
    {
        name: 'Home',
        path: '/home',
        icon: 'home',
    },
    {
        label: 'Pages',
        type: 'label',
    },
    {
        name: 'Users',
        icon: 'people',
        path: '/users/list',
        // children: [
        //     {
        //         name: 'User List',
        //         iconText: 'UL',
        //         path: '/users/list',
        //     },
        // ],
    },
    {
        name: 'Pandits',
        icon: 'format_list_bulleted',
        path: '/pandits/list',
        // children: [
        //     {
        //         name: 'Pandit List',
        //         iconText: 'PL',
        //         path: '/pandits/list',
        //     },
        // ],
    },
    {
        name: 'Banners',
        icon: 'assignment',
        path: '/banners',
    },
    {
        name: 'Finance Manager',
        icon: 'attach_money',
        path: '/finance',
    },
    {
        name: 'Coupon Manager',
        icon: 'card_giftcard',
        path: '/coupons',
    },
    {
        name: 'Reports',
        icon: 'assignment',
        children: [
            {
                name: 'Call List',
                iconText: 'CL',
                path: '/reports/calls',
            },
        ],
    },
]

import {createRouter, createWebHistory} from 'vue-router';

import Home from './pages/Home.vue';
import Pic from './pages/Pic.vue';
import Coordinate from './pages/Coordinate.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/pic',
        name: 'Pic',
        component: Pic
    },    
    {
        path: '/coordinate',
        name: 'Coordinate',
        component: Coordinate
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
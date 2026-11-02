import {createRouter, createWebHistory} from 'vue-router';

import Home from './pages/Home.vue';
import Week6 from './pages/Week6.vue';
import Pic from './pages/Pic.vue';
import Coordinate from './pages/Coordinate.vue';


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/week6',
        name: 'Week6',
        component: Week6
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
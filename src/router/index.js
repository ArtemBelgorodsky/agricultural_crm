import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import AdminDashboard from '@/views/admin/AdminDashboard.vue';
import FleetList from '@/views/admin/FleetList.vue';
import DriversList from '@/views/admin/DriversList.vue';
import AssignmentsView from '@/views/admin/AssignmentsView.vue';
import DriverDashboard from '@/views/driver/DriverDashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        layout: 'blank',
        public: true,
        title: 'Вход в систему',
      },
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: {
        role: 'admin',
        title: 'Панель администратора',
      },
    },
    {
      path: '/admin/fleet',
      name: 'admin-fleet',
      component: FleetList,
      meta: {
        role: 'admin',
        title: 'Парк техники',
      },
    },
    {
      path: '/admin/drivers',
      name: 'admin-drivers',
      component: DriversList,
      meta: {
        role: 'admin',
        title: 'Водители',
      },
    },
    {
      path: '/admin/assignments',
      name: 'admin-assignments',
      component: AssignmentsView,
      meta: {
        role: 'admin',
        title: 'Назначения техники',
      },
    },
    {
      path: '/driver',
      name: 'driver-dashboard',
      component: DriverDashboard,
      meta: {
        role: 'driver',
        title: 'Панель водителя',
      },
    },
  ],
});

export default router;

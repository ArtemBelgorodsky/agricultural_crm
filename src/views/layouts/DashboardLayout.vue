<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useFleetStore } from '@/stores/useFleetStore'
import {
  LayoutDashboard,
  Tractor,
  Users2,
  Link2,
  LogOut,
  User,
  Bell,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const fleet = useFleetStore()

const pageTitle = computed(() => route.meta.title || 'Панель управления')

const isAdmin = computed(() => auth.isAdmin)
const isDriver = computed(() => auth.isDriver)

// Локальный стек анимированных уведомлений
const toasts = ref([])
/**
 * Добавление toast на основе lastAction из стора парка
 */
const pushActionToast = (action) => {
  if (!action) return

  const id = `${action.type}-${action.id}-${action.timestamp}-${Math.random().toString(16).slice(2)}`
  const base = {
    id,
    message: action.message || 'Операция выполнена',
    type: action.type || 'info',
    createdAt: Date.now(),
  }

  toasts.value.push(base)

  // Автоудаление с анимацией
  setTimeout(() => {
    const t = document.getElementById(id)
    if (t) {
      t.style.animation = 'rsm-toast-out 0.22s cubic-bezier(0.22, 0.61, 0.36, 1) forwards'
    }
    setTimeout(() => {
      toasts.value = toasts.value.filter((toast) => toast.id !== id)
    }, 230)
  }, 2200)
}

// Следим за lastAction стора useFleetStore и показываем анимированный toast
watch(
  () => fleet.lastAction,
  (val, oldVal) => {
    if (!val) return
    if (oldVal && oldVal.timestamp === val.timestamp && oldVal.type === val.type && oldVal.id === val.id) {
      return
    }
    pushActionToast(val)
  },
  { deep: true }
)

const handleLogout = () => {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="dashboard-layout">
    <aside class="sidebar shadow-sm">
      <div class="sidebar-brand">
        <div class="brand-logo">RSM</div>
        <div class="brand-text">
          <div class="brand-title">Ростсельмаш</div>
          <div class="brand-subtitle">
            Учет сельхозтехники
          </div>
        </div>
      </div>

      <div class="sidebar-user mt-3">
        <div class="avatar">
          <User :size="20" />
        </div>
        <div class="user-info">
          <div class="user-name">
            {{ auth.currentUserName || 'Гость' }}
          </div>
          <div class="user-role">
            {{ auth.currentRoleLabel || 'Неавторизован' }}
          </div>
        </div>
      </div>

      <nav class="sidebar-nav mt-4">
        <RouterLink
          v-if="isAdmin"
          :to="{ name: 'admin-dashboard' }"
          class="nav-link"
        >
          <LayoutDashboard :size="18" />
          <span>Обзор парка</span>
        </RouterLink>

        <RouterLink
          v-if="isAdmin"
          :to="{ name: 'admin-fleet' }"
          class="nav-link"
        >
          <Tractor :size="18" />
          <span>Парк техники</span>
        </RouterLink>

        <RouterLink
          v-if="isAdmin"
          :to="{ name: 'admin-drivers' }"
          class="nav-link"
        >
          <Users2 :size="18" />
          <span>Водители</span>
        </RouterLink>

        <RouterLink
          v-if="isAdmin"
          :to="{ name: 'admin-assignments' }"
          class="nav-link"
        >
          <Link2 :size="18" />
          <span>Назначения</span>
        </RouterLink>

        <RouterLink
          v-if="isDriver"
          :to="{ name: 'driver-dashboard' }"
          class="nav-link"
        >
          <Tractor :size="18" />
          <span>Моя техника</span>
        </RouterLink>
      </nav>

      <div class="sidebar-bottom">
        <button class="btn-logout" type="button" @click="handleLogout">
          <LogOut :size="18" />
          <span>Выход</span>
        </button>
      </div>
    </aside>

    <main class="content">
      <header class="content-header">
        <div>
          <h1 class="page-title">
            {{ pageTitle }}
          </h1>
          <p class="page-subtitle">
            Информационная система учета сельскохозяйственной техники ООО «КЗ Ростсельмаш»
          </p>
        </div>
      </header>

      <section class="content-body">
        <slot />
      </section>
    </main>

    <!-- Контейнер анимированных уведомлений -->
    <div class="rsm-toast-container">
      <div
        v-for="toast in toasts"
        :id="toast.id"
        :key="toast.id"
        class="rsm-toast"
        :class="{
          'rsm-toast--assign': toast.type === 'assign',
          'rsm-toast--unassign': toast.type === 'unassign',
          'rsm-toast--remove': toast.type === 'remove',
          'rsm-toast--add': toast.type === 'add',
          'rsm-toast--update': toast.type === 'update',
        }"
      >
        <div class="rsm-toast__icon">
          <Bell :size="14" />
        </div>
        <div>
          <div class="rsm-toast__text-main">
            {{ toast.message }}
          </div>
          <div class="rsm-toast__text-sub">
            Операция выполнена успешно
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fb;
  color: #111827;
  font-size: 15px;
}

.sidebar {
  width: 260px;
  background-color: #ffffff;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e5e7eb;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: #ffffff;
  display: flex;
 align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.brand-text {
  line-height: 1.25;
}

.brand-title {
  font-weight: 600;
  font-size: 15px;
}

.brand-subtitle {
  font-size: 11px;
  color: #6b7280;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 12px;
  background-color: #f9fafb;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
}

.user-info {
  line-height: 1.2;
}

.user-name {
  font-weight: 500;
  font-size: 13px;
}

.user-role {
  font-size: 11px;
  color: #6b7280;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 10px;
  color: #4b5563;
  text-decoration: none;
  font-size: 13px;
  transition: all 0.18s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.nav-link.router-link-active,
.nav-link:hover {
  background-color: #eff6ff;
  color: #0d6efd;
  transform: translateX(2px);
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.btn-logout {
  width: 100%;
  border: none;
  background-color: transparent;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.btn-logout:hover {
  background-color: #fef2f2;
  transform: translateY(-1px);
}

.content {
  flex: 1;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  padding-bottom: 14px;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #111827;
}

.page-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: #6b7280;
}

.content-body {
  flex: 1;
  margin-top: 6px;
}
</style>
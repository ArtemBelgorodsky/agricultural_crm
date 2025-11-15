<script setup>
import { computed } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isBlankLayout = computed(() => route.meta.layout === 'blank')

router.beforeEach((to, from, next) => {
  const isPublic = to.meta.public
  const requiresAdmin = to.meta.role === 'admin'
  const requiresDriver = to.meta.role === 'driver'

  if (isPublic) {
    return next()
  }

  if (!auth.isAuthenticated) {
    return next({ name: 'login' })
  }

  if (requiresAdmin && !auth.isAdmin) {
    return next({ name: 'driver-dashboard' })
  }

  if (requiresDriver && !auth.isDriver) {
    return next({ name: 'admin-dashboard' })
  }

  return next()
})
</script>

<template>
  <div :class="['app-root', { 'app-root--blank': isBlankLayout }]">
    <RouterView />
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', -system-ui,
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Ubuntu', 'Cantarell', 'Noto Sans',
    'Helvetica Neue', Arial, sans-serif;
  font-size: 15px;
  background-color: #f5f7fb;
  color: #111827;
}

.app-root--blank {
  background-color: #f5f7fb;
}
</style>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { LogIn } from 'lucide-vue-next'

const router = useRouter()
const auth = useAuthStore()

const username = ref('admin')
const password = ref('admin123')
const showPassword = ref(false)

const handleSubmit = async () => {
  if (!username.value || !password.value) {
    auth.error = 'Заполните логин и пароль'
    return
  }

  try {
    await auth.login(username.value, password.value)

    if (auth.isAdmin) {
      router.push({ name: 'admin-dashboard' })
    } else if (auth.isDriver) {
      router.push({ name: 'driver-dashboard' })
    }
  } catch (e) {
    // ошибка уже установлена в сторе
  }
}
</script>

<template>
  <div class="login-page d-flex align-items-center justify-content-center min-vh-100">
    <div class="card shadow-lg border-0 login-card">
      <div class="card-body p-4 p-md-5">
        <div class="text-center mb-4">
          <div class="brand-badge mb-3">
            <span class="brand-icon">RSM</span>
          </div>
          <h1 class="h4 fw-semibold mb-1">
            Информационная система учета сельхозтехники
          </h1>
          <p class="text-muted mb-0 small">
            ООО «КЗ Ростсельмаш»
          </p>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="mb-3">
            <label class="form-label">Логин</label>
            <input
              v-model="username"
              type="text"
              class="form-control form-control-lg"
              placeholder="Введите логин (admin, driver1, driver2)"
            />
          </div>

          <div class="mb-2">
            <label class="form-label">Пароль</label>
            <div class="input-group input-group-lg">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                placeholder="Введите пароль"
              />
              <button
                class="btn btn-outline-secondary"
                type="button"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Скрыть' : 'Показать' }}
              </button>
            </div>
          </div>

          <div v-if="auth.error" class="alert alert-danger py-2 small mb-3">
            {{ auth.error }}
          </div>

          <button type="submit" class="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2">
            <LogIn :size="20" />
            <span>Войти в систему</span>
          </button>

          <p class="text-muted mt-3 small mb-0">
            Доступные учетные записи:
            <br />
            • Администратор парка: admin / admin123
            <br />
            • Водитель: driver1 / driver123, driver2 / driver123</p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  background: radial-gradient(circle at top left, #e8f0ff 0, #ffffff 40%, #f5f7fb 100%);
  padding: 1.5rem;
}

.login-card {
  max-width: 480px;
  width: 100%;
  border-radius: 18px;
  background-color: #ffffff;
}

.brand-badge {
  display: flex;
  justify-content: center;
}

.brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 1.2rem;
  background: linear-gradient(135deg, #0d6efd, #5b8dff);
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 1px;
  font-size: 16px;
}

h1 {
  font-size: 20px;
  line-height: 1.4;
}

.form-label {
  font-size: 14px;
  color: #4a5568;
}

.form-control,
.btn {
  font-size: 15px;
}

.btn-primary {
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  border: none;
  border-radius: 10px;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #0b5ed7, #1d4ed8);
}

.input-group-lg > .form-control,
.input-group-lg > .btn {
  border-radius: 10px;
}

.alert {
  border-radius: 8px;
}
</style>
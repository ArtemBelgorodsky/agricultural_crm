<script setup>
import { ref, computed } from 'vue'
import DashboardLayout from '@/views/layouts/DashboardLayout.vue'
import { useFleetStore } from '@/stores/useFleetStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Users2, UserPlus, Search, Pencil, Trash2, Check, X } from 'lucide-vue-next'

const fleetStore = useFleetStore()
const auth = useAuthStore()

// По ТЗ используем список водителей из стора парка как справочник с возможностью CRUD
const search = ref('')

const filteredDrivers = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return fleetStore.drivers
  return fleetStore.drivers.filter((d) => {
    return (
      d.name.toLowerCase().includes(q) ||
      (d.licenseNumber || '').toLowerCase().includes(q) ||
      (d.phone || '').toLowerCase().includes(q)
    )
  })
})

// Форма добавления / редактирования
const editId = ref(null)
const form = ref({
  name: '',
  licenseNumber: '',
  phone: '',
  avatarUrl: '',
})

const startCreate = () => {
  editId.value = null
  form.value = {
    name: '',
    licenseNumber: '',
    phone: '',
    avatarUrl: '',
  }
}

const startEdit = (driver) => {
  editId.value = driver.id
  form.value = {
    name: driver.name,
    licenseNumber: driver.licenseNumber,
    phone: driver.phone,
    avatarUrl: driver.avatarUrl || '',
  }
}

const resetForm = () => {
  editId.value = null
  form.value = {
    name: '',
    licenseNumber: '',
    phone: '',
    avatarUrl: '',
  }
}

const submitForm = () => {
  const name = form.value.name.trim()
  const license = form.value.licenseNumber.trim()
  const phone = form.value.phone.trim()
  const avatarUrl = form.value.avatarUrl.trim()

  if (!name || !license) {
    alert('Укажите ФИО водителя и номер водительского удостоверения')
    return
  }

  if (editId.value) {
    fleetStore.updateDriver(editId.value, {
      name,
      licenseNumber: license,
      phone,
      avatarUrl,
    })
  } else {
    fleetStore.addDriver({
      name,
      licenseNumber: license,
      phone,
      avatarUrl,
    })
  }

  resetForm()
}

const removeDriver = (driver) => {
  if (
    !confirm(
      `Удалить водителя "${driver.name}" из справочника?\nЕго техника (если была назначена) будет освобождена.`,
    )
  ) {
    return
  }
  fleetStore.removeDriver(driver.id)
}

// Подбор аватара: заданный URL или placeholder
const getAvatarUrl = (driver) => {
  return driver.avatarUrl || 'https://via.placeholder.com/64x64?text=No+Avatar'
}
</script>

<template>
  <DashboardLayout>
    <template #default>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p class="text-muted small mb-0">
            Справочник водителей, допущенных к управлению сельскохозяйственной техникой ООО «КЗ Ростсельмаш»
          </p>
        </div>
        <div class="text-end small text-muted">
          Пользователь: {{ auth.currentUserName }} ({{ auth.currentRoleLabel }})
        </div>
      </div>

      <div class="row g-3">
        <!-- Форма добавления / редактирования водителя -->
        <div class="col-12 col-lg-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white py-2 d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2">
                <UserPlus :size="18" class="text-primary" />
                <span class="fw-semibold small">
                  {{ editId ? 'Редактирование водителя' : 'Добавление водителя' }}
                </span>
              </div>
              <button
                v-if="editId"
                type="button"
                class="btn btn-link btn-sm p-0 small text-decoration-none"
                @click="resetForm"
              >
                <X :size="14" />
                Отмена
              </button>
            </div>
            <div class="card-body small">
              <form @submit.prevent="submitForm">
                <div class="mb-2">
                  <label class="form-label">ФИО *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Например, Иванов Иван Иванович"
                  />
                </div>
                <div class="mb-2">
                  <label class="form-label">Водительское удостоверение *</label>
                  <input
                    v-model="form.licenseNumber"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Серия и номер"
                  />
                </div>
                <div class="mb-2">
                  <label class="form-label">Телефон</label>
                  <input
                    v-model="form.phone"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="+7 (900) 000-00-00"
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">URL аватара (опционально)</label>
                  <input
                    v-model="form.avatarUrl"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="https://... (фото водителя или корпоративный аватар)"
                  />
                  <div class="form-text">
                    Укажите URL аватара водителя. Если не указано, будет показан placeholder.
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary btn-sm d-flex align-items-center gap-1"
                  >
                    <Check :size="14" />
                    <span>{{ editId ? 'Сохранить изменения' : 'Добавить водителя' }}</span>
                  </button>
                  <button
                    v-if="editId"
                    type="button"
                    class="btn btn-outline-secondary btn-sm"
                    @click="resetForm"
                  >
                    Отмена
                  </button>
                </div>
              </form>


            </div>
          </div>
        </div>

        <!-- Таблица водителей с аватарами -->
        <div class="col-12 col-lg-8">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white py-2 d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-2">
                <Users2 :size="16" class="text-primary" />
                <span class="small fw-semibold">Список водителей</span>
              </div>
              <div class="input-group input-group-sm" style="max-width: 260px">
                <span class="input-group-text bg-white border-end-0">
                  <Search :size="14" class="text-muted" />
                </span>
                <input
                  v-model="search"
                  type="text"
                  class="form-control border-start-0"
                  placeholder="Поиск по ФИО, правам, телефону..."
                />
              </div>
            </div>
            <div class="card-body p-2">
              <div class="table-responsive">
                <table class="table table-sm align-middle mb-0">
                  <thead class="table-light small">
                    <tr>
                      <th></th>
                      <th>ФИО</th>
                      <th>Вод. удостоверение</th>
                      <th>Телефон</th>
                      <th class="text-end">Действия</th>
                    </tr>
                  </thead>
                  <tbody class="small">
                    <tr v-for="d in filteredDrivers" :key="d.id">
                      <td>
                        <div class="driver-avatar-wrapper">
                          <img
                            :src="getAvatarUrl(d)"
                            alt="Аватар"
                            class="driver-avatar"
                            loading="lazy"
                            @error="($event.target.src = getAvatarUrl({ name: d.name }))"
                          />
                        </div>
                      </td>
                      <td class="fw-semibold">{{ d.name }}</td>
                      <td>{{ d.licenseNumber }}</td>
                      <td>{{ d.phone }}</td>
                      <td class="text-end">
                        <button
                          type="button"
                          class="btn btn-light btn-sm me-1"
                          @click="startEdit(d)"
                        >
                          <Pencil :size="14" />
                        </button>
                        <button
                          type="button"
                          class="btn btn-outline-danger btn-sm"
                          @click="removeDriver(d)"
                        >
                          <Trash2 :size="14" />
                        </button>
                      </td>
                    </tr>
                    <tr v-if="!filteredDrivers.length">
                      <td colspan="5" class="text-center text-muted py-3">
                        Водители не найдены. Измените поисковый запрос или добавьте нового водителя.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="text-muted small mt-2 mb-0">
                Назначение техники конкретным водителям выполняется в разделе «Назначения».
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<style scoped>
.card {
  border-radius: 14px;
}
.form-label {
  font-size: 12px;
}
.driver-avatar-wrapper {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  overflow: hidden;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}
.driver-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
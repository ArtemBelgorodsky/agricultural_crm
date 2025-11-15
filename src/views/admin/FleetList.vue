<script setup>
import { ref, computed } from 'vue'
import DashboardLayout from '@/views/layouts/DashboardLayout.vue'
import { useFleetStore } from '@/stores/useFleetStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Plus, Trash2, Pencil, Tractor, Search } from 'lucide-vue-next'

const fleetStore = useFleetStore()
const auth = useAuthStore()

const form = ref({
  type: '',
  model: '',
  regNumber: '',
  year: '',
  status: 'доступна',
  location: '',
  imageUrl: '',
})

const editId = ref(null)
const search = ref('')

const filteredFleet = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return fleetStore.fleet
  return fleetStore.fleet.filter((item) => {
    return (
      item.regNumber.toLowerCase().includes(q) ||
      item.model.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      (item.location || '').toLowerCase().includes(q)
    )
  })
})

const getImageForItem = (item) => {
  const key = `${item.type} ${item.model}`.toLowerCase()

  if (key.includes('acros')) {
    return 'https://avatars.mds.yandex.net/i?id=0001c2a6fd1d1392885cf6eb2dbad9da_l-5233775-images-thumbs&n=13'
  }
  if (key.includes('versatile') || key.includes('трактор')) {
    return 'https://avatars.mds.yandex.net/i?id=e8524a5650ae3af636d77ff4690b184c7f9c57c0da266242-12421090-images-thumbs&n=13'
  }
  if (key.includes('ts-3200') || key.includes('опрыскиватель')) {
    return 'https://yandex-images.clstorage.net/Nmea50231/3319aboN/MBxcbOAJSwDU13Z5_0_E4hsPc3a4RijDE178YxTVGk2Vdvp4xDXGpGuPbtx4DXrgydJ4cOj9guMLhyOkSWsqLJWIaSg1fV7kpNcnPU_rBULaDie3bHd84oMeifPRo4mKt0FJylJHEfPsfsvpiF1uUX32ruYcrZdzDEVCJDjafbuSnm4MwPg5NIRklu1s_KSiuG4nFnuFnpG1DDx3tRBJeNWhSJqRpqLzP65Iexl_TcXuRXwm2g-1MY00caR6eb57ka-e_DJ7yMRVB5fcHf9EUjlNxBUIVf2ylP5dh-bh-SiFsTkKUnXiENw-CehrPb6Vf7fN5Qh9BuEulQO1OjhvyMENTP0hGKqW5DQFf199xDF6XFemKVWdALXd7JS1sMsoB6IqyCMX0OAPrjq5WZwedT93Pgf5jkQivsVBxVo6_-rxH35ukmiIVaR2tXxOvIZByC63NtjkbWMHPf8mhfN7SNfB6ajBJ9IDv91LWFqsHnbdVOx3ic2lEewWMITpy96Kwn38HLEKGPdFV_Yv_Z-nQ9peFDbZVc1jZy1MBOWACei2U9kYEYSRs2zd23vpHd1lvKZf10hv5yKdt0KViPl-2uJvDs_SmPhVpZeVv99_ZjFabofkSie_QxZ-_wQk8OsbtMGre-OXA0Asv4pbqxy9F633PVR7r4UiHcVAhqs5vlji_A18wig7p1ZEVX3vrKVzSH-XpTlVvTFkfywE5iIKCPTRWhmSx1Pw7h266ip-Dnc_dRwUmY5V45_mY2a6e1-bAr9PH9K7WEQEZ7XuvC0Uw2vdxub5V0zjFg78BYXguGo0YuiqQCTyo-xPCUnq3V9E36Wfhqr99sK8tYNnaRtfyGAuHg0zOTqUhvX1fE-85RNbvLXU2GesUbWtD4Rl8Bl7JgPLOgMEwMNsjXmbuX_tFj6EbZVqb5ayHNXTtIgZz4piv0zdg1sI9HRVJ-9sTzQgq__HJ9iUPmD0LMzl1vJbI'
  }

  return (
    item.imageUrl ||
    'https://images.rostselmash.com/rsm-generic-agri-tech.jpg'
  )
}

const resetForm = () => {
  form.value = {
    type: '',
    model: '',
    regNumber: '',
    year: '',
    status: 'доступна',
    location: '',
    imageUrl: '',
  }
  editId.value = null
}

const startEdit = (item) => {
  editId.value = item.id
  form.value = {
    type: item.type,
    model: item.model,
    regNumber: item.regNumber,
    year: item.year,
    status: item.status,
    location: item.location,
    imageUrl: item.imageUrl || '',
  }
}

const submitForm = () => {
  if (!form.value.type || !form.value.model || !form.value.regNumber || !form.value.year) {
    alert('Заполните обязательные поля: тип, модель, гос. номер, год выпуска')
    return
  }

  const yearNum = Number(form.value.year)
  if (Number.isNaN(yearNum) || yearNum < 1990 || yearNum > new Date().getFullYear() + 1) {
    alert('Укажите корректный год выпуска')
    return
  }

  const payload = {
    type: form.value.type,
    model: form.value.model,
    regNumber: form.value.regNumber,
    year: yearNum,
    status: form.value.status || 'доступна',
    location: form.value.location || 'Не указано',
    imageUrl: form.value.imageUrl?.trim() || '',
  }

  if (editId.value) {
    fleetStore.updateFleetItem(editId.value, payload)
  } else {
    fleetStore.addFleetItem(payload)
  }

  resetForm()
}

const removeItem = (id) => {
  if (!confirm('Удалить единицу техники из парка?')) return
  fleetStore.removeFleetItem(id)
}
</script>

<template>
  <DashboardLayout>
    <template #default>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p class="text-muted small mb-0">
            Управление составом парка сельскохозяйственной техники ООО «КЗ Ростсельмаш»
          </p>
        </div>
        <div class="text-end small text-muted">
          Пользователь: {{ auth.currentUserName }} ({{ auth.currentRoleLabel }})
        </div>
      </div>

      <div class="row g-3">
        <!-- Форма техники -->
        <div class="col-12 col-lg-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white py-2 d-flex align-items-center gap-2">
              <Tractor :size="18" class="text-primary" />
              <span class="fw-semibold small">
                {{ editId ? 'Редактирование техники' : 'Добавление техники' }}
              </span>
            </div>
            <div class="card-body p-3">
              <form @submit.prevent="submitForm" class="small">
                <div class="mb-2">
                  <label class="form-label">Тип техники *</label>
                  <input
                    v-model="form.type"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Комбайн, трактор и т.д."
                  />
                </div>
                <div class="mb-2">
                  <label class="form-label">Модель *</label>
                  <input
                    v-model="form.model"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Например, ACROS 595 Plus"
                  />
                </div>
                <div class="mb-2">
                  <label class="form-label">Гос. номер / инв. номер *</label>
                  <input
                    v-model="form.regNumber"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="RSM-001"
                  />
                </div>
                <div class="mb-2">
                  <label class="form-label">Год выпуска *</label>
                  <input
                    v-model="form.year"
                    type="number"
                    class="form-control form-control-sm"
                    placeholder="2022"
                  />
                </div>
                <div class="mb-2">
                  <label class="form-label">Статус</label>
                  <select v-model="form.status" class="form-select form-select-sm">
                    <option value="доступна">Доступна</option>
                    <option value="в работе">В работе</option>
                    <option value="на обслуживании">На обслуживании</option>
                  </select>
                </div>
                <div class="mb-2">
                  <label class="form-label">Местоположение</label>
                  <input
                    v-model="form.location"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="Поле, гараж, сервис и т.д."
                  />
                </div>
                <div class="mb-3">
                  <label class="form-label">
                    URL изображения техники (опционально)
                  </label>
                  <input
                    v-model="form.imageUrl"
                    type="text"
                    class="form-control form-control-sm"
                    placeholder="https://... (фото комбайна/трактора)"
                  />
                  <div class="form-text">
                    Если не указано, система подставит типовое изображение по типу/модели.
                  </div>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary btn-sm d-flex align-items-center gap-1">
                    <Plus :size="16" />
                    <span>{{ editId ? 'Сохранить изменения' : 'Добавить в парк' }}</span>
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

        <!-- Карточки + таблица техники -->
        <div class="col-12 col-lg-8">
          <div class="card shadow-sm border-0 h-100 mb-3">
            <div class="card-header bg-white py-2 d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center gap-2">
                <Tractor :size="16" class="text-primary" />
                <span class="small fw-semibold">Карточки техники</span>
              </div>
              <div class="input-group input-group-sm" style="max-width: 260px">
                <input
                  v-model="search"
                  type="text"
                  class="form-control"
                  placeholder="Поиск по номеру, модели, типу..."
                />
              </div>
            </div>
            <div class="card-body p-2">
              <div class="row g-2">
                <div
                  v-for="item in filteredFleet"
                  :key="item.id"
                  class="col-12 col-md-6"
                >
                  <div class="fleet-card">
                    <div class="fleet-card-image-wrapper">
                      <img
                        :src="getImageForItem(item)"
                        alt="Техника"
                        class="fleet-card-image"
                        loading="lazy"
                        @error="($event.target.src = 'https://images.rostselmash.com/rsm-generic-agri-tech.jpg')"
                      />
                    </div>
                    <div class="fleet-card-body">
                      <div class="fleet-card-title">
                        {{ item.type }} • {{ item.model }}
                      </div>
                      <div class="fleet-card-sub">
                        Гос. номер: <span class="fw-semibold">{{ item.regNumber }}</span>
                      </div>
                      <div class="fleet-card-sub">
                        Год выпуска: {{ item.year }} •
                        <span
                          class="badge rounded-pill ms-1"
                          :class="{
                            'text-bg-success': item.status === 'в работе',
                            'text-bg-secondary': item.status === 'доступна',
                            'text-bg-warning text-dark': item.status === 'на обслуживании',
                          }"
                        >
                          {{ item.status }}
                        </span>
                      </div>
                      <div class="fleet-card-sub">
                        Местоположение: {{ item.location }}
                      </div>
                      <div class="d-flex justify-content-end gap-1 mt-2">
                        <button
                          class="btn btn-light btn-sm"
                          type="button"
                          @click="startEdit(item)"
                        >
                          <Pencil :size="14" />
                        </button>
                        <button
                          class="btn btn-outline-danger btn-sm"
                          type="button"
                          @click="removeItem(item.id)"
                        >
                          <Trash2 :size="14" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="!filteredFleet.length"
                  class="col-12 text-center text-muted small py-3"
                >
                  Техника не найдена. Измените поиск или добавьте новую единицу.
                </div>
              </div>
            </div>
          </div>

          <!-- Таблица (оставлена как компактная сводка под карточками) -->
          <div class="card shadow-sm border-0">
            <div class="card-header bg-white py-2 d-flex align-items-center gap-2">
              <Search :size="16" class="text-muted" />
              <span class="small fw-semibold">Сводная таблица техники</span>
            </div>
            <div class="card-body p-2">
              <div class="table-responsive">
                <table class="table table-sm align-middle mb-0">
                  <thead class="table-light small">
                    <tr>
                      <th>Рег. номер</th>
                      <th>Тип / модель</th>
                      <th>Год</th>
                      <th>Статус</th>
                      <th>Местоположение</th>
                    </tr>
                  </thead>
                  <tbody class="small">
                    <tr v-for="item in filteredFleet" :key="item.id">
                      <td class="fw-semibold">{{ item.regNumber }}</td>
                      <td>
                        <div>{{ item.type }}</div>
                        <div class="text-muted">{{ item.model }}</div>
                      </td>
                      <td>{{ item.year }}</td>
                      <td>
                        <span
                          class="badge rounded-pill"
                          :class="{
                            'text-bg-success': item.status === 'в работе',
                            'text-bg-secondary': item.status === 'доступна',
                            'text-bg-warning text-dark': item.status === 'на обслуживании',
                          }"
                        >
                          {{ item.status }}
                        </span>
                      </td>
                      <td>{{ item.location }}</td>
                    </tr>
                    <tr v-if="!filteredFleet.length">
                      <td colspan="5" class="text-center text-muted py-3">
                        Техника не найдена.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="text-muted small mt-2 mb-0">
                Карточки выше предоставляют визуальное представление техники, таблица — компактную структурированную сводку.
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

.table th,
.table td {
  vertical-align: middle;
}

/* Карточки техники */
.fleet-card {
  display: flex;
  gap: 8px;
  padding: 6px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 253, 0.18);
  background-color: #ffffff;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  transition: all 0.18s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.fleet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.12);
}

.fleet-card-image-wrapper {
  width: 88px;
  height: 64px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fleet-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.fleet-card-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.fleet-card-title {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.fleet-card-sub {
  font-size: 11px;
  color: #6b7280;
}
</style>
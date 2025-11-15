<script setup>
import { ref, computed } from 'vue'
import DashboardLayout from '@/views/layouts/DashboardLayout.vue'
import { useFleetStore } from '@/stores/useFleetStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Link2, Tractor, Users2 } from 'lucide-vue-next'

const fleetStore = useFleetStore()
const auth = useAuthStore()

const selectedFleetId = ref(null)
const selectedDriverId = ref(null)

const availableFleet = computed(() =>
  fleetStore.fleet.filter((i) => !i.assignedDriverId),
)

const assignedFleet = computed(() =>
  fleetStore.fleet.filter((i) => i.assignedDriverId),
)

const assign = () => {
  if (!selectedFleetId.value || !selectedDriverId.value) {
    alert('Выберите технику и водителя')
    return
  }
  fleetStore.assignToDriver(Number(selectedFleetId.value), Number(selectedDriverId.value))
  selectedFleetId.value = null
  selectedDriverId.value = null
}

const unassign = (fleetId) => {
  if (!confirm('Открепить водителя от выбранной техники?')) return
  fleetStore.unassignFromDriver(fleetId)
}
</script>

<template>
  <DashboardLayout>
    <template #default>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="text-end small text-muted">
          Пользователь: {{ auth.currentUserName }} ({{ auth.currentRoleLabel }})
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white py-2 d-flex align-items-center gap-2">
              <Link2 :size="18" class="text-primary" />
              <span class="fw-semibold small">Форма назначения</span>
            </div>
            <div class="card-body small">
              <div class="mb-2">
                <label class="form-label">Свободная техника</label>
                <select
                  v-model="selectedFleetId"
                  class="form-select form-select-sm"
                >
                  <option value="">— Выберите единицу техники —</option>
                  <option
                    v-for="item in availableFleet"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.regNumber }} — {{ item.type }} {{ item.model }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Водитель</label>
                <select
                  v-model="selectedDriverId"
                  class="form-select form-select-sm"
                >
                  <option value="">— Выберите водителя —</option>
                  <option
                    v-for="d in fleetStore.drivers"
                    :key="d.id"
                    :value="d.id"
                  >
                    {{ d.name }} ({{ d.licenseNumber }})
                  </option>
                </select>
              </div>

              <button
                type="button"
                class="btn btn-primary btn-sm w-100 mb-2"
                @click="assign"
              >
                Назначить технику водителю
              </button>

              <p class="text-muted small mb-0">
                Все операции выполняются в рамках текущего состояния системы и могут быть
                интегрированы с backend-сервисом без изменения интерфейса.
              </p>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-8">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white py-2 d-flex align-items-center gap-2">
              <Tractor :size="18" class="text-primary" />
              <span class="fw-semibold small">Техника с назначенными водителями</span>
            </div>
            <div class="card-body p-2">
              <div class="table-responsive">
                <table class="table table-sm align-middle mb-0">
                  <thead class="table-light small">
                    <tr>
                      <th>Рег. номер</th>
                      <th>Тип / модель</th>
                      <th>Водитель</th>
                      <th>Местоположение</th>
                      <th class="text-end">Действия</th>
                    </tr>
                  </thead>
                  <tbody class="small">
                    <tr v-for="item in assignedFleet" :key="item.id">
                      <td class="fw-semibold">{{ item.regNumber }}</td>
                      <td>
                        <div>{{ item.type }}</div>
                        <div class="text-muted">{{ item.model }}</div>
                      </td>
                      <td>
                        <div v-if="item.assignedDriverId">
                          <div class="fw-semibold">
                            {{
                              fleetStore.driverById(item.assignedDriverId)
                                ? fleetStore.driverById(item.assignedDriverId).name
                                : '—'
                            }}
                          </div>
                          <div class="text-muted">
                            {{
                              fleetStore.driverById(item.assignedDriverId)
                                ? fleetStore.driverById(item.assignedDriverId).licenseNumber
                                : ''
                            }}
                          </div>
                        </div>
                        <span v-else class="text-muted">Не назначен</span>
                      </td>
                      <td>{{ item.location }}</td>
                      <td class="text-end">
                        <button
                          class="btn btn-outline-danger btn-sm"
                          type="button"
                          @click="unassign(item.id)"
                        >
                          Открепить
                        </button>
                      </td>
                    </tr>
                    <tr v-if="!assignedFleet.length">
                      <td colspan="5" class="text-center text-muted py-3">
                        Пока нет назначений. Используйте форму слева для закрепления техники за
                        водителями.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p class="text-muted small mt-2 mb-0">
                Назначения актуализируются мгновенно и используются во всех разделах системы.
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
</style>
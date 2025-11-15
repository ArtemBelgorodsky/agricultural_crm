<script setup>
import { computed } from 'vue'
import { useFleetStore } from '@/stores/useFleetStore'
import { useAuthStore } from '@/stores/useAuthStore'
import DashboardLayout from '@/views/layouts/DashboardLayout.vue'
import { Tractor, Activity, Wrench, UserCheck } from 'lucide-vue-next'

const fleetStore = useFleetStore()
const auth = useAuthStore()

const total = computed(() => fleetStore.total)
const available = computed(() => fleetStore.available)
const inService = computed(() => fleetStore.inService)
const assigned = computed(() => fleetStore.fleet.filter(i => i.assignedDriverId).length)

const lastItems = computed(() =>
  fleetStore.fleet.slice().reverse().slice(0, 5),
)
</script>

<template>
  <DashboardLayout>
    <template #default>
      <div class="row g-3 mb-3">
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="stat-icon primary">
              <Tractor :size="20" />
            </div>
            <div class="stat-label">Всего единиц техники</div>
            <div class="stat-value">{{ total }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="stat-icon success">
              <Activity :size="20" />
            </div>
            <div class="stat-label">В работе / закреплено</div>
            <div class="stat-value">{{ assigned }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="stat-icon info">
              <UserCheck :size="20" />
            </div>
            <div class="stat-label">Свободная техника</div>
            <div class="stat-value">{{ available }}</div>
          </div>
        </div>
        <div class="col-6 col-md-3">
          <div class="stat-card">
            <div class="stat-icon warning">
              <Wrench :size="20" />
            </div>
            <div class="stat-label">На обслуживании</div>
            <div class="stat-value">{{ inService }}</div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm border-0">
        <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <div>
            <h2 class="h6 mb-0">Сводка по парку техники</h2>
            <div class="text-muted small">
              Авторизованный пользователь: {{ auth.currentUserName }} ({{ auth.currentRoleLabel }})
            </div>
          </div>
          <span class="badge text-bg-primary small">
            ООО «КЗ Ростсельмаш»
          </span>
        </div>
        <div class="card-body p-3 p-md-3">
          <div class="table-responsive">
            <table class="table table-sm align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Рег. номер</th>
                  <th>Тип</th>
                  <th>Модель</th>
                  <th>Статус</th>
                  <th>Местоположение</th>
                  <th>Водитель</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in lastItems" :key="item.id">
                  <td class="fw-semibold">{{ item.regNumber }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.model }}</td>
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
                  <td>
                    <span v-if="item.assignedDriverId">
                      {{
                        fleetStore.driverById(item.assignedDriverId)
                          ? fleetStore.driverById(item.assignedDriverId).name
                          : '—'
                      }}
                    </span>
                    <span v-else class="text-muted">Не назначен</span>
                  </td>
                </tr>
                <tr v-if="!lastItems.length">
                  <td colspan="6" class="text-center text-muted small py-3">
                    Нет зарегистрированной техники
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="mt-3 mb-0 text-muted small">
            Данный дашборд предназначен для визуализации ключевых показателей использования парка сельскохозяйственной техники ООО «КЗ Ростсельмаш» и поддержания контроля за задействованием техники и загрузкой водителей.
          </p>
        </div>
      </div>
    </template>
  </DashboardLayout>
</template>

<style scoped>
.stat-card {
  padding: 10px 10px;
  background-color: #ffffff;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.03);
}

.stat-icon {
  width: 26px;
  height: 26px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  margin-bottom: 2px;
}

.stat-icon.primary {
  background: linear-gradient(135deg, #0d6efd, #2563eb);
}

.stat-icon.success {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.stat-icon.info {
  background: linear-gradient(135deg, #38bdf8, #0ea5e9);
}

.stat-icon.warning {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.stat-label {
  font-size: 11px;
  color: #6b7280;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}
</style>
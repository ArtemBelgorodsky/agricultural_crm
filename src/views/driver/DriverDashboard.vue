<script setup>
import { computed } from 'vue'
import DashboardLayout from '@/views/layouts/DashboardLayout.vue'
import { useFleetStore } from '@/stores/useFleetStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { Tractor, Link2, PlusCircle, MinusCircle } from 'lucide-vue-next'

const fleetStore = useFleetStore()
const auth = useAuthStore()

const myFleet = computed(() => {
  if (!auth.user) return []
  return fleetStore.getDriverFleet(auth.user.id)
})

const freeFleet = computed(() =>
  fleetStore.fleet.filter((i) => !i.assignedDriverId && i.status !== 'на обслуживании'),
)

const attach = (fleetId) => {
  if (!auth.user) return
  fleetStore.assignToDriver(fleetId, auth.user.id)
}

const detach = (fleetId) => {
  if (!auth.user) return
  const item = fleetStore.fleet.find((i) => i.id === fleetId)
  if (!item || item.assignedDriverId !== auth.user.id) return
  fleetStore.unassignFromDriver(fleetId)
}
</script>

<template>
  <DashboardLayout>
    <template #default>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 class="h5 mb-0">Моя техника</h2>
          <p class="text-muted small mb-0">
            Панель водителя. Просмотр закреплённой техники и самостоятельное закрепление доступных
            единиц парка.
          </p>
        </div>
        <div class="text-end small text-muted">
          Пользователь: {{ auth.currentUserName }} ({{ auth.currentRoleLabel }})
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-6">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white py-2 d-flex align-items-center gap-2">
              <Tractor :size="18" class="text-primary" />
              <span class="fw-semibold small">Закреплённая за мной техника</span>
            </div>
            <div class="card-body p-2">
              <div v-if="myFleet.length" class="table-responsive">
                <table class="table table-sm align-middle mb-0 small">
                  <thead class="table-light">
                    <tr>
                      <th>Рег. номер</th>
                      <th>Тип / модель</th>
                      <th>Статус</th>
                      <th>Местоположение</th>
                      <th class="text-end">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in myFleet" :key="item.id">
                      <td class="fw-semibold">{{ item.regNumber }}</td>
                      <td>
                        <div>{{ item.type }}</div>
                        <div class="text-muted">{{ item.model }}</div>
                      </td>
                      <td>
                        <span
                          class="badge rounded-pill"
                          :class="{
                            'text-bg-success': item.status === 'в работе',
                            'text-bg-warning text-dark': item.status === 'на обслуживании',
                            'text-bg-secondary': item.status === 'доступна',
                          }"
                        >
                          {{ item.status }}
                        </span>
                      </td>
                      <td>{{ item.location }}</td>
                      <td class="text-end">
                        <button
                          type="button"
                          class="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1"
                          @click="detach(item.id)"
                        >
                          <MinusCircle :size="14" />
                          <span>Открепить</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-center text-muted small py-3">
                За вами пока не закреплена техника. Выберите доступную технику справа и выполните
                самозакрепление.
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-6">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-white py-2 d-flex align-items-center gap-2">
              <Link2 :size="18" class="text-primary" />
              <span class="fw-semibold small">Доступная техника для самозакрепления</span>
            </div>
            <div class="card-body p-2">
              <div v-if="freeFleet.length" class="table-responsive">
                <table class="table table-sm align-middle mb-0 small">
                  <thead class="table-light">
                    <tr>
                      <th>Рег. номер</th>
                      <th>Тип / модель</th>
                      <th>Местоположение</th>
                      <th class="text-end">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in freeFleet" :key="item.id">
                      <td class="fw-semibold">{{ item.regNumber }}</td>
                      <td>
                        <div>{{ item.type }}</div>
                        <div class="text-muted">{{ item.model }}</div>
                      </td>
                      <td>{{ item.location }}</td>
                      <td class="text-end">
                        <button
                          type="button"
                          class="btn btn-primary btn-sm d-inline-flex align-items-center gap-1"
                          @click="attach(item.id)"
                        >
                          <PlusCircle :size="14" />
                          <span>Закрепить</span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-center text-muted small py-3">
                Нет свободной техники для закрепления. Обратитесь к администратору парка.
              </div>
              <p class="text-muted small mt-2 mb-0">
                Данный модуль демонстрирует возможность самозакрепления техники водителем при
                наличии прав и свободных единиц парка. В промышленной системе операции будут
                логироваться и подтверждаться регламентом.
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
</style>
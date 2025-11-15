import { defineStore } from 'pinia';

/**
 * Мок-данные техники и водителей для системы учета сельхозтехники ООО «КЗ Ростсельмаш».
 * В реальной системе данные приходят с сервера, а операции логируются.
 */

const mockDrivers = [
  {
    id: 2,
    name: 'Иван Петров',
    licenseNumber: 'A123456',
    phone: '+7 (900) 111-22-33',
    avatarUrl:
      'https://i.pinimg.com/736x/b1/1f/89/b11f89e508b39d4fa0990a30cff2eded.jpg',
  },
  {
    id: 3,
    name: 'Алексей Смирнов',
    licenseNumber: 'B654321',
    phone: '+7 (900) 444-55-66',
    avatarUrl:
      'https://bonifas.ru/wp-content/uploads/2019/06/don-vito-corleone.jpg',
  },
];

const mockFleet = [
  {
    id: 1,
    type: 'Комбайн',
    model: 'ACROS 595 Plus',
    regNumber: 'RSM-001',
    year: 2022,
    status: 'в работе',
    location: 'Поле №1',
    assignedDriverId: 2,
  },
  {
    id: 2,
    type: 'Трактор',
    model: 'VERSATILE 2375',
    regNumber: 'RSM-002',
    year: 2021,
    status: 'доступна',
    location: 'Гараж',
    assignedDriverId: null,
  },
  {
    id: 3,
    type: 'Опрыскиватель',
    model: 'RSM TS-3200',
    regNumber: 'RSM-003',
    year: 2020,
    status: 'на обслуживании',
    location: 'Сервисный центр',
    assignedDriverId: 3,
  },
];

export const useFleetStore = defineStore('fleet', {
  state: () => ({
    fleet: [...mockFleet],
    drivers: [...mockDrivers],
    nextFleetId: mockFleet.length + 1,
    nextDriverId: mockDrivers.length + 1,
    // для анимаций / уведомлений
    lastAction: null, // { type, message, entity, id, timestamp }
  }),

  getters: {
    total: (state) => state.fleet.length,
    available: (state) => state.fleet.filter((i) => !i.assignedDriverId).length,
    inService: (state) =>
      state.fleet.filter((i) => i.status === 'на обслуживании').length,
    byDriver: (state) => {
      return (driverId) =>
        state.fleet.filter((i) => i.assignedDriverId === driverId);
    },
    driverById: (state) => {
      return (id) => state.drivers.find((d) => d.id === id) || null;
    },
  },

  actions: {
    setLastAction(action) {
      this.lastAction = {
        ...action,
        timestamp: Date.now(),
      };
    },

    // ------- ТЕХНИКА -------

    addFleetItem(payload) {
      const item = {
        id: this.nextFleetId++,
        ...payload,
        assignedDriverId: payload.assignedDriverId || null,
      };
      this.fleet.push(item);
      this.setLastAction({
        type: 'add',
        entity: 'fleet',
        id: item.id,
        message: `Техника ${item.regNumber} добавлена в парк`,
      });
    },

    updateFleetItem(id, payload) {
      const index = this.fleet.findIndex((i) => i.id === id);
      if (index === -1) return;
      const before = this.fleet[index];
      this.fleet[index] = {
        ...this.fleet[index],
        ...payload,
      };
      this.setLastAction({
        type: 'update',
        entity: 'fleet',
        id,
        message: `Данные по технике ${before.regNumber} обновлены`,
      });
    },

    removeFleetItem(id) {
      const item = this.fleet.find((i) => i.id === id);
      this.fleet = this.fleet.filter((i) => i.id !== id);
      this.setLastAction({
        type: 'remove',
        entity: 'fleet',
        id,
        message: item
          ? `Техника ${item.regNumber} удалена из парка`
          : 'Единица техники удалена',
      });
    },

    assignToDriver(fleetId, driverId) {
      const item = this.fleet.find((i) => i.id === fleetId);
      const driver = this.drivers.find((d) => d.id === driverId);
      if (!item || !driver) return;
      item.assignedDriverId = driverId;
      if (item.status !== 'на обслуживании') {
        item.status = 'в работе';
      }
      this.setLastAction({
        type: 'assign',
        entity: 'assignment',
        id: item.id,
        message: `Техника ${item.regNumber} закреплена за водителем ${driver.name}`,
      });
    },

    unassignFromDriver(fleetId) {
      const item = this.fleet.find((i) => i.id === fleetId);
      if (!item) return;
      const driver = item.assignedDriverId
        ? this.drivers.find((d) => d.id === item.assignedDriverId)
        : null;

      item.assignedDriverId = null;
      if (item.status === 'в работе') {
        item.status = 'доступна';
      }

      this.setLastAction({
        type: 'unassign',
        entity: 'assignment',
        id: item.id,
        message: driver
          ? `Техника ${item.regNumber} откреплена от водителя ${driver.name}`
          : `Техника ${item.regNumber} откреплена`,
      });
    },

    getDriverFleet(driverId) {
      return this.fleet.filter((i) => i.assignedDriverId === driverId);
    },

    // ------- ВОДИТЕЛИ (CRUD) -------

    addDriver(payload) {
      const driver = {
        id: this.nextDriverId++,
        name: payload.name?.trim(),
        licenseNumber: payload.licenseNumber?.trim(),
        phone: payload.phone?.trim(),
        avatarUrl: payload.avatarUrl?.trim() || '',
      };
      if (!driver.name || !driver.licenseNumber) return;

      this.drivers.push(driver);
      this.setLastAction({
        type: 'add',
        entity: 'driver',
        id: driver.id,
        message: `Водитель ${driver.name} добавлен в справочник`,
      });
    },

    updateDriver(id, payload) {
      const index = this.drivers.findIndex((d) => d.id === id);
      if (index === -1) return;
      const before = this.drivers[index];
      this.drivers[index] = {
        ...this.drivers[index],
        ...payload,
        name: (payload.name ?? this.drivers[index].name).trim(),
        licenseNumber: (
          payload.licenseNumber ?? this.drivers[index].licenseNumber
        ).trim(),
        phone: (payload.phone ?? this.drivers[index].phone).trim(),
        avatarUrl: (payload.avatarUrl ?? this.drivers[index].avatarUrl).trim(),
      };
      this.setLastAction({
        type: 'update',
        entity: 'driver',
        id,
        message: `Данные водителя ${before.name} обновлены`,
      });
    },

    removeDriver(id) {
      const driver = this.drivers.find((d) => d.id === id);
      if (!driver) return;

      // Сбрасываем назначение техники этому водителю
      this.fleet = this.fleet.map((item) => {
        if (item.assignedDriverId === id) {
          return {
            ...item,
            assignedDriverId: null,
            status: item.status === 'в работе' ? 'доступна' : item.status,
          };
        }
        return item;
      });

      this.drivers = this.drivers.filter((d) => d.id !== id);

      this.setLastAction({
        type: 'remove',
        entity: 'driver',
        id,
        message: `Водитель ${driver.name} удален из справочника; назначенная техника освобождена`,
      });
    },
  },
});

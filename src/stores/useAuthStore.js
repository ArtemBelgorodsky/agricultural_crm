import { defineStore } from 'pinia';

/**
 * Мок-пользователи для дипломного проекта
 * Пароли только для демонстрации, в реальной системе должны храниться безопасно.
 */
const mockUsers = [
  {
    id: 1,
    role: 'admin',
    name: 'Администратор парка',
    username: 'admin',
    password: 'admin123',
    organization: 'ООО «КЗ Ростсельмаш»',
  },
  {
    id: 2,
    role: 'driver',
    name: 'Иван Петров',
    username: 'driver1',
    password: 'driver123',
    organization: 'ООО «КЗ Ростсельмаш»',
  },
  {
    id: 3,
    role: 'driver',
    name: 'Алексей Смирнов',
    username: 'driver2',
    password: 'driver123',
    organization: 'ООО «КЗ Ростсельмаш»',
  },
];

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isDriver: (state) => state.user?.role === 'driver',
    currentUserName: (state) => state.user?.name || '',
    currentRoleLabel: (state) => {
      if (!state.user) return '';
      return state.user.role === 'admin' ? 'Администратор' : 'Водитель';
    },
  },

  actions: {
    login(username, password) {
      this.isLoading = true;
      this.error = null;

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const found = mockUsers.find(
            (u) => u.username === username && u.password === password
          );

          if (!found) {
            this.error = 'Неверный логин или пароль';
            this.isLoading = false;
            reject(new Error('Invalid credentials'));
            return;
          }

          this.user = {
            id: found.id,
            role: found.role,
            name: found.name,
            username: found.username,
            organization: found.organization,
          };
          this.isLoading = false;
          resolve(this.user);
        }, 500);
      });
    },

    logout() {
      this.user = null;
      this.error = null;
    },
  },
});

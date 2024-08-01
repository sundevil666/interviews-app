import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const userId = ref<string | number | null>(null);

  const logIn = (id: string | number) => {
    userId.value = id
  }
  const logOut = () => {
    userId.value = null
  }

  return { userId, logIn, logOut }
})

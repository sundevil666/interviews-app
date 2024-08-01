<template>
  <router-view />
</template>

<script setup lang="ts">
import { Loading } from 'quasar';
import { useUserStore } from 'stores/user';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

defineOptions({
  name: 'App'
});

const userStore = useUserStore();

onAuthStateChanged(getAuth(), (user) => {
  Loading.show();
  if(user) {
    userStore.userId = user.uid
  } else {
    userStore.userId = null
  }
  Loading.hide();
})
</script>

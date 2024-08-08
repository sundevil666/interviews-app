<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Interview App
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <template v-if="!isAuth">
          <EssentialLink
            :key="authBtn.title"
            v-bind="authBtn"
            :class="getRouteName === authBtn.link ? 'q-checkbox__inner--truthy' : ''"
            @click="onAuth"
          />
        </template>
        <template v-else>
          <EssentialLink
            v-for="item in menuList"
            :key="item.title"
            v-bind="item"
            :class="getRouteName === item.link ? 'q-checkbox__inner--truthy' : ''"
            @click="navigate(item.link)"
          />
          <EssentialLink
            :key="logOutBtn.title"
            v-bind="logOutBtn"
            @click="logOut"
          />
        </template>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Notify } from 'quasar';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from 'stores/user';
import { getAuth, signOut } from 'firebase/auth';
import EssentialLink, { IEssentialLinkProps } from 'components/EssentialLink.vue';

defineOptions({
  name: 'MainLayout'
});

const router = useRouter();
const route = useRoute();

const userStore = useUserStore();

const menuList: IEssentialLinkProps[] = [
  {
    title: 'Add',
    link: 'AddInterview',
    icon: 'add',
  },
  {
    title: 'List interviews',
    link: 'ListInterviews',
    icon: 'list',
  },
  {
    title: 'Statistics',
    link: 'Statistics',
    icon: 'public',
  }
] as IEssentialLinkProps[];

const logOutBtn: IEssentialLinkProps = {
  title: 'Выход',
  icon: 'logout',
} as IEssentialLinkProps;

const authBtn: IEssentialLinkProps = {
  title: 'Авторизация',
  icon: 'person',
} as IEssentialLinkProps;

const leftDrawerOpen = ref<boolean>(false);
const isAuth = computed<boolean>(() => !!userStore.userId);
const getRouteName = computed<string>(() => route.name as string);

function toggleLeftDrawer (): void {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function onAuth () {
  router.push({name: 'Home'});
}
async function logOut (): Promise<void> {
  await signOut(getAuth());
  router.push({name: 'Auth'});
  Notify.create({
    message: 'User logged out',
  })
}

function navigate(link: string | undefined) {
  if (!link) {
    return
  }
  router.push({name: link});
}
</script>

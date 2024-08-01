<template>
  <q-page class="q-pa-md AuthPage">
    <div class="flex justify-center">
      <q-tabs
        v-model="tab"
        align="justify"
        narrow-indicator
        class="q-mb-md"
      >
        <q-tab name="login" label="Logins" />
        <q-tab name="registration" label="Registrations" />
      </q-tabs>
    </div>

    <div class="q-gutter-y-sm">
      <q-tab-panels
        v-model="tab"
        animated
      >
        <q-tab-panel name="login">
          <div class="row justify-center">
            <div class="col-8">
              <q-input v-model="email" type="text" label="Email" class="q-mb-md" />
              <q-input v-model="password" type="password" label="Password" class="q-mb-md" />
              <q-btn label="Login" @click="signIn" />
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="registration">
          <div class="row justify-center">
            <div class="col-8">
              <q-input v-model="email" type="text" label="Email" class="q-mb-md" />
              <q-input v-model="password" type="password" label="Password" class="q-mb-md" />
              <q-btn label="Register" @click="signUp" />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Notify, Loading } from 'quasar';
import { useRouter } from 'vue-router';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const router = useRouter();

defineOptions({
  name: 'AuthPage'
});

const email = ref<string>('');
const password = ref<string>('');
const tab = ref<string>('login')

async function signIn(): Promise<void> {
  Loading.show();
  try {
    await signInWithEmailAndPassword(getAuth(), email.value, password.value);
    router.push({name: 'ListInterviews'});
    Notify.create({
      message: 'User logged in',
    })
  } catch (e: unknown) {
    if(e instanceof Error) {
      Notify.create({
        message: e.message,
        color: 'red'
      })
      console.log(e.message);
    }
    console.log(e);
  } finally {
    Loading.hide();
  }
}

async function signUp(): Promise<void> {
  Loading.show();
  try {
    await createUserWithEmailAndPassword(getAuth(), email.value, password.value);
    router.push({name: 'ListInterviews'});
    Notify.create({
      message: 'User created and logged in',
    })
  } catch (e: unknown) {
    if(e instanceof Error) {
      Notify.create({
        message: e.message,
        color: 'red'
      })
      console.log(e.message);
    }
    console.log(e);
  } finally {
    Loading.hide();
  }
}
</script>

<template>
  <q-page class="q-pa-md AddInterviewPage flex justify-center">
    <div class="q-pa-md full-width" style="max-width: 600px">
      <q-form class="q-gutter-md">
        <q-input
          filled
          v-model="companyName"
          label="Company *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          filled
          v-model="vacancyLink"
          label="Vacancy link *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          filled
          v-model="hrName"
          label="HR name *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          filled
          v-model="contactTelegram"
          label="Telegram *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          filled
          v-model="contactPhone"
          label="Phone *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <div>
          <q-btn
            :loading="isLoading"
            :disable="disabledSaveBtn"
            label="Create"
            color="primary"
            type="button"
            @click="onSubmit"
          />
        </div>
      </q-form>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { getAuth } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import type { IInterview } from 'src/interfaces';

defineOptions({
  name: 'IndexPage'
});
const db = getFirestore();

const companyName = ref<string>('')
const vacancyLink = ref<string>('')
const hrName = ref<string>('')
const contactTelegram = ref<string>('')
const contactPhone = ref<string>('')
const isLoading = ref<boolean>(false)

const disabledSaveBtn = computed<boolean>(() => {
  return !(companyName.value && vacancyLink.value && hrName.value && contactTelegram.value && contactPhone.value)
})


const onSubmit = async (): Promise<void> => {
  isLoading.value = true
  const payload: IInterview = {
    id: uuidv4(),
    companyName: companyName.value,
    vacancyLink: vacancyLink.value,
    hrName: hrName.value,
    contactTelegram: contactTelegram.value,
    contactPhone: contactPhone.value,
    createdAt: new Date(),
  }

  const userId = await getAuth().currentUser?.uid;
  if(userId) {
    await setDoc(doc(db, `user/${userId}/interviews`, payload.id), payload)
    companyName.value = ''
    vacancyLink.value = ''
    hrName.value = ''
    contactTelegram.value = ''
    contactPhone.value = ''
    isLoading.value = false
  }
}

</script>
AuthPage

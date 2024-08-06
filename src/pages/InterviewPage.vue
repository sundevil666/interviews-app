<template>
  <q-page class="q-pa-md flex justify-center InterviewPage">
    <div v-if="isLoading">Loading...</div>
    <div
      v-else-if="interview?.id && !isLoading"
      class="q-pa-md full-width"
      style="max-width: 600px"
    >
      <div class="text-h5 q-mb-lg">
        Interview in company <b>{{interview.companyName}}</b>
      </div>
      <q-form class="q-gutter-md">
        <q-input
          filled
          v-model="interview.companyName"
          label="Company *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          filled
          v-model="interview.vacancyLink"
          label="Vacancy link *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          filled
          v-model="interview.hrName"
          label="HR name *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          filled
          v-model="interview.contactTelegram"
          label="Telegram *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <q-input
          filled
          v-model="interview.contactPhone"
          label="Phone *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please type something']"
        />
        <div class="row q-col-gutter-md q-pl-md">
          <q-input
            filled
            v-model="interview.salaryFrom"
            label="Salary From"
            type="number"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
            class="col-6"
          />
          <q-input
            filled
            v-model="interview.salaryTo"
            label="Salary To "
            type="number"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please type something']"
            class="col-6"
          />
        </div>
        <div>
          <q-btn
          label="Add Stage"
          no-caps
          icon="add"
          @click="addStage"
          />
          <q-separator color="blue" class="q-mt-md" />
          <ul
            v-if="interview.stages"
            class="q-mt-md"
          >
            <li
              v-for="(stage, index) in interview.stages"
              :key="stage.name + index"
            >
              <q-input
                v-model="stage.name"
                filled
                label="Name stage"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                class="col-6"
              />
              <div class="col-6">
                <q-input
                  filled
                  v-model="stage.date"
                  mask="date"
                  :rules="['date']"
                  label="Date of passing the stage"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="stage.date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <q-input
                v-model="stage.description"
                filled
                autogrow
                label="Description stage"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Please type something']"
                class="col-6"
              />
              <q-btn
                label="Remove Stage"
                no-caps
                icon="remove"
                color="red"
                type="button"
                @click="removeStage(index)"
              />
              <q-separator color="blue" class="q-mt-md" />
            </li>
          </ul>
        </div>
        <div class="flex items-center">
          <q-toggle
            v-model="interview.offerStatus"
            color="green"
            icon="check"
            label="Offer Status"
            unchecked-icon="clear"
          />
          <div
            class="q-ml-md text-h6"
            :class="statusOffer?.color"
          >
            {{statusOffer?.message}}
          </div>
        </div>
        <div>
          <q-btn
            :loading="isLoading"
            :disable="disabledSaveBtn"
            label="Save"
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
import { computed, ref, onMounted, Ref } from 'vue';
import { useRoute } from 'vue-router';
import { getFirestore, doc, getDoc, updateDoc} from 'firebase/firestore';
import { useUserStore } from 'stores/user';
import type { IInterview, IStage } from 'src/interfaces';

const db = getFirestore();
const userStore = useUserStore();
const route = useRoute();

defineOptions({
  name: 'InterviewPage'
});

const isLoading = ref<boolean>(false);
const interview = ref() as Ref<IInterview>;

const disabledSaveBtn = computed<boolean>(() => {
  return !(interview.value.companyName
    && interview.value.vacancyLink
    && interview.value.hrName
    && interview.value.contactTelegram
    && interview.value.contactPhone)
})

const statusOffer = computed(() => {
  if (interview.value?.offerStatus === undefined) {
    return { color: 'text-grey', message: 'Pending confirmation...' };
  } else if (interview.value?.offerStatus === true) {
    return { color: 'text-green', message: 'Done' };
  } else if (interview.value?.offerStatus === false) {
    return { color: 'text-red', message: 'Reject' };
  } else {
    return { color: 'text-grey', message: 'Unknown status' };
  }
})

const onSubmit = async (): Promise<void> => {
  isLoading.value = true

  await updateDoc(docref, {...interview.value})
  await getData();

  isLoading.value = false
}

const docref = doc(db, `user/${userStore.userId}/interviews`, route.params.id as string);

const getData = async (): Promise<void> => {
  isLoading.value = true;
  const docSnap = await getDoc(docref);
  interview.value = docSnap.data() as IInterview;
  console.log(interview.value);

  isLoading.value = false;
}

const addStage = (): void => {
  if(interview.value) {
    if(!interview.value.stages) {
      interview.value.stages = [];
    }
    const data: IStage = {name: '', date: '', description: ''}
    interview.value.stages.push(data)
  }
}

const removeStage = async (index: number): Promise<void> => {
  const prompt = window.confirm('Are you sure?');
  if(prompt) {
    if(interview.value && interview.value.stages) {
        interview.value.stages.splice(index, 1)
    }
  }
}
onMounted( async () => {
  await getData();
})

</script>

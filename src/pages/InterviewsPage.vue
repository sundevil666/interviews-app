<template>
  <q-page class="q-pa-md InterviewsPage">
    <div v-if="interviews.length === 0" class="text-h6">
      Interviews list is empty. Please <router-link :to="{name: 'AddInterview'}">add</router-link> new one
    </div>
    <div v-else>
      <div class="flex items-center q-mb-md">
        <div class="q-mr-md">Filler:</div>
        <q-radio
          v-model="offerFilter"
          val="All"
          label="All"
          class="q-mr-md"
        />
        <q-radio
          v-model="offerFilter"
          val="Accepted"
          label="Accepted"
          color="green"
          class="q-mr-md"
        />
        <q-radio
          v-model="offerFilter"
          val="Declined"
          label="Declined"
          color="red"
          class="q-mr-md"
        />
        <q-radio
          v-model="offerFilter"
          val="Waiting"
          label="Waiting"
          color="blue"
        />
      </div>
      <q-table
        :rows="interviews"
        :columns="columns"
        row-key="name"
        flat bordered
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td :key="item.name" :props="props" v-for="item in columns">
              <a
                v-if="item.name === 'vacancyLink'"
                :href="`https://${props.row[item.name]}`"
                target="_blank"
              >
                {{props.row[item.name]}}
              </a>

              <router-link
                v-else-if="item.name === 'edit'"
                :to="`/interview/${props.row.id}`"
              >
                {{item.label}}
              </router-link>

              <q-btn
                v-else-if="item.name === 'remove'"
                :label="item.label"
                color="red"
                @click="removeInterview(props.row.id)"
              />

              <q-badge
                v-else-if="item.name === 'offerStatusText' && props.row[item.name] === 'Accepted'"
                :label="props.row[item.name]"
                color="green"
                text-color="white"
              />
              <q-badge
                v-else-if="item.name === 'offerStatusText' && props.row[item.name] === 'Declined'"
                :label="props.row[item.name]"
                color="red"
                text-color="white"
              />
              <q-badge
                v-else-if="item.name === 'offerStatusText' && props.row[item.name] === 'Waiting'"
                :label="props.row[item.name]"
                color="blue"
                text-color="white"
              />

              <span v-else>{{props.row[item.name]}}</span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch } from 'vue';
import { Notify } from 'quasar';
import { getFirestore, deleteDoc, doc } from 'firebase/firestore';
import { useUserStore } from 'stores/user';
import type { IColumnName } from 'src/interfaces';
import { useInterviews } from 'src/api/useInterviews';

defineOptions({
  name: 'InterviewsPage'
});
const userStore = useUserStore();
const { userId } = userStore;

const { interviews, isLoading, fetchInterviews } = useInterviews();

const db = getFirestore();
const offerFilter = ref<string>('All');

const columns: Array<IColumnName> = ([
  {
    name: 'companyName',
    label: 'Company Name',
    field: 'companyName',
  },
  {
    name: 'contactPhone',
    label: 'Contact phone',
    field: 'contactPhone',
  },
  {
    name: 'contactTelegram',
    label: 'Contact telegram',
    field: 'contactTelegram',
  },
  {
    name: 'hrName',
    label: 'HR name',
    field: 'hrName',
  },
  {
    name: 'vacancyLink',
    label: 'Vacancy link',
    field: 'vacancyLink',
  },
  {
    name: 'salaryRange',
    label: 'Salary Range',
    field: 'salaryRange',
    align: 'left'
  },
  {
    name: 'offerStatusText',
    label: 'Offer',
    field: 'offerStatusText',
    align: 'left'
  },
  {
    name: 'edit',
    label: 'Edit',
    align: 'left',
  },
  {
    name: 'remove',
    label: 'Remove',
    align: 'left',
  },
] as IColumnName[]);


const removeInterview = async (id: string): Promise<void> => {
  const prompt = window.confirm('Are you sure?');
  if(prompt) {
    await deleteDoc(doc(db, `user/${userId}/interviews`, id))
    await fetchInterviews();

    Notify.create({
      message: 'Interview removed',
    })
  }
}

watch(offerFilter, async () => {
  await fetchInterviews();

  interviews.value = interviews.value .filter(item => {
    if(offerFilter.value === 'All') {
      return item
    } else {
     return  item.offerStatusText === offerFilter.value
    }
  });
})

onBeforeMount(async () => {
  await fetchInterviews();

  isLoading.value = false
})
</script>

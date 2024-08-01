<template>
  <q-page class="q-pa-md InterviewsPage">
    <div v-if="interviews.length === 0" class="text-h6">
      Interviews list is empty. Please <router-link :to="{name: 'AddInterview'}">add</router-link> new one
    </div>
    <div v-else>
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

              <span v-else>{{props.row[item.name]}}</span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import { Notify } from 'quasar';
import { getFirestore, collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useUserStore } from 'stores/user';
import type { IInterview, IColumnName } from 'src/interfaces';

defineOptions({
  name: 'InterviewsPage'
});
const userStore = useUserStore();
const { userId } = userStore;

const db = getFirestore();
const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(true)

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
    name: 'createdAt',
    label: 'Created at',
    field: 'createdAt',
    align: 'left',
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

const getAllInterviews = async <T extends IInterview>(): Promise<T[]> => {
  const q = query(
    collection(db, `user/${userId}/interviews`),
    orderBy('createdAt', 'desc'));

  const listDocs = await getDocs(q);

  return listDocs.docs.map(doc => doc.data() as T)
}

const removeInterview = async (id: string): Promise<void> => {
  const prompt = window.confirm('Are you sure?');
  if(prompt) {
    await deleteDoc(doc(db, `user/${userId}/interviews`, id))
    const listInterviews: Array<IInterview> = await getAllInterviews();
    interviews.value = [...listInterviews];
    Notify.create({
      message: 'Interview removed',
    })
  }

}

onBeforeMount(async () => {
  const listInterviews: Array<IInterview> = await getAllInterviews();
  interviews.value = [...listInterviews];
  isLoading.value = false
})
</script>

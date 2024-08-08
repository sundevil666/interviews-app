<template>
  <q-page class="q-pa-md">
    <h1>Statistics</h1>
    <div v-if="isLoading">Loading...</div>
    <Responsive
      v-if="interviews.length > 0"
      class="full-width"
    >
      <template #main="{ width }">
        <Chart
          direction="circular"
          :size="{ width, height: 400 }"
          :data="data"
          :margin="{
          left: Math.round((width - 360)/2),
          top: 20,
          right: 0,
          bottom: 20
        }"
          :config="{ controlHover: false }"
        >
          <template #layers>
            <Pie
              :dataKeys="['status', 'count']"
              :pie-style="{ innerRadius: 100, padAngle: 0.05 }"
            />
          </template>
          <template #widgets>
            <Tooltip
              :config="{
              status: { label: 'Interviews' },
              count: { },
            }"
              hideLine
            />
          </template>
        </Chart>
      </template>
    </Responsive>
    <ul>
      <li
      v-for="item in data"
      :key="item.status">
        {{item.status}}: {{item.count}}
      </li>
    </ul>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { Chart, Responsive, Pie, Tooltip } from 'vue3-charts'
import { useInterviews } from 'src/api/useInterviews';
import { IOfferFilter, IStatusCount, IInterview } from 'src/interfaces';


defineOptions({
  name: 'StatisticsPage'
});


const { interviews, isLoading, fetchInterviews } = useInterviews();

const calculateStatusCounts = (interviews: IInterview[]): IStatusCount[] => {
  const counts: Record<IOfferFilter, number> = {
    Waiting: 0,
    Accepted: 0,
    Declined: 0,
  };

  interviews.forEach(interview => {
    const status = interview.offerStatusText;

    if (status && status in counts) {
      counts[status]++;
    }
  });

  const result: IStatusCount[] = Object.keys(counts).map(key => ({
    status: key as IOfferFilter,
    count: counts[key as IOfferFilter]
  }));

  return result;
};

const getStatusCounts = async (): Promise<IStatusCount[]> => {
  try {
    await fetchInterviews()
    return calculateStatusCounts(interviews.value);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return [];
  }
};

const data = ref<IStatusCount[]>([]);

onBeforeMount(async () => {
  data.value = await getStatusCounts()
})

</script>

<style>
.axis {
  display: none;
}
</style>

import { ref, onMounted } from 'vue';
import type { IInterview } from 'src/interfaces';
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import { useUserStore } from 'stores/user';

const userStore = useUserStore();

const db = getFirestore();
const { userId } = userStore;

export const getAllInterviews = async <T extends IInterview>(): Promise<T[]> => {
  const q = query(
    collection(db, `user/${userId}/interviews`),
    orderBy('createdAt', 'desc'));

  const listDocs = await getDocs(q);

  const list = listDocs.docs.map(doc => doc.data() as T)

  list.forEach((interview: IInterview) => {
    if(interview.salaryFrom && interview.salaryTo) {
      interview.salaryRange = `${interview.salaryFrom} - ${interview.salaryTo}`
    } else {
      interview.salaryRange = '0 - 0'
    }

    interview.offerStatusText = interview.offerStatus === undefined ? 'Waiting' : interview.offerStatus ? 'Accepted' : 'Declined';
  })

  return list
}

export const useInterviews = () => {
  const interviews = ref<IInterview[]>([]);
  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  const fetchInterviews = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const data = await getAllInterviews<IInterview>();
      interviews.value = data;
    } catch (err) {
      error.value = err as Error;
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchInterviews);

  return {
    interviews,
    isLoading,
    error,
    fetchInterviews,
  };
};

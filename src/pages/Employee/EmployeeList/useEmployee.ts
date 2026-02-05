import { firestore } from '../../../lib/firebase';
import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { query, collection } from 'firebase/firestore';
import { EmployeeModel } from '../../../models';
import { useUser } from '../../../store/useUser'; // hook lấy userRole

export function useEmployee() {
  const { user } = useUser(); // lấy role hiện tại của user
  const userRole = user?.permission || null;

  const ref = query(collection(firestore, 'employee'));
  const queryEmployee = useFirestoreQuery(['employee'], ref);

  const snapshot = queryEmployee.data;
  let data: any[] = [];

  snapshot?.forEach((docSnapshot) => {
    data.push({ id: docSnapshot.id, ...docSnapshot.data() });
  });

  // Lọc dữ liệu theo role
  if (userRole !== 'admin') {
    data = data.filter(emp => emp.permission !== 'admin');
  }

  const refetchTeam = async () => {
    try {
      await queryEmployee.refetch();
    } catch (error) {
      console.error('Error refetching team data:', error);
    }
  };

  return {
    isError: queryEmployee.isError,
    isLoading: queryEmployee.isLoading,
    data: data as EmployeeModel[],
    refetchTeam
  };
}

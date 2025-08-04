import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  Staff, 
  Shift, 
  Activity, 
  UseStaffReturn, 
  UseShiftsReturn, 
  UseActivityFeedReturn 
} from '../types';

// Real-time staff data
export function useStaff(departmentId: string | null = null): UseStaffReturn {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let q = collection(db, 'staff');
    
    if (departmentId) {
      q = query(q, where('departmentId', '==', departmentId));
    }
    
    q = query(q, where('isActive', '==', true), orderBy('name'));

    const unsubscribe = onSnapshot(q, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        const staffData: Staff[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Staff));
        setStaff(staffData);
        setLoading(false);
      },
      (err: Error) => {
        console.error('Error fetching staff:', err);
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [departmentId]);

  return { staff, loading, error };
}

// Real-time shifts data
export function useShifts(
  departmentId: string | null = null, 
  startDate: Timestamp | null = null, 
  endDate: Timestamp | null = null
): UseShiftsReturn {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let q = collection(db, 'shifts');
    
    const constraints = [];
    if (departmentId) {
      constraints.push(where('departmentId', '==', departmentId));
    }
    if (startDate) {
      constraints.push(where('startTime', '>=', startDate));
    }
    if (endDate) {
      constraints.push(where('startTime', '<=', endDate));
    }
    
    if (constraints.length > 0) {
      q = query(q, ...constraints, orderBy('startTime'));
    } else {
      q = query(q, orderBy('startTime'));
    }

    const unsubscribe = onSnapshot(q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const shiftsData: Shift[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Shift));
        setShifts(shiftsData);
        setLoading(false);
      },
      (err: Error) => {
        console.error('Error fetching shifts:', err);
        setError(err);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [departmentId, startDate, endDate]);

  return { shifts, loading, error };
}

// Real-time activity feed
export function useActivityFeed(limitCount: number = 10): UseActivityFeedReturn {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const q = query(
      collection(db, 'activity'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      const activityData: Activity[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Activity));
      setActivities(activityData);
      setLoading(false);
    });

    return unsubscribe;
  }, [limitCount]);

  return { activities, loading };
}

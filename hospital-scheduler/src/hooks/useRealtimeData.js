import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Real-time staff data
export function useStaff(departmentId = null) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q = collection(db, 'staff');
    
    if (departmentId) {
      q = query(q, where('departmentId', '==', departmentId));
    }
    
    q = query(q, where('isActive', '==', true), orderBy('name'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const staffData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStaff(staffData);
        setLoading(false);
      },
      (err) => {
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
export function useShifts(departmentId = null, startDate = null, endDate = null) {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      (snapshot) => {
        const shiftsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setShifts(shiftsData);
        setLoading(false);
      },
      (err) => {
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
export function useActivityFeed(limit_count = 10) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'activity'),
      orderBy('createdAt', 'desc'),
      limit(limit_count)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activityData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActivities(activityData);
      setLoading(false);
    });

    return unsubscribe;
  }, [limit_count]);

  return { activities, loading };
}

import { useState, useEffect } from 'react';
import MockDataService from '../services/mockDataService';

// Environment flag to toggle between mock and real data
const USE_MOCK_DATA = process.env.NODE_ENV === 'development' || process.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Custom hook for using mock data in development
 * This makes it easy to switch between mock and real data
 */

export const useMockStaff = () => {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      MockDataService.getStaff()
        .then(data => {
          setStaff(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      // Use real Firebase data here
      setLoading(false);
    }
  }, []);

  const addStaff = async (staffData: any) => {
    if (USE_MOCK_DATA) {
      try {
        const newStaff = await MockDataService.addStaff(staffData);
        setStaff(prev => [...prev, newStaff]);
        return newStaff;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    }
    // Add real Firebase logic here
  };

  const updateStaff = async (id: string, updates: any) => {
    if (USE_MOCK_DATA) {
      try {
        const updatedStaff = await MockDataService.updateStaff(id, updates);
        setStaff(prev => prev.map(s => s.id === id ? updatedStaff : s));
        return updatedStaff;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    }
    // Add real Firebase logic here
  };

  const deleteStaff = async (id: string) => {
    if (USE_MOCK_DATA) {
      try {
        await MockDataService.deleteStaff(id);
        setStaff(prev => prev.map(s => s.id === id ? { ...s, isActive: false } : s));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    }
    // Add real Firebase logic here
  };

  return {
    staff,
    loading,
    error,
    addStaff,
    updateStaff,
    deleteStaff,
    refetch: () => {
      if (USE_MOCK_DATA) {
        setLoading(true);
        MockDataService.getStaff().then(data => {
          setStaff(data);
          setLoading(false);
        });
      }
    }
  };
};

export const useMockShifts = () => {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      MockDataService.getShifts()
        .then(data => {
          setShifts(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const addShift = async (shiftData: any) => {
    if (USE_MOCK_DATA) {
      try {
        const newShift = await MockDataService.addShift(shiftData);
        setShifts(prev => [...prev, newShift]);
        return newShift;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    }
  };

  const updateShift = async (id: string, updates: any) => {
    if (USE_MOCK_DATA) {
      try {
        const updatedShift = await MockDataService.updateShift(id, updates);
        setShifts(prev => prev.map(s => s.id === id ? updatedShift : s));
        return updatedShift;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    }
  };

  const assignStaffToShift = async (shiftId: string, staffId: string) => {
    if (USE_MOCK_DATA) {
      try {
        const updatedShift = await MockDataService.assignStaffToShift(shiftId, staffId);
        setShifts(prev => prev.map(s => s.id === shiftId ? updatedShift : s));
        return updatedShift;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    }
  };

  const deleteShift = async (id: string) => {
    if (USE_MOCK_DATA) {
      try {
        await MockDataService.deleteShift(id);
        setShifts(prev => prev.filter(s => s.id !== id));
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    }
    // Add real Firebase logic here
  };

  return {
    shifts,
    loading,
    error,
    addShift,
    updateShift,
    assignStaffToShift,
    deleteShift,
    refetch: () => {
      if (USE_MOCK_DATA) {
        setLoading(true);
        MockDataService.getShifts().then(data => {
          setShifts(data);
          setLoading(false);
        });
      }
    }
  };
};

export const useMockRequests = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      MockDataService.getRequests()
        .then(data => {
          setRequests(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const addRequest = async (requestData: any) => {
    if (USE_MOCK_DATA) {
      try {
        const newRequest = await MockDataService.addRequest(requestData);
        setRequests(prev => [...prev, newRequest]);
        return newRequest;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    }
  };

  const approveRequest = async (id: string, managerId: string, notes?: string) => {
    if (USE_MOCK_DATA) {
      try {
        const updatedRequest = await MockDataService.approveRequest(id, managerId, notes);
        setRequests(prev => prev.map(r => r.id === id ? updatedRequest : r));
        return updatedRequest;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    }
  };

  const rejectRequest = async (id: string, managerId: string, notes: string) => {
    if (USE_MOCK_DATA) {
      try {
        const updatedRequest = await MockDataService.rejectRequest(id, managerId, notes);
        setRequests(prev => prev.map(r => r.id === id ? updatedRequest : r));
        return updatedRequest;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    }
  };

  return {
    requests,
    loading,
    error,
    addRequest,
    approveRequest,
    rejectRequest,
    refetch: () => {
      if (USE_MOCK_DATA) {
        setLoading(true);
        MockDataService.getRequests().then(data => {
          setRequests(data);
          setLoading(false);
        });
      }
    }
  };
};

export const useMockActivity = () => {
  const [activity, setActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      MockDataService.getActivityFeed()
        .then(data => {
          setActivity(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const addActivity = async (activityData: any) => {
    if (USE_MOCK_DATA) {
      try {
        const newActivity = await MockDataService.addActivity(activityData);
        setActivity(prev => [newActivity, ...prev]);
        return newActivity;
      } catch (err: any) {
        setError(err.message);
        throw err;
      }
    }
  };

  return {
    activity,
    loading,
    error,
    addActivity,
    refetch: () => {
      if (USE_MOCK_DATA) {
        setLoading(true);
        MockDataService.getActivityFeed().then(data => {
          setActivity(data);
          setLoading(false);
        });
      }
    }
  };
};

export const useMockStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA) {
      MockDataService.getUpdatedStats()
        .then(data => {
          setStats(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const refreshStats = async () => {
    if (USE_MOCK_DATA) {
      setLoading(true);
      try {
        const data = await MockDataService.getUpdatedStats();
        setStats(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  return {
    stats,
    loading,
    error,
    refreshStats
  };
};

export default {
  useMockStaff,
  useMockShifts,
  useMockRequests,
  useMockActivity,
  useMockStats
};

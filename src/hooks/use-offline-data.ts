'use client';

import { useState, useEffect } from 'react';

interface CachedData {
  data: any;
  timestamp: number;
  expiry?: number;
}

export function useOfflineData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    cacheTime?: number; // Cache time in milliseconds
    staleTime?: number; // Stale time in milliseconds
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const { cacheTime = 5 * 60 * 1000, staleTime = 60 * 1000 } = options;

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getCachedData = (): CachedData | null => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        const parsedCache: CachedData = JSON.parse(cached);
        const now = Date.now();
        
        // Check if cache has expired
        if (parsedCache.expiry && now > parsedCache.expiry) {
          localStorage.removeItem(`cache_${key}`);
          return null;
        }
        
        return parsedCache;
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  };

  const setCachedData = (data: T) => {
    try {
      const cached: CachedData = {
        data,
        timestamp: Date.now(),
        expiry: Date.now() + cacheTime,
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(cached));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };

  const fetchData = async (useCache = true) => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to get cached data first if offline or cache is still valid
      if (useCache) {
        const cached = getCachedData();
        if (cached) {
          const isStale = Date.now() - cached.timestamp > staleTime;
          
          // If offline, always use cache if available
          if (isOffline) {
            setData(cached.data);
            setIsLoading(false);
            return cached.data;
          }
          
          // If online but data is not stale, use cache
          if (!isStale) {
            setData(cached.data);
            setIsLoading(false);
            return cached.data;
          }
        }
      }

      // If online, fetch fresh data
      if (!isOffline) {
        const freshData = await fetchFn();
        setData(freshData);
        setCachedData(freshData);
        setIsLoading(false);
        return freshData;
      } else {
        // If offline and no cache, throw error
        throw new Error('No cached data available while offline');
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      
      // Try to use cached data as fallback
      const cached = getCachedData();
      if (cached) {
        setData(cached.data);
      }
      
      setIsLoading(false);
      throw error;
    }
  };

  const refetch = () => fetchData(false);

  const clearCache = () => {
    localStorage.removeItem(`cache_${key}`);
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [key]);

  // Refetch when coming back online
  useEffect(() => {
    if (!isOffline && data) {
      const cached = getCachedData();
      if (cached && Date.now() - cached.timestamp > staleTime) {
        fetchData(false);
      }
    }
  }, [isOffline]);

  return {
    data,
    isLoading,
    error,
    isOffline,
    refetch,
    clearCache,
  };
}

export function useOfflineQueue() {
  const [queue, setQueue] = useState<Array<{ id: string; action: () => Promise<void>; data: any }>>([]);

  useEffect(() => {
    // Load queue from localStorage on mount
    const savedQueue = localStorage.getItem('offline_queue');
    if (savedQueue) {
      try {
        setQueue(JSON.parse(savedQueue));
      } catch (error) {
        console.error('Error loading offline queue:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save queue to localStorage whenever it changes
    localStorage.setItem('offline_queue', JSON.stringify(queue));
  }, [queue]);

  const addToQueue = (id: string, action: () => Promise<void>, data: any) => {
    setQueue(prev => [...prev, { id, action, data }]);
  };

  const processQueue = async () => {
    if (navigator.onLine && queue.length > 0) {
      const currentQueue = [...queue];
      setQueue([]); // Clear queue immediately to prevent duplicate processing

      for (const item of currentQueue) {
        try {
          await item.action();
          console.log(`Processed queued action: ${item.id}`);
        } catch (error) {
          console.error(`Failed to process queued action ${item.id}:`, error);
          // Re-add failed items to queue
          setQueue(prev => [...prev, item]);
        }
      }
    }
  };

  const clearQueue = () => {
    setQueue([]);
    localStorage.removeItem('offline_queue');
  };

  // Process queue when coming back online
  useEffect(() => {
    const handleOnline = () => {
      processQueue();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [queue]);

  return {
    queue,
    addToQueue,
    processQueue,
    clearQueue,
  };
}

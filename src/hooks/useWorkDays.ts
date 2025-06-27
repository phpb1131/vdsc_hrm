"use client";

import { useState, useEffect, useCallback } from "react";
import {
  WorkDays,
  WorkDaysCreateRequest,
  WorkDaysUpdateRequest,
} from "../types/workDays";
import { workDaysService } from "../services/workDaysService";

interface UseWorkDaysOptions {
  autoLoad?: boolean;
}

interface UseWorkDaysReturn {
  workDays: WorkDays[];
  loading: boolean;
  error: string | null;
  statistics: {
    totalEmployees: number;
    averageWorkDaysPerMonth: number;
    highestWorkDaysPerYear: number;
    lowestWorkDaysPerYear: number;
  };
  loadWorkDays: () => Promise<void>;
  createWorkDays: (data: WorkDaysCreateRequest) => Promise<void>;
  updateWorkDays: (id: number, data: WorkDaysUpdateRequest) => Promise<void>;
  deleteWorkDays: (id: number) => Promise<void>;
  getWorkDaysById: (id: number) => Promise<WorkDays | null>;
  refreshWorkDays: () => Promise<void>;
  clearError: () => void;
}

export function useWorkDays(
  options: UseWorkDaysOptions = {}
): UseWorkDaysReturn {
  // Chỉ sử dụng API thật
  const { autoLoad = true } = options;

  const [workDays, setWorkDays] = useState<WorkDays[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate statistics
  const statistics = {
    totalEmployees: workDays.length,
    averageWorkDaysPerMonth:
      workDays.length > 0
        ? Math.round(
            workDays.reduce(
              (total, item) =>
                total +
                (item.january +
                  item.february +
                  item.march +
                  item.april +
                  item.may +
                  item.june +
                  item.july +
                  item.august +
                  item.september +
                  item.october +
                  item.november +
                  item.december),
              0
            ) /
              (workDays.length * 12)
          )
        : 0,
    highestWorkDaysPerYear:
      workDays.length > 0
        ? Math.max(
            ...workDays.map(
              (item) =>
                item.january +
                item.february +
                item.march +
                item.april +
                item.may +
                item.june +
                item.july +
                item.august +
                item.september +
                item.october +
                item.november +
                item.december
            )
          )
        : 0,
    lowestWorkDaysPerYear:
      workDays.length > 0
        ? Math.min(
            ...workDays.map(
              (item) =>
                item.january +
                item.february +
                item.march +
                item.april +
                item.may +
                item.june +
                item.july +
                item.august +
                item.september +
                item.october +
                item.november +
                item.december
            )
          )
        : 0,
  };

  // Chỉ sử dụng service thật
  const service = workDaysService;

  const loadWorkDays = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await service.getAllWorkDays();
      setWorkDays(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load work days");
      console.error("Error loading work days:", err);
    } finally {
      setLoading(false);
    }
  }, [service]);

  const createWorkDays = useCallback(
    async (data: WorkDaysCreateRequest) => {
      try {
        setLoading(true);
        setError(null);
        await service.createWorkDays(data);
        await loadWorkDays(); // Refresh the list
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create work days"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, loadWorkDays]
  );

  const updateWorkDays = useCallback(
    async (id: number, data: WorkDaysUpdateRequest) => {
      try {
        setLoading(true);
        setError(null);
        await service.updateWorkDays(id, data);
        await loadWorkDays(); // Refresh the list
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update work days"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, loadWorkDays]
  );

  const deleteWorkDays = useCallback(
    async (id: number) => {
      try {
        setLoading(true);
        setError(null);
        await service.deleteWorkDays(id);
        await loadWorkDays(); // Refresh the list
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete work days"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [service, loadWorkDays]
  );

  const getWorkDaysById = useCallback(
    async (id: number): Promise<WorkDays | null> => {
      try {
        setError(null);
        return await service.getWorkDaysById(id);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to get work days"
        );
        console.error("Error getting work days by id:", err);
        return null;
      }
    },
    [service]
  );

  const refreshWorkDays = useCallback(async () => {
    await loadWorkDays();
  }, [loadWorkDays]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto load on mount
  useEffect(() => {
    if (autoLoad) {
      loadWorkDays();
    }
  }, [autoLoad, loadWorkDays]);

  return {
    workDays,
    loading,
    error,
    statistics,
    loadWorkDays,
    createWorkDays,
    updateWorkDays,
    deleteWorkDays,
    getWorkDaysById,
    refreshWorkDays,
    clearError,
  };
}

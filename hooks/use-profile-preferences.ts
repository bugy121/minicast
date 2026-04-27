import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { fetchProfileRow, upsertProfileRow } from '@/lib/profile-supabase';
import { useAuth } from '@/providers/auth-provider';
import {
  type ProfilePreferences,
  defaultProfilePreferences,
} from '@/types/profile-preferences';

const STORAGE_KEY = 'minicast_profile_preferences_v1';

function mergeWithDefaults(partial: Partial<ProfilePreferences> | null): ProfilePreferences {
  if (!partial) {
    return { ...defaultProfilePreferences };
  }
  return {
    ...defaultProfilePreferences,
    ...partial,
    socialLinked: { ...defaultProfilePreferences.socialLinked, ...partial.socialLinked },
  };
}

export function useProfilePreferences() {
  const { session } = useAuth();
  const userId = session?.user.id ?? null;

  const [preferences, setPreferences] = useState<ProfilePreferences>(defaultProfilePreferences);
  const [isReady, setIsReady] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsReady(false);
      setSyncError(null);

      const localRaw = await AsyncStorage.getItem(STORAGE_KEY);
      const fromLocal = mergeWithDefaults(
        localRaw ? (JSON.parse(localRaw) as Partial<ProfilePreferences>) : null
      );

      if (!userId) {
        if (!cancelled) {
          setPreferences(fromLocal);
          setIsReady(true);
        }
        return;
      }

      const remote = await fetchProfileRow(userId);
      if (cancelled) {
        return;
      }

      if (remote) {
        setPreferences(remote);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remote));
        setIsReady(true);
        return;
      }

      setPreferences(fromLocal);
      const { error } = await upsertProfileRow(userId, fromLocal);
      if (error && !cancelled) {
        setSyncError(error.message);
      }
      if (!cancelled) {
        setIsReady(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const update = useCallback(
    (next: Partial<ProfilePreferences>) => {
      setSyncError(null);
      setPreferences((prev) => {
        const merged: ProfilePreferences = {
          ...prev,
          ...next,
          socialLinked: { ...prev.socialLinked, ...(next.socialLinked ?? {}) },
        };
        void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        if (userId) {
          void upsertProfileRow(userId, merged).then(({ error }) => {
            if (error) {
              setSyncError(error.message);
            }
          });
        }
        return merged;
      });
    },
    [userId]
  );

  return { preferences, update, isReady, syncError };
}

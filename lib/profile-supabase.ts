import { supabase } from '@/lib/supabase';
import {
  type EpisodeLengthMinutes,
  type NotificationScheduleId,
  type PodcastFrequencyId,
  type ProfilePreferences,
  defaultProfilePreferences,
} from '@/types/profile-preferences';

export type ProfileRow = {
  id: string;
  notification_schedule: string;
  custom_notification_time: string;
  podcast_frequency: string;
  episode_length_minutes: number;
  social_x: boolean;
  social_instagram: boolean;
  social_youtube: boolean;
  social_linkedin: boolean;
};

const NOTIFICATION: NotificationScheduleId[] = [
  'early_morning',
  'midday',
  'late_afternoon',
  'evening',
  'custom',
];
const FREQUENCY: PodcastFrequencyId[] = ['daily', 'three_per_week', 'weekly', 'biweekly'];
const LENGTHS: EpisodeLengthMinutes[] = [5, 10, 15, 20, 30];

function isNotificationScheduleId(v: string): v is NotificationScheduleId {
  return (NOTIFICATION as string[]).includes(v);
}
function isPodcastFrequencyId(v: string): v is PodcastFrequencyId {
  return (FREQUENCY as string[]).includes(v);
}
function asEpisodeLengthMinutes(n: number): EpisodeLengthMinutes {
  return (LENGTHS as number[]).includes(n) ? (n as EpisodeLengthMinutes) : 15;
}

export function profileRowToPreferences(row: ProfileRow): ProfilePreferences {
  return {
    notificationSchedule: isNotificationScheduleId(row.notification_schedule)
      ? row.notification_schedule
      : defaultProfilePreferences.notificationSchedule,
    customNotificationTime: row.custom_notification_time || defaultProfilePreferences.customNotificationTime,
    podcastFrequency: isPodcastFrequencyId(row.podcast_frequency)
      ? row.podcast_frequency
      : defaultProfilePreferences.podcastFrequency,
    episodeLengthMinutes: asEpisodeLengthMinutes(row.episode_length_minutes),
    socialLinked: {
      x: row.social_x,
      instagram: row.social_instagram,
      youtube: row.social_youtube,
      linkedin: row.social_linkedin,
    },
  };
}

export function preferencesToUpsert(
  userId: string,
  preferences: ProfilePreferences
): ProfileRow {
  return {
    id: userId,
    notification_schedule: preferences.notificationSchedule,
    custom_notification_time: preferences.customNotificationTime,
    podcast_frequency: preferences.podcastFrequency,
    episode_length_minutes: preferences.episodeLengthMinutes,
    social_x: preferences.socialLinked.x,
    social_instagram: preferences.socialLinked.instagram,
    social_youtube: preferences.socialLinked.youtube,
    social_linkedin: preferences.socialLinked.linkedin,
  };
}

export async function fetchProfileRow(userId: string): Promise<ProfilePreferences | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id, notification_schedule, custom_notification_time, podcast_frequency, episode_length_minutes, social_x, social_instagram, social_youtube, social_linkedin'
    )
    .eq('id', userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }
  return profileRowToPreferences(data as ProfileRow);
}

export async function upsertProfileRow(userId: string, preferences: ProfilePreferences) {
  const row = preferencesToUpsert(userId, preferences);
  return supabase.from('profiles').upsert(row, { onConflict: 'id' });
}

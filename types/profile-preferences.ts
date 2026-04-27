/**
 * App shape for profile settings. When signed in, these values are read/written to
 * Supabase `public.profiles` (see `supabase/migrations/…_profiles.sql`) and cached in AsyncStorage.
 */

export type NotificationScheduleId =
  | 'early_morning'
  | 'midday'
  | 'late_afternoon'
  | 'evening'
  | 'custom';

export type SocialProviderId = 'x' | 'instagram' | 'youtube' | 'linkedin';

export type PodcastFrequencyId = 'daily' | 'three_per_week' | 'weekly' | 'biweekly';

export type EpisodeLengthMinutes = 5 | 10 | 15 | 20 | 30;

export type ProfilePreferences = {
  notificationSchedule: NotificationScheduleId;
  /** Local time in HH:mm (24h), only used when notificationSchedule is `custom` */
  customNotificationTime: string;
  socialLinked: Record<SocialProviderId, boolean>;
  podcastFrequency: PodcastFrequencyId;
  episodeLengthMinutes: EpisodeLengthMinutes;
};

export const defaultProfilePreferences: ProfilePreferences = {
  notificationSchedule: 'early_morning',
  customNotificationTime: '07:00',
  socialLinked: {
    x: false,
    instagram: false,
    youtube: false,
    linkedin: false,
  },
  podcastFrequency: 'weekly',
  episodeLengthMinutes: 15,
};

import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/providers/auth-provider';
import { useProfilePreferences } from '@/hooks/use-profile-preferences';
import type {
  EpisodeLengthMinutes,
  NotificationScheduleId,
  PodcastFrequencyId,
  SocialProviderId,
} from '@/types/profile-preferences';

const C = {
  bg: '#000000',
  surface: '#0D0D0D',
  border: '#1F1F1F',
  text: '#FFFFFF',
  muted: '#B0B0B0',
  blue: '#1E63FF',
  gold: '#E7C067',
  danger: '#C94C4C',
};

const NOTIFICATION_OPTIONS: { id: NotificationScheduleId; label: string; hint: string }[] = [
  { id: 'early_morning', label: 'Early morning', hint: '≈ 7:00' },
  { id: 'midday', label: 'Midday', hint: '≈ 12:00' },
  { id: 'late_afternoon', label: 'Late afternoon', hint: '≈ 16:00' },
  { id: 'evening', label: 'Evening', hint: '≈ 20:00' },
  { id: 'custom', label: 'Custom', hint: 'Pick a time' },
];

const FREQUENCY_OPTIONS: { id: PodcastFrequencyId; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'three_per_week', label: '3× per week' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'biweekly', label: 'Every 2 weeks' },
];

const LENGTH_OPTIONS: EpisodeLengthMinutes[] = [5, 10, 15, 20, 30];

const SOCIAL: { id: SocialProviderId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'x', label: 'X (Twitter)', icon: 'logo-twitter' },
  { id: 'instagram', label: 'Instagram', icon: 'logo-instagram' },
  { id: 'youtube', label: 'YouTube', icon: 'logo-youtube' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'logo-linkedin' },
];

export default function ProfileScreen() {
  const { deleteAccount, session, signOut } = useAuth();
  const { isReady, preferences, syncError, update } = useProfilePreferences();
  const [isDeleting, setIsDeleting] = useState(false);

  const onToggleSocial = useCallback(
    (id: SocialProviderId) => {
      void update({
        socialLinked: { ...preferences.socialLinked, [id]: !preferences.socialLinked[id] },
      });
    },
    [preferences.socialLinked, update]
  );

  const confirmDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete account',
      'This will permanently remove your account and sign you out. This cannot be undone.',
      [
        { style: 'cancel', text: 'Cancel' },
        {
          style: 'destructive',
          text: 'Delete',
          onPress: () => {
            void (async () => {
              setIsDeleting(true);
              const { error } = await deleteAccount();
              setIsDeleting(false);
              if (error) {
                Alert.alert('Could not delete account', error);
              }
            })();
          },
        },
      ]
    );
  }, [deleteAccount]);

  if (!isReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={C.blue} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>
          {session?.user.email ? session.user.email : 'Signed in'}
        </Text>
        {syncError ? (
          <Text style={styles.syncError}>
            Could not sync settings: {syncError}
          </Text>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>When to notify you</Text>
          <Text style={styles.sectionHint}>We’ll suggest times for your minicasts. Pick what fits you.</Text>
          <View style={styles.chipGrid}>
            {NOTIFICATION_OPTIONS.map((opt) => {
              const selected = preferences.notificationSchedule === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => void update({ notificationSchedule: opt.id })}
                  style={({ pressed }) => [
                    styles.chip,
                    selected && styles.chipSelected,
                    pressed && styles.pressed,
                  ]}>
                  <Text style={[styles.chipTitle, selected && styles.chipTitleSelected]}>
                    {opt.label}
                  </Text>
                  <Text style={styles.chipHint}>{opt.hint}</Text>
                </Pressable>
              );
            })}
          </View>
          {preferences.notificationSchedule === 'custom' ? (
            <View style={styles.customTimeRow}>
              <Text style={styles.inputLabel}>Local time (24h)</Text>
              <TextInput
                placeholder="07:30"
                placeholderTextColor={C.muted}
                style={styles.timeInput}
                value={preferences.customNotificationTime}
                onChangeText={(text) => void update({ customNotificationTime: text })}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How often</Text>
          <View style={styles.rowWrap}>
            {FREQUENCY_OPTIONS.map((opt) => {
              const selected = preferences.podcastFrequency === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => void update({ podcastFrequency: opt.id })}
                  style={({ pressed }) => [styles.pill, selected && styles.pillSelected, pressed && styles.pressed]}>
                  <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{opt.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Episode length</Text>
          <View style={styles.rowWrap}>
            {LENGTH_OPTIONS.map((min) => {
              const selected = preferences.episodeLengthMinutes === min;
              return (
                <Pressable
                  key={min}
                  onPress={() => void update({ episodeLengthMinutes: min })}
                  style={({ pressed }) => [styles.pill, selected && styles.pillSelected, pressed && styles.pressed]}>
                  <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{min} min</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Connected accounts</Text>
          <Text style={styles.sectionHint}>
            Link social profiles so we can reference your public presence (OAuth wiring can be added per provider).
          </Text>
          {SOCIAL.map((item) => {
            const linked = preferences.socialLinked[item.id];
            return (
              <View key={item.id} style={styles.socialRow}>
                <Ionicons color={linked ? C.gold : C.muted} name={item.icon} size={22} />
                <View style={styles.socialText}>
                  <Text style={styles.socialLabel}>{item.label}</Text>
                  <Text style={styles.socialState}>{linked ? 'Connected' : 'Not connected'}</Text>
                </View>
                <Pressable
                  onPress={() => onToggleSocial(item.id)}
                  style={({ pressed }) => [styles.connectBtn, pressed && styles.pressed]}>
                  <Text style={styles.connectBtnText}>{linked ? 'Disconnect' : 'Connect'}</Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={signOut}
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}>
            <Text style={styles.secondaryBtnText}>Sign out</Text>
          </Pressable>

          <Pressable
            disabled={isDeleting}
            onPress={confirmDeleteAccount}
            style={({ pressed }) => [styles.dangerBtn, (pressed || isDeleting) && styles.pressed]}>
            {isDeleting ? (
              <ActivityIndicator color={C.danger} />
            ) : (
              <Text style={styles.dangerText}>Delete account</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: C.bg,
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    backgroundColor: C.bg,
    flex: 1,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: {
    color: C.text,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: C.muted,
    fontSize: 15,
    marginTop: 6,
  },
  syncError: {
    color: C.danger,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
  },
  section: {
    borderColor: C.border,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 20,
    padding: 16,
  },
  sectionLabel: {
    color: C.gold,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  sectionHint: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  chip: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: '30%',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  chipSelected: {
    borderColor: C.blue,
  },
  chipTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '700',
  },
  chipTitleSelected: {
    color: C.blue,
  },
  chipHint: {
    color: C.muted,
    fontSize: 11,
    marginTop: 4,
  },
  customTimeRow: {
    marginTop: 14,
  },
  inputLabel: {
    color: C.muted,
    fontSize: 12,
    marginBottom: 6,
  },
  timeInput: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderRadius: 10,
    borderWidth: 1,
    color: C.text,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  pill: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  pillSelected: {
    backgroundColor: '#101a33',
    borderColor: C.blue,
  },
  pillText: {
    color: C.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: C.text,
  },
  socialRow: {
    alignItems: 'center',
    borderColor: C.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  socialText: {
    flex: 1,
  },
  socialLabel: {
    color: C.text,
    fontSize: 16,
    fontWeight: '600',
  },
  socialState: {
    color: C.muted,
    fontSize: 12,
    marginTop: 2,
  },
  connectBtn: {
    backgroundColor: C.blue,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  connectBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    marginTop: 28,
    rowGap: 12,
  },
  secondaryBtn: {
    alignItems: 'center',
    borderColor: C.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
  },
  secondaryBtnText: {
    color: C.text,
    fontSize: 16,
    fontWeight: '600',
  },
  dangerBtn: {
    alignItems: 'center',
    borderColor: '#4A2020',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
  },
  dangerText: {
    color: C.danger,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
});

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/providers/auth-provider';

export default function HomeScreen() {
  const { session, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>You are signed in as:</Text>
      <Text style={styles.email}>{session?.user.email}</Text>

      <Pressable onPress={signOut} style={styles.button}>
        <Text style={styles.buttonLabel}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#050505',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: '#B8B8B8',
    fontSize: 16,
    marginTop: 14,
  },
  email: {
    color: '#FFF',
    fontSize: 17,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#1E63FF',
    borderRadius: 12,
    marginTop: 28,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  buttonLabel: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

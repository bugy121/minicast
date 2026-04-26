import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAuth } from '@/providers/auth-provider';

export default function SignInScreen() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const submitLabel = isCreatingAccount ? 'Continue with email' : 'Sign in';

  async function onSubmit() {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const action = isCreatingAccount ? signUp : signIn;
    const result = await action(email.trim(), password);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (isCreatingAccount) {
      setSuccessMessage('Account created. If email confirmation is enabled, check your inbox before signing in.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <View style={styles.container}>
          <View style={styles.hero}>
            <Text style={styles.brand}>minicast</Text>
            <Text style={styles.headline}>Your world.</Text>
            <Text style={styles.headline}>Summarized.</Text>
            <Text style={[styles.headline, styles.highlight]}>Personalized.</Text>
            <Text style={styles.subhead}>Minicasts from the people and sources you trust.</Text>
          </View>

          <View style={styles.featureRow}>
            <Feature icon="headset-outline" title="Audio-first" subtitle="Listen anywhere, anytime." />
            <Feature icon="star-outline" title="What matters" subtitle="AI curates what is important to you." />
            <Feature icon="shield-checkmark-outline" title="Source transparent" subtitle="Every update is traceable." />
          </View>

          <View style={styles.form}>
            <TextInput
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="Email"
              placeholderTextColor="#8A8A8A"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              autoCapitalize="none"
              autoComplete="password"
              secureTextEntry
              placeholder="Password"
              placeholderTextColor="#8A8A8A"
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

            <Pressable disabled={isLoading} style={styles.primaryButton} onPress={onSubmit}>
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.primaryButtonLabel}>{submitLabel}</Text>
              )}
            </Pressable>

            <Pressable
              disabled={isLoading}
              onPress={() => setIsCreatingAccount((value) => !value)}
              style={styles.secondaryButton}>
              <Text style={styles.secondaryLabel}>
                {isCreatingAccount ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FeatureProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
};

function Feature({ icon, title, subtitle }: FeatureProps) {
  return (
    <View style={styles.feature}>
      <Ionicons color="#1E63FF" name={icon} size={20} />
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureSubtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: '#000',
    flex: 1,
  },
  flex: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 24,
  },
  hero: {
    marginTop: 12,
  },
  brand: {
    color: '#FFF',
    fontSize: 44,
    fontWeight: '300',
    letterSpacing: 6,
    marginBottom: 20,
    textTransform: 'lowercase',
  },
  headline: {
    color: '#FFF',
    fontSize: 44,
    fontWeight: '800',
    lineHeight: 48,
  },
  highlight: {
    color: '#E7C067',
  },
  subhead: {
    color: '#D0D0D0',
    fontSize: 20,
    lineHeight: 28,
    marginTop: 18,
    maxWidth: '95%',
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  feature: {
    borderColor: '#1F1F1F',
    borderWidth: 1,
    borderRadius: 12,
    flex: 1,
    minHeight: 104,
    padding: 10,
    rowGap: 4,
  },
  featureTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  featureSubtitle: {
    color: '#B0B0B0',
    fontSize: 11,
    lineHeight: 14,
  },
  form: {
    marginTop: 28,
    rowGap: 10,
  },
  input: {
    backgroundColor: '#111',
    borderColor: '#2D2D2D',
    borderRadius: 12,
    borderWidth: 1,
    color: '#FFF',
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  error: {
    color: '#FF7A7A',
    marginTop: 2,
  },
  success: {
    color: '#78D49C',
    marginTop: 2,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#1E63FF',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 52,
    marginTop: 6,
  },
  primaryButtonLabel: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '500',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  secondaryLabel: {
    color: '#A6C2FF',
    fontSize: 15,
  },
});

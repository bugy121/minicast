import { StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.copy}>This tab is ready for additional signed-in app screens.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#050505',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '800',
  },
  copy: {
    color: '#B8B8B8',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
});

import { StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

type LabIcon = 'refresh' | 'send';

const labs = [
  { 
    id: 1, 
    title: 'Simple Harmonic Motion', 
    duration: '45 mins',
    tools: ['Spring Simulator', 'Graph Analyzer', 'Data Logger'],
    description: 'Explore oscillatory motion with interactive spring-mass system simulation',
    icon: 'refresh' as LabIcon,
    gradient: ['#FF6B6B', '#EE5D5D'] as const,
    route: '/shm-lab',
    stats: {
      experiments: 4,
      students: 245,
      rating: 4.8
    }
  },
  { 
    id: 2, 
    title: 'Projectile Motion Lab', 
    duration: '60 mins',
    tools: ['Trajectory Simulator', 'Angle Calculator', 'Vector Visualizer'],
    description: 'Study projectile motion with real-time trajectory visualization and analysis',
    icon: 'send' as LabIcon,
    gradient: ['#4ECDC4', '#45B7AF'] as const,
    route: '/projectile-lab',
    stats: {
      experiments: 5,
      students: 189,
      rating: 4.6
    }
  }
];

export default function VirtualLabScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Virtual Labs</Text>
        <Text style={styles.headerSubtitle}>Interactive Physics Simulations</Text>
      </LinearGradient>

      <View style={styles.labContainer}>
        {labs.map((lab) => (
          <Pressable 
            key={lab.id} 
            style={({ pressed }) => [
              styles.card,
              { opacity: pressed ? 0.9 : 1 }
            ]}
            onPress={() => router.push(lab.route as any)}
          >
            <LinearGradient
              colors={lab.gradient}
              style={styles.iconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <FontAwesome name={lab.icon} size={24} color="#fff" />
            </LinearGradient>

            <Text style={styles.labTitle}>{lab.title}</Text>
            <Text style={styles.description}>{lab.description}</Text>

            <View style={styles.toolsContainer}>
              {lab.tools.map((tool, index) => (
                <View key={index} style={styles.toolBadge}>
                  <FontAwesome name="wrench" size={12} color="#666" />
                  <Text style={styles.toolText}>{tool}</Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{lab.stats.experiments}</Text>
                <Text style={styles.statLabel}>Experiments</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{lab.stats.students}</Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.statNumber}>{lab.stats.rating}</Text>
                  <FontAwesome name="star" size={12} color="#FFD700" />
                </View>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <View style={styles.durationContainer}>
                <FontAwesome name="clock-o" size={14} color="#666" />
                <Text style={styles.durationText}>{lab.duration}</Text>
              </View>
              <LinearGradient
                colors={lab.gradient}
                style={styles.startButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.startButtonText}>Start Lab</Text>
                <FontAwesome name="arrow-right" size={14} color="#fff" />
              </LinearGradient>
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    padding: 25,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  labContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  labTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  toolsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  toolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  toolText: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  durationText: {
    fontSize: 14,
    color: '#666',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
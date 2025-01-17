import { StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const courseIcons = {
  'Fisika Dasar': { icon: 'bolt', gradient: ['#FF6B6B', '#EE5D5D'] },
  'Kimia Dasar': { icon: 'flask', gradient: ['#4ECDC4', '#45B7AF'] },
  'Biologi Umum': { icon: 'leaf', gradient: ['#87D37C', '#72C267'] },
};

export default function CourseScreen() {
  const courses = [
    { 
      id: 1, 
      title: 'Fisika Dasar', 
      modules: 8, 
      description: 'Pembelajaran konsep dasar fisika',
      progress: 65,
      totalTime: '24 jam'
    },
    { 
      id: 2, 
      title: 'Kimia Dasar', 
      modules: 6, 
      description: 'Pengenalan ilmu kimia dasar',
      progress: 40,
      totalTime: '18 jam'
    },
    { 
      id: 3, 
      title: 'Biologi Umum', 
      modules: 7, 
      description: 'Pembelajaran biologi fundamental',
      progress: 25,
      totalTime: '21 jam'
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Courses</Text>
        <Text style={styles.headerSubtitle}>Explore our virtual laboratory courses</Text>
      </LinearGradient>

      <View style={styles.courseContainer}>
        {courses.map((course) => (
          <Pressable 
            key={course.id} 
            style={({ pressed }) => [
              styles.card,
              { opacity: pressed ? 0.9 : 1 }
            ]}
          >
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <LinearGradient
                  colors={courseIcons[course.title].gradient}
                  style={styles.iconContainer}
                >
                  <FontAwesome 
                    name={courseIcons[course.title].icon} 
                    size={24} 
                    color="#000" 
                  />
                </LinearGradient>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.description}>{course.description}</Text>
              </View>

              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <FontAwesome name="book" size={14} color="#666" />
                  <Text style={styles.statText}>{course.modules} Modules</Text>
                </View>
                <View style={styles.statItem}>
                  <FontAwesome name="clock-o" size={14} color="#666" />
                  <Text style={styles.statText}>{course.totalTime}</Text>
                </View>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${course.progress}%`,
                        backgroundColor: courseIcons[course.title].gradient[0] 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{course.progress}%</Text>
              </View>
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
  courseContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    padding: 20,
  },
  leftContent: {
    marginBottom: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
    backgroundColor: 'transparent',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'transparent',
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'transparent',
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 45,
  },
});
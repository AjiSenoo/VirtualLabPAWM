import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { doc, getDoc, DocumentData, limit } from "firebase/firestore";
import { collection, getDocs, query, orderBy } from 'firebase/firestore';  // Add collection and getDocs imports
import { auth, db } from "@/firebase";  // Adjust path if needed
import { useState, useEffect } from "react";


// Mock data for features
const features = [
  {
    icon: 'flask',
    title: 'Virtual Labs',
    description: 'Interactive laboratory simulations for hands-on learning experience',
    color: '#4CAF50'
  },
  {
    icon: 'book',
    title: 'Course Materials',
    description: 'Comprehensive study materials and video lectures',
    color: '#2196F3'
  },
  {
    icon: 'graduation-cap',
    title: 'Quizzes',
    description: 'Test your knowledge with interactive quizzes and assessments',
    color: '#9C27B0'
  },
  {
    icon: 'trophy',
    title: 'Achievements',
    description: 'Earn badges and certificates as you progress',
    color: '#FF9800'
  }
];

interface LeaderboardItem {
    id: string;
    username: string;
    score: number;
  }

export default function DashboardScreen() {
  const [userDoc, setUserData] = useState<DocumentData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);  // Change this line
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data()); // Now it's allowed because useState is aware of the data type
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No user is logged in");
        setLoading(false); // Handle case when no user is logged in
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const leaderboardRef = collection(db, 'users'); // Fetch from 'users' collection
        const leaderboardQuery = query(leaderboardRef, orderBy('score', 'desc'), limit(3)); // Order by score
        const querySnapshot = await getDocs(leaderboardQuery);
        const leaderboardData = querySnapshot.docs.map((doc) => ({
          id: doc.id,  // The document ID is the user UID
          username: doc.data().username, // User's username
          score: doc.data().score, // User's score
        }));
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };
  
    fetchLeaderboardData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;  // You can replace this with a spinner or a more elaborate loader
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{userDoc?.username || 'User'}</Text>
          <View style={styles.userPoints}>
            <FontAwesome name="star" size={20} color="#FFD700" />
            <Text style={styles.pointsText}> {userDoc?.score < 0 ? 0 : userDoc?.score} points </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <LinearGradient
            colors={['#4CAF50', '#388E3C']}
            style={styles.statGradient}
          >
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.statBox}>
          <LinearGradient
            colors={['#2196F3', '#1976D2']}
            style={styles.statGradient}
          >
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </LinearGradient>
        </View>
        
        <View style={styles.statBox}>
          <LinearGradient
            colors={['#9C27B0', '#7B1FA2']}
            style={styles.statGradient}
          >
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Labs</Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.leaderboardContainer}>
        {leaderboard.map((user) => (
          <View key={user.id} style={styles.leaderboardItem}>
          <Text style={styles.leaderboardRank}>{leaderboard.indexOf(user) + 1}</Text> {/* Display rank */}
          <Text style={styles.leaderboardName}>{user.username}</Text>
          <View style={styles.leaderboardPoints}>
            <FontAwesome name="star" size={14} color="#FFD700" />
            <Text style={styles.leaderboardPointsText}>{user?.score < 0 ? 0 : user?.score}</Text>
         </View>
        </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <Pressable 
              key={index}
              style={styles.featureCard}
            >
              <LinearGradient
                colors={[feature.color, feature.color + 'dd']}
                style={styles.featureGradient}
              >
                <FontAwesome name={feature.icon} size={24} color="#fff" />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    backgroundColor: 'transparent',
  },
  welcomeText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  userPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  pointsText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: -30,
  },
  statBox: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a237e',
  },
  leaderboardContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: 'transparent',
  },
  leaderboardRank: {
    fontSize: 18,
    marginRight: 10,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  leaderboardPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  leaderboardPointsText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  featureCard: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  featureGradient: {
    padding: 20,
    height: 160,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 15,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 16,
  },
});
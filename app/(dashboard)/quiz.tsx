import React from 'react';
import { StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, DocumentData } from 'firebase/firestore';
import { auth, db } from "@/firebase";

const { width } = Dimensions.get('window');

const quizzes = [
  { 
    id: 1, 
    title: 'Bahasa Inggris', 
    questions: 5, 
    duration: '10 mins',
    isCompleted: false,
    score: null,
    route: '/english',
    icon: 'language',
    gradient: ['#FF6B6B', '#EE5D5D'] as const,
  },
  { 
    id: 2, 
    title: 'Bahasa Indonesia', 
    questions: 5, 
    duration: '10 mins',
    isCompleted: false,
    score: null,
    route: '/indonesian',
    icon: 'book',
    gradient: ['#4ECDC4', '#45B7AF'] as const,
  },
  { 
    id: 3, 
    title: 'Quiz Biologi Umum', 
    questions: 20, 
    duration: '60 mins',
    isCompleted: false,
    score: null,
    route: '/biology',
    icon: 'leaf',
    gradient: ['#FFA726', '#FB8C00'] as const,
  },
];

export default function QuizScreen() {
  const [quizStatus, setQuizStatus] = useState(quizzes);
  const [userDoc, setUserData] = useState<DocumentData | null>(null);
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
    const fetchQuizStatus = async () => {
      try {
        // Get Firestore instance
        const db = getFirestore();
        
        // Replace 'userUID' with the current authenticated user's UID
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userSnapshot = await getDoc(userRef);
  
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const { EngScore, IndScore } = userData;
  
          setQuizStatus(currentQuizzes =>
            currentQuizzes.map(quiz => {
              if (quiz.id === 1) {
                return {
                  ...quiz,
                  isCompleted: EngScore !== 0,  // Set to true if EngScore is not -1
                  score: EngScore !== 0 ? EngScore : null,
                };
              } else if (quiz.id === 2) {
                return {
                  ...quiz,
                  isCompleted: IndScore !== 0,  // Set to true if IndScore is not -1
                  score: IndScore !== 0 ? IndScore : null,
                };
              }
              return quiz; // For quizzes without specific scores, keep as is
            })
          );
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.error('Error fetching Firestore data:', error);
      }
    };
    fetchQuizStatus();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Available Quizzes</Text>
        <Text style={styles.headerSubtitle}>Test your knowledge</Text>
      </LinearGradient>

      <View style={styles.quizContainer}>
        {quizStatus.map((quiz) => (
            <Pressable
  key={quiz.id}
  style={({ pressed }) => [
    styles.card,
    { opacity: pressed ? 0.9 : 1 }
  ]}
  onPress={() => {
    if (
      (quiz.id === 1 && userDoc?.EngScore === 0) ||
      (quiz.id === 2 && userDoc?.IndScore === 0)
    ) {
      router.push(quiz.route as any);
    }
  }}
  disabled={
    (quiz.id === 1 && userDoc?.EngScore !== 0) ||
    (quiz.id === 2 && userDoc?.IndScore !== 0)
  }
>
  <LinearGradient
    colors={quiz.gradient}
    style={[
      styles.iconContainer,
      {
        opacity: 
          (quiz.id === 1 && userDoc?.EngScore !== 0) || 
          (quiz.id === 2 && userDoc?.IndScore !== 0) 
            ? 0.5 : 1 // Make it appear faded when disabled
      }
    ]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
  >
    <FontAwesome name={quiz.icon} size={24} color="#fff" />
  </LinearGradient>

  <Text style={styles.quizTitle}>{quiz.title}</Text>

  <View style={styles.statsContainer}>
    <View style={styles.statItem}>
      <FontAwesome name="question-circle" size={16} color="#666" />
      <Text style={styles.statText}>{quiz.questions} Questions</Text>
    </View>
    <View style={styles.statItem}>
      <FontAwesome name="clock-o" size={16} color="#666" />
      <Text style={styles.statText}>{quiz.duration}</Text>
    </View>
  </View>

  <View style={styles.divider} />

  <View style={styles.footerStats}>
    <View style={styles.footerStat}>
      <View style={styles.completionContainer}>
        <FontAwesome
          name={quiz.isCompleted ? "check-circle" : "circle-o"}
          size={20}
          color={quiz.isCompleted ? "#4CAF50" : "#666"}
        />
        <Text
          style={[
            styles.completionText,
            { color: quiz.isCompleted ? "#4CAF50" : "#666" }
          ]}
        >
          {quiz.isCompleted ? "Completed" : "Not Completed"}
        </Text>
      </View>
    </View>
    <View style={styles.footerStatDivider} />
    <View style={styles.footerStat}>
      {quiz.isCompleted ? (
        <>
          <Text style={styles.footerStatNumber}>
            {quiz.id === 1
              ? userDoc?.EngScore < 0
                ? 0
                : userDoc?.EngScore
              : quiz.id === 2
              ? userDoc?.IndScore < 0
                ? 0
                : userDoc?.IndScore
              : quiz.score}
            %
          </Text>
          <Text style={styles.footerStatLabel}>Your Score</Text>
        </>
      ) : (
        <Text style={styles.notAttemptedText}>Not attempted yet</Text>
      )}
    </View>
  </View>

  <LinearGradient
    colors={quiz.gradient}
    style={[
      styles.startButton,
      {
        opacity: 
          (quiz.id === 1 && userDoc?.EngScore !== 0) || 
          (quiz.id === 2 && userDoc?.IndScore !== 0) 
            ? 0.5 : 1 // Button opacity when disabled
      }
    ]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
  >
    <Text style={styles.startButtonText}>
      {quiz.isCompleted ? 'Retake Quiz' : 'Start Quiz'}
    </Text>
    <FontAwesome name="arrow-right" size={16} color="#fff" />
  </LinearGradient>
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
  quizContainer: {
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
  quizTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    color: '#666',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 15,
  },
  footerStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  footerStat: {
    alignItems: 'center',
    flex: 1,
  },
  completionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footerStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 4,
  },
  footerStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  notAttemptedText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  footerStatDivider: {
    width: 1,
    backgroundColor: '#f0f0f0',
    height: '100%',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
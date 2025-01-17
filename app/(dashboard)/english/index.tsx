import React, { useState } from 'react';
import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, View } from '@/components/Themed';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";

// Quiz questions data
const questions = [
  {
    id: 1,
    question: "What is the correct form of the verb in: 'She ___ to school every day'?",
    options: ["go", "goes", "going", "went"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Choose the correct word: 'I ___ my homework yesterday.'",
    options: ["do", "did", "done", "doing"],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "Which sentence is correct?",
    options: [
      "I am student",
      "I am a student",
      "I am the student",
      "I am an student"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "What is the plural form of 'child'?",
    options: ["childs", "childes", "children", "child"],
    correctAnswer: 2
  },
  {
    id: 5,
    question: "Select the correct pronunciation of 'photograph':",
    options: ["foto-graf", "fo-to-graph", "pho-to-graph", "photo-graph"],
    correctAnswer: 2
  }
];

export default function EnglishQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        totalScore += 20;
      }
    });
    return totalScore;
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalScore = calculateScore();
      setScore(finalScore);
      setShowScore(true);
  
      // Update the score in Firestore
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          // Check if the document exists
          if (userDoc.exists()) {
            const userData = userDoc.data(); // Access the data
            
            // Safely get the current score, defaulting to 0 if undefined
            const currentScore = userData.score < 0 ? 0 : userData.score || 0;
            const newScore = currentScore + finalScore;
        
            console.log("Current Score:", currentScore);
            console.log("Final Score:", finalScore);
            console.log("New Score:", newScore);
        
            // Update the document
            await updateDoc(userDocRef, {
              EngScore: finalScore,
              score: newScore,
            });
        console.log("Score updated successfully in Firestore.");
      }
          console.log("Score updated successfully in Firestore.");
        } else {
          console.error("User not authenticated.");
        }
      } catch (error) {
        console.error("Error updating score in Firestore:", error);
      }
  
      // Navigate to quiz overview
      router.replace("/quiz");
    }
  };

  if (showScore) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1a237e', '#0d47a1']}
          style={styles.scoreContainer}
        >
          <Text style={styles.scoreText}>Your Score: {score}%</Text>
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace('/quiz')}
          >
            <Text style={styles.backButtonText}>Back to Quizzes</Text>
          </Pressable>
        </LinearGradient>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1a237e', '#0d47a1']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>English Quiz</Text>
        <Text style={styles.headerSubtitle}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
      </LinearGradient>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>
          {questions[currentQuestion].question}
        </Text>

        <View style={styles.optionsContainer}>
          {questions[currentQuestion].options.map((option, index) => (
            <Pressable
              key={index}
              style={[
                styles.optionButton,
                selectedAnswers[currentQuestion] === index && styles.selectedOption
              ]}
              onPress={() => handleAnswerSelect(index)}
            >
              <Text style={[
                styles.optionText,
                selectedAnswers[currentQuestion] === index && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={[
            styles.nextButton,
            {
              opacity: selectedAnswers[currentQuestion] === undefined ? 0.5 : 1
            }
          ]}
          onPress={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </Text>
          <FontAwesome name="arrow-right" size={16} color="#fff" />
        </Pressable>
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
  questionContainer: {
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    backgroundColor: '#1a237e',
    borderColor: '#1a237e',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#1a237e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#1a237e',
    fontSize: 16,
    fontWeight: '600',
  },
});
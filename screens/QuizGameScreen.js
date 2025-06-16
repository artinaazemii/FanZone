// QuizGameScreen.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { useCoins } from '../context/CoinContext';

const REWARD_COINS = 25;
const QUESTION_TIME = 10; // seconds per question

export default function QuizGameScreen({ route, navigation }) {
  const { quiz, onComplete, alreadyPerfect } = route.params;
  const { addCoins } = useCoins();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const timerRef = useRef(null);

  const questions = quiz.questions;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentQuestion = questions[currentQuestionIndex];

  // Start/reset timer on question change
  useEffect(() => {
    setTimeLeft(QUESTION_TIME);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleNextQuestion();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    clearInterval(timerRef.current);
    const sel = selectedAnswer;
    if (sel === null) {
      // auto-mark incorrect if timed out
    }
    const isCorrect = sel === currentQuestion.correct;
    setUserAnswers(prev => [
      ...prev,
      {
        question: currentQuestion.question,
        selectedAnswerText: sel !== null ? currentQuestion.options[sel] : 'No answer',
        correctAnswer: currentQuestion.options[currentQuestion.correct],
        correct: isCorrect,
        explanation: currentQuestion.explanation,
      }
    ]);
    if (isCorrect) setScore(s => s + 1);

    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedAnswer(null);
    }
  };

  const handleFinishQuiz = async () => {
    const isPerfect = score === questions.length;
    if (isPerfect && !alreadyPerfect) {
      await addCoins(REWARD_COINS);
      Alert.alert('🏅 Perfect!', `You earned ${REWARD_COINS} coins.`);
    }
    if (onComplete) onComplete({ isPerfect });
    navigation.goBack();
  };

  if (showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.resultTitle}>Quiz Complete!</Text>
        <Text style={styles.quizTitle}>{quiz.title}</Text>
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, { color: score/ questions.length >= .8 ? '#4CAF50' : score/ questions.length >= .6 ? '#FF9800' : '#F44336' }]}>
            {score}/{questions.length}
          </Text>
          <Text style={styles.scoreMessage}>
            {score/ questions.length >= .8 ? 'Excellent! 🏆' : score/ questions.length >= .6 ? 'Good job! 👍' : 'Keep practicing! 💪'}
          </Text>
        </View>
        <ScrollView style={styles.reviewContainer} contentContainerStyle={{ paddingBottom: 20 }}>
          {userAnswers.map((a, idx) => (
            <View key={idx} style={styles.reviewItem}>
              <Text style={styles.reviewQuestion}>{idx+1}. {a.question}</Text>
              <Text style={[styles.reviewAnswer, { color: a.correct ? '#4CAF50' : '#F44336' }]}>Your answer: {a.selectedAnswerText}</Text>
              {!a.correct && <Text style={styles.reviewCorrect}>Correct: {a.correctAnswer}</Text>}
              <Text style={styles.reviewExplanation}>{a.explanation}</Text>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinishQuiz}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Quiz view
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{quiz.title}</Text>
        <Text style={styles.timerText}>{timeLeft}s</Text>
      </View>
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Question {currentQuestionIndex+1} of {questions.length}</Text>
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.optionButton, selectedAnswer===i && styles.selectedOption]}
            onPress={() => handleAnswerSelect(i)}
          >
            <Text style={[styles.optionText, selectedAnswer===i && styles.selectedOptionText]}>
              {String.fromCharCode(65+i)}. {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.nextButton, selectedAnswer===null && styles.disabledButton]}
        onPress={handleNextQuestion}
        disabled={false}
      >
        <Text style={[styles.nextButtonText, selectedAnswer===null && styles.disabledButtonText]}> 
          {isLastQuestion ? 'Finish Quiz' : 'Next'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backButton: { marginRight: 12 },
  backArrow: { fontSize: 24, color: '#fff' },
  headerTitle: { flex: 1, color: '#fff', fontSize: 18, fontWeight: 'bold' },
  timerText: { color: '#FFD700', fontSize: 18, fontWeight: 'bold' },
  progressContainer: { marginBottom: 12 },
  progressText: { color: '#fff', textAlign: 'center' },
  questionContainer: { marginBottom: 20 },
  questionText: { color: '#fff', fontSize: 20, textAlign: 'center' },
  optionsContainer: { flex: 1 },
  optionButton: { backgroundColor: '#222', padding: 12, borderRadius: 8, marginBottom: 10 },
  selectedOption: { backgroundColor: '#333' },
  optionText: { color: '#fff' },
  selectedOptionText: { color: '#4CAF50', fontWeight: '600' },
  nextButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 8, alignItems: 'center', marginVertical: 12 },
  disabledButton: { backgroundColor: '#555' },
  nextButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  disabledButtonText: { color: '#999' },
  resultTitle: { color: '#FFD700', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  quizTitle: { color: '#fff', textAlign: 'center', marginBottom: 16 },
  scoreContainer: { alignItems: 'center', marginBottom: 16 },
  scoreText: { fontSize: 48, fontWeight: 'bold' },
  scoreMessage: { color: '#fff', fontSize: 18 },
  reviewContainer: { flex: 1, marginVertical: 12 },
  reviewItem: { backgroundColor: '#222', padding: 12, borderRadius: 8, marginBottom: 10 },
  reviewQuestion: { color: '#fff', marginBottom: 4 },
  reviewAnswer: { marginBottom: 2 },
  reviewCorrect: { color: '#4CAF50', marginBottom: 2 },
  reviewExplanation: { color: '#bbb', fontStyle: 'italic' },
  finishButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  finishButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

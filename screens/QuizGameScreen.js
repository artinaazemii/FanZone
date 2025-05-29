import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useCoins } from '../context/CoinContext';         // ⬅️ NEW

const REWARD_COINS = 25;                                   // ⬅️ how many coins for a perfect score

export default function QuizGameScreen({ route, navigation }) {
  const { quiz, onComplete } = route.params;
  const { addCoins } = useCoins();                         // ⬅️ NEW

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  const handleAnswerSelect = (answerIndex) => setSelectedAnswer(answerIndex);

  const handleNextQuestion = () => {
    if (selectedAnswer === null) {
      Alert.alert('Please select an answer', 'You must choose an answer before continuing.');
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correct;
    setUserAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        selectedAnswer,
        correct: isCorrect,
        question: currentQuestion.question,
        correctAnswer: currentQuestion.options[currentQuestion.correct],
        selectedAnswerText: currentQuestion.options[selectedAnswer],
        explanation: currentQuestion.explanation,
      },
    ]);

    if (isCorrect) setScore((s) => s + 1);

    if (isLastQuestion) {
      setShowResult(true);
      if (onComplete) onComplete();
    } else {
      setCurrentQuestionIndex((idx) => idx + 1);
      setSelectedAnswer(null);
    }
  };

  const handleFinishQuiz = async () => {
    // ─── Reward coins for perfect score ────────────────────────────────
    if (score === quiz.questions.length) {
      await addCoins(REWARD_COINS);
      Alert.alert('🏅 Perfect!', `You earned ${REWARD_COINS} coins.`);
    }
    navigation.goBack();
  };

  /* helper UI functions */
  const getScoreColor = () => {
    const pct = (score / quiz.questions.length) * 100;
    if (pct >= 80) return '#4CAF50';
    if (pct >= 60) return '#FF9800';
    return '#F44336';
  };
  const getScoreMessage = () => {
    const pct = (score / quiz.questions.length) * 100;
    if (pct >= 80) return 'Excellent! 🏆';
    if (pct >= 60) return 'Good job! 👍';
    return 'Keep practicing! 💪';
  };

  // ─────────────────────────────────────────────────────────────────────
  //  RESULT VIEW
  if (showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Quiz Complete!</Text>
          <Text style={styles.quizTitle}>{quiz.title}</Text>

          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, { color: getScoreColor() }]}>
              {score}/{quiz.questions.length}
            </Text>
            <Text style={styles.scorePercentage}>
              {Math.round((score / quiz.questions.length) * 100)}%
            </Text>
            <Text style={styles.scoreMessage}>{getScoreMessage()}</Text>
          </View>

          <View style={styles.reviewContainer}>
            <Text style={styles.reviewTitle}>Review:</Text>
            {userAnswers.map((answer, index) => (
              <View key={index} style={styles.reviewItem}>
                <Text style={styles.reviewQuestion}>
                  {index + 1}. {answer.question}
                </Text>
                <Text
                  style={[
                    styles.reviewAnswer,
                    { color: answer.correct ? '#4CAF50' : '#F44336' },
                  ]}
                >
                  Your answer: {answer.selectedAnswerText}{' '}
                  {answer.correct ? '✓' : '✗'}
                </Text>
                {!answer.correct && (
                  <Text style={styles.reviewCorrect}>
                    Correct: {answer.correctAnswer}
                  </Text>
                )}
                <Text style={styles.reviewExplanation}>
                  {answer.explanation}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.finishButton} onPress={handleFinishQuiz}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ─────────────────────────────────────────────────────────────────────
  //  QUIZ VIEW
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{quiz.title}</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Question */}
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === index && styles.selectedOption,
            ]}
            onPress={() => handleAnswerSelect(index)}
          >
            <Text
              style={[
                styles.optionText,
                selectedAnswer === index && styles.selectedOptionText,
              ]}
            >
              {String.fromCharCode(65 + index)}. {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Next / Finish */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedAnswer === null && styles.disabledButton,
          ]}
          onPress={handleNextQuestion}
          disabled={selectedAnswer === null}
        >
          <Text
            style={[
              styles.nextButtonText,
              selectedAnswer === null && styles.disabledButtonText,
            ]}
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/*  ======  STYLES  (unchanged)  ======  */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backButton: { marginRight: 16 },
  backArrow: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', flex: 1 },
  progressContainer: { paddingHorizontal: 16, marginBottom: 24 },
  progressText: { color: '#fff', fontSize: 16, marginBottom: 8, textAlign: 'center' },
  progressBar: { height: 8, backgroundColor: '#333', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 4 },
  questionContainer: { paddingHorizontal: 16, marginBottom: 32 },
  questionText: { fontSize: 20, color: '#fff', textAlign: 'center', fontWeight: '500' },
  optionsContainer: { paddingHorizontal: 16, flex: 1 },
  optionButton: {
    backgroundColor: '#222',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: { backgroundColor: '#333', borderColor: '#4CAF50' },
  optionText: { color: '#fff', fontSize: 16 },
  selectedOptionText: { color: '#4CAF50', fontWeight: '600' },
  bottomContainer: { paddingHorizontal: 16, paddingBottom: 32 },
  nextButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 12, alignItems: 'center' },
  disabledButton: { backgroundColor: '#333' },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  disabledButtonText: { color: '#666' },
  /* result */
  resultContainer: { flex: 1, padding: 16 },
  resultTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  quizTitle: { fontSize: 18, color: '#bbb', textAlign: 'center', marginBottom: 32 },
  scoreContainer: { alignItems: 'center', backgroundColor: '#222', padding: 24, borderRadius: 16, marginBottom: 32 },
  scoreText: { fontSize: 48, fontWeight: 'bold', marginBottom: 8 },
  scorePercentage: { fontSize: 24, color: '#fff', marginBottom: 8 },
  scoreMessage: { fontSize: 18, color: '#bbb' },
  reviewContainer: { flex: 1 },
  reviewTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  reviewItem: { backgroundColor: '#222', padding: 16, borderRadius: 12, marginBottom: 12 },
  reviewQuestion: { fontSize: 16, color: '#fff', fontWeight: '600', marginBottom: 8 },
  reviewAnswer: { fontSize: 14, marginBottom: 4 },
  reviewCorrect: { fontSize: 14, color: '#4CAF50', marginBottom: 4 },
  reviewExplanation: { fontSize: 13, color: '#bbb', fontStyle: 'italic' },
  finishButton: { backgroundColor: '#4CAF50', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  finishButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

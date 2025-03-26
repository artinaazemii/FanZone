import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const quizCategories = [
  {
    title: 'European Leagues',
    quizzes: [
      {
        id: '1',
        league: 'Premier League',
        questions: [
          {
            id: '1',
            question: 'Which team has won the most Premier League titles?',
            options: ['Manchester United', 'Liverpool', 'Chelsea', 'Arsenal'],
            correct: 0
          },
          {
            id: '2',
            question: "Who is the Premier League's all-time top scorer?",
            options: ['Wayne Rooney', 'Alan Shearer', 'Harry Kane', 'Sergio Aguero'],
            correct: 1
          },
          {
            id: '3',
            question: 'Which team went unbeaten in the 2003-04 season?',
            options: ['Chelsea', 'Manchester United', 'Arsenal', 'Liverpool'],
            correct: 2
          },
          {
            id: '4',
            question: 'Who holds the record for most assists in a single Premier League season?',
            options: ['Kevin De Bruyne', 'Thierry Henry', 'Cesc Fabregas', 'Frank Lampard'],
            correct: 0
          },
          {
            id: '5',
            question: 'Which goalkeeper has kept the most clean sheets in Premier League history?',
            options: ['David de Gea', 'Petr Cech', 'Peter Schmeichel', 'Edwin van der Sar'],
            correct: 1
          }
        ]
      },
      {
        id: '2',
        league: 'La Liga',
        questions: [
          {
            id: '1',
            question: 'Which club has won the most La Liga titles?',
            options: ['Real Madrid', 'Barcelona', 'Atletico Madrid', 'Valencia'],
            correct: 0
          },
          {
            id: '2',
            question: 'Who holds the record for most goals in La Liga?',
            options: ['Cristiano Ronaldo', 'Lionel Messi', 'Telmo Zarra', 'Hugo Sanchez'],
            correct: 1
          },
          {
            id: '3',
            question: 'Which team has never been relegated from La Liga?',
            options: ['Athletic Bilbao', 'Valencia', 'Sevilla', 'Real Betis'],
            correct: 0
          },
          {
            id: '4',
            question: 'Who has made the most appearances in La Liga history?',
            options: ['Iker Casillas', 'Andoni Zubizarreta', 'Raul', 'Joaquin'],
            correct: 3
          }
        ]
      },
      {
        id: '3',
        league: 'Bundesliga',
        questions: [
          {
            id: '1',
            question: 'Which club has won the most Bundesliga titles?',
            options: ['Bayern Munich', 'Borussia Dortmund', 'Werder Bremen', 'Hamburg'],
            correct: 0
          },
          {
            id: '2',
            question: 'Who is the Bundesliga all-time top scorer?',
            options: ['Robert Lewandowski', 'Gerd Muller', 'Klaus Fischer', 'Jupp Heynckes'],
            correct: 1
          },
          {
            id: '3',
            question: 'Which team has never been relegated from the Bundesliga?',
            options: ['Hamburg', 'Bayern Munich', 'Werder Bremen', 'Stuttgart'],
            correct: 1
          },
          {
            id: '4',
            question: 'Who holds the record for most goals in a single Bundesliga season?',
            options: ['Robert Lewandowski', 'Gerd Muller', 'Pierre-Emerick Aubameyang', 'Erling Haaland'],
            correct: 0
          }
        ]
      },
      {
        id: '4',
        league: 'Serie A',
        questions: [
          {
            id: '1',
            question: 'Which team has won the most Serie A titles?',
            options: ['Juventus', 'AC Milan', 'Inter Milan', 'Roma'],
            correct: 0
          },
          {
            id: '2',
            question: 'Who is the all-time top scorer in Serie A?',
            options: ['Francesco Totti', 'Silvio Piola', 'Gunnar Nordahl', 'Giuseppe Meazza'],
            correct: 1
          },
          {
            id: '3',
            question: 'Which city has two teams that have won the Serie A?',
            options: ['Rome', 'Milan', 'Turin', 'Naples'],
            correct: 1
          },
          {
            id: '4',
            question: 'Who holds the record for most appearances in Serie A?',
            options: ['Paolo Maldini', 'Gianluigi Buffon', 'Francesco Totti', 'Javier Zanetti'],
            correct: 1
          }
        ]
      }
    ]
  },
  {
    title: 'International Tournaments',
    quizzes: [
      {
        id: '8',
        league: 'World Cup',
        questions: [
          {
            id: '1',
            question: 'Which country has won the most World Cup titles?',
            options: ['Germany', 'Brazil', 'Italy', 'Argentina'],
            correct: 1
          },
          {
            id: '2',
            question: 'Who has scored the most goals in World Cup history?',
            options: ['Miroslav Klose', 'Ronaldo', 'Pele', 'Just Fontaine'],
            correct: 0
          },
          {
            id: '3',
            question: 'Which country won the first World Cup in 1930?',
            options: ['Brazil', 'Uruguay', 'Argentina', 'Italy'],
            correct: 1
          },
          {
            id: '4',
            question: 'Who has made the most World Cup appearances as a player?',
            options: ['Lothar Matthäus', 'Lionel Messi', 'Paolo Maldini', 'Diego Maradona'],
            correct: 0
          },
          {
            id: '5',
            question: 'Which country has appeared in the most World Cup finals without winning?',
            options: ['Netherlands', 'Hungary', 'Czech Republic', 'Croatia'],
            correct: 0
          }
        ]
      },
      {
        id: '9',
        league: 'UEFA Champions League',
        questions: [
          {
            id: '1',
            question: 'Which club has won the most Champions League/European Cup titles?',
            options: ['Real Madrid', 'AC Milan', 'Bayern Munich', 'Liverpool'],
            correct: 0
          },
          {
            id: '2',
            question: 'Who is the all-time top scorer in the Champions League?',
            options: ['Lionel Messi', 'Cristiano Ronaldo', 'Raul', 'Robert Lewandowski'],
            correct: 1
          },
          {
            id: '3',
            question: 'Which player has won the most Champions League titles?',
            options: ['Paolo Maldini', 'Francisco Gento', 'Cristiano Ronaldo', 'Lionel Messi'],
            correct: 1
          },
          {
            id: '4',
            question: "Which team completed the first treble (League, Cup, Champions League) in men's football?",
            options: ['Manchester United', 'Celtic', 'Ajax', 'Barcelona'],
            correct: 1
          }
        ]
      },
      {
        id: '10',
        league: 'European Championship',
        questions: [
          {
            id: '1',
            question: 'Which country has won the most European Championships?',
            options: ['Germany', 'Spain', 'France', 'Italy'],
            correct: 0
          },
          {
            id: '2',
            question: 'Who is the all-time top scorer in European Championship finals?',
            options: ['Cristiano Ronaldo', 'Michel Platini', 'Alan Shearer', 'Antoine Griezmann'],
            correct: 0
          },
          {
            id: '3',
            question: 'Which country won the first European Championship in 1960?',
            options: ['Soviet Union', 'Yugoslavia', 'Czechoslovakia', 'West Germany'],
            correct: 0
          },
          {
            id: '4',
            question: 'Which was the first country to win the Euros as hosts?',
            options: ['France', 'Italy', 'Spain', 'Portugal'],
            correct: 0
          }
        ]
      }
    ]
  }
];

const HomeScreen = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleAnswerSelect = (selectedIndex) => {
    if (selectedQuiz.questions[currentQuestion].correct === selectedIndex) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < selectedQuiz.questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  const renderQuiz = () => {
    if (showScore) {
      return (
        <View style={styles.questionContainer}>
          <Text style={styles.scoreText}>
            You scored {score} out of {selectedQuiz.questions.length}!
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={resetQuiz}>
            <Text style={styles.backText}>Try Another Quiz</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const question = selectedQuiz.questions[currentQuestion];
    return (
      <View style={styles.questionContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestion + 1) / selectedQuiz.questions.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.questionNumber}>
          Question {currentQuestion + 1} of {selectedQuiz.questions.length}
        </Text>
        <Text style={styles.questionText}>{question.question}</Text>
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswerSelect(index)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.backButton} onPress={resetQuiz}>
          <Text style={styles.backText}>Quit Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!selectedQuiz ? (
        <ScrollView style={styles.quizListContainer}>
          <Text style={styles.headerText}>Football Quiz Challenge</Text>
          {quizCategories.map((category, index) => (
            <View key={index} style={styles.quizCategory}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>
              <View style={styles.quizGrid}>
                {category.quizzes.map((quiz) => (
                  <TouchableOpacity
                    key={quiz.id}
                    style={styles.quizButton}
                    onPress={() => setSelectedQuiz(quiz)}
                  >
                    <Text style={styles.quizText}>{quiz.league}</Text>
                    {quiz.questions && (
                      <Text style={styles.questionCount}>
                        {quiz.questions.length} Questions
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        renderQuiz()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  quizListContainer: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  quizCategory: {
    marginBottom: 30,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryHeader: {
    padding: 15,
    backgroundColor: '#007bff',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  quizGrid: {
    padding: 15,
  },
  quizButton: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  quizText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '600',
  },
  questionCount: {
    color: '#6c757d',
    fontSize: 14,
    marginTop: 5,
  },
  questionContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 4,
  },
  questionNumber: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  optionText: {
    color: '#1a1a1a',
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#28a745',
  },
});

export default HomeScreen;
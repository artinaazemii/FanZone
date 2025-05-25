import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  AsyncStorage,
} from 'react-native';

export default function QuizzesScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [completedQuizzes, setCompletedQuizzes] = useState([]);

  // Load completed quizzes from storage when component mounts
  useEffect(() => {
    loadCompletedQuizzes();
  }, []);

  const loadCompletedQuizzes = async () => {
    try {
      const completed = await AsyncStorage.getItem('completedQuizzes');
      if (completed) {
        setCompletedQuizzes(JSON.parse(completed));
      }
    } catch (error) {
      console.error('Error loading completed quizzes:', error);
    }
  };

  const markQuizAsCompleted = async (quizId) => {
    try {
      const updatedCompleted = [...completedQuizzes, quizId];
      setCompletedQuizzes(updatedCompleted);
      await AsyncStorage.setItem('completedQuizzes', JSON.stringify(updatedCompleted));
    } catch (error) {
      console.error('Error saving completed quiz:', error);
    }
  };

  const quizzes = [
    {
      id: 1,
      title: 'El Clásico: Barcelona vs Real Madrid',
      description: 'The greatest rivalry in football history',
      category: 'El Clásico',
      difficulty: 'Medium',
      questions: [
        {
          question: 'Who has scored the most goals in El Clásico history?',
          options: ['Lionel Messi', 'Cristiano Ronaldo', 'Alfredo Di Stéfano', 'Raúl González'],
          correct: 0,
          explanation: 'Lionel Messi scored 26 goals in El Clásico matches during his Barcelona career.'
        },
        {
          question: 'What is the largest margin of victory in El Clásico history?',
          options: ['Barcelona 5-0 Real Madrid', 'Real Madrid 11-1 Barcelona', 'Barcelona 6-2 Real Madrid', 'Real Madrid 8-0 Barcelona'],
          correct: 1,
          explanation: 'Real Madrid defeated Barcelona 11-1 in the Copa del Rey semi-final in 1943.'
        },
        {
          question: 'In which stadium was the first official El Clásico played?',
          options: ['Camp Nou', 'Santiago Bernabéu', 'Hipódromo de la Castellana', 'Les Corts'],
          correct: 2,
          explanation: 'The first El Clásico was played at Hipódromo de la Castellana in Madrid on May 13, 1902.'
        },
        {
          question: 'Who is known as "Mr. El Clásico" for his performances in these matches?',
          options: ['Sergio Ramos', 'Xavi Hernández', 'Iker Casillas', 'Andrés Iniesta'],
          correct: 0,
          explanation: 'Sergio Ramos earned this nickname for his crucial goals and performances in El Clásico matches.'
        },
        {
          question: 'Which El Clásico is remembered for Ronaldinho receiving a standing ovation at the Bernabéu?',
          options: ['2005 match', '2006 match', '2004 match', '2007 match'],
          correct: 0,
          explanation: 'In November 2005, Ronaldinho scored twice at the Bernabéu and received a rare standing ovation from Real Madrid fans.'
        }
      ]
    },
    {
      id: 2,
      title: 'Madrid Derby: Real Madrid vs Atlético Madrid',
      description: 'The battle for supremacy in the Spanish capital',
      category: 'Madrid Derby',
      difficulty: 'Hard',
      questions: [
        {
          question: 'What is Atlético Madrid\'s current home stadium called?',
          options: ['Wanda Metropolitano', 'Cívitas Metropolitano', 'Vicente Calderón', 'Estadio Metropolitano'],
          correct: 1,
          explanation: 'The stadium is officially called Cívitas Metropolitano after a naming rights deal.'
        },
        {
          question: 'Who scored the equalizer for Atlético in the 2014 Champions League final against Real Madrid?',
          options: ['Antoine Griezmann', 'Diego Godín', 'Koke', 'Diego Costa'],
          correct: 1,
          explanation: 'Diego Godín scored the equalizer in the 36th minute to make it 1-1 in Lisbon.'
        },
        {
          question: 'What is Diego Simeone\'s famous nickname?',
          options: ['El Cholo', 'El Profesor', 'El Capitán', 'El Maestro'],
          correct: 0,
          explanation: 'Diego Simeone is known as "El Cholo," a nickname he\'s had since his playing days.'
        },
        {
          question: 'In which year did Atlético Madrid last win La Liga before their 2014 triumph?',
          options: ['1996', '1977', '1985', '1973'],
          correct: 1,
          explanation: 'Atlético Madrid won La Liga in the 1976-77 season, ending a 37-year wait in 2014.'
        },
        {
          question: 'How many Champions League finals have Real Madrid and Atlético Madrid played against each other?',
          options: ['1', '2', '3', '4'],
          correct: 1,
          explanation: 'They met in the 2014 and 2016 Champions League finals, with Real Madrid winning both.'
        }
      ]
    },
    {
      id: 3,
      title: 'Manchester Derby: United vs City',
      description: 'The battle of Manchester between the red and blue sides',
      category: 'Manchester Derby',
      difficulty: 'Medium',
      questions: [
        {
          question: 'What was the famous scoreline when Manchester City defeated United 6-1 at Old Trafford?',
          options: ['October 2011', 'November 2011', 'September 2011', 'December 2011'],
          correct: 0,
          explanation: 'Manchester City won 6-1 at Old Trafford on October 23, 2011, in one of the most memorable derbies.'
        },
        {
          question: 'Who scored the winning goal for Manchester City in the 2012 title-deciding derby?',
          options: ['Sergio Agüero', 'Vincent Kompany', 'Yaya Touré', 'Carlos Tevez'],
          correct: 1,
          explanation: 'Vincent Kompany scored the only goal in City\'s 1-0 victory that helped them win their first Premier League title.'
        },
        {
          question: 'Which manager famously displayed a "Welcome to Manchester" poster after signing Carlos Tevez?',
          options: ['Sir Alex Ferguson', 'Roberto Mancini', 'Mark Hughes', 'Pep Guardiola'],
          correct: 1,
          explanation: 'Roberto Mancini and Manchester City put up billboards around Manchester welcoming Tevez after he joined from United.'
        },
        {
          question: 'In which year did Manchester City move to the Etihad Stadium?',
          options: ['2002', '2003', '2004', '2001'],
          correct: 1,
          explanation: 'Manchester City moved to the City of Manchester Stadium (now Etihad) in 2003.'
        },
        {
          question: 'Who has the record for most goals scored in Manchester Derby history?',
          options: ['Wayne Rooney', 'Joe Hayes', 'Ryan Giggs', 'Sergio Agüero'],
          correct: 1,
          explanation: 'Joe Hayes scored 8 goals in Manchester Derby matches during his career with Manchester City.'
        }
      ]
    },
    {
      id: 4,
      title: 'Der Klassiker: Bayern Munich vs Borussia Dortmund',
      description: 'Germany\'s biggest football rivalry',
      category: 'Der Klassiker',
      difficulty: 'Hard',
      questions: [
        {
          question: 'What is the nickname for the Bayern Munich vs Borussia Dortmund rivalry?',
          options: ['Der Klassiker', 'Das Duell', 'Die Schlacht', 'Der Kampf'],
          correct: 0,
          explanation: '"Der Klassiker" is the official name for this rivalry between Germany\'s two most successful clubs.'
        },
        {
          question: 'Which Dortmund player scored 4 goals in a single match against Bayern Munich?',
          options: ['Erling Haaland', 'Robert Lewandowski', 'Pierre-Emerick Aubameyang', 'Marco Reus'],
          correct: 1,
          explanation: 'Robert Lewandowski scored 4 goals in the first half for Dortmund against Bayern in 2013.'
        },
        {
          question: 'What is Borussia Dortmund\'s famous stadium called?',
          options: ['Signal Iduna Park', 'Westfalenstadion', 'Both names are correct', 'BVB Arena'],
          correct: 2,
          explanation: 'The stadium is officially called Signal Iduna Park but is still commonly known as Westfalenstadion.'
        },
        {
          question: 'Which manager led Dortmund to back-to-back Bundesliga titles in 2011 and 2012?',
          options: ['Thomas Tuchel', 'Jürgen Klopp', 'Lucien Favre', 'Edin Terzić'],
          correct: 1,
          explanation: 'Jürgen Klopp guided Dortmund to consecutive Bundesliga titles, breaking Bayern\'s dominance.'
        },
        {
          question: 'What is the capacity of Dortmund\'s famous "Yellow Wall" (Südtribüne)?',
          options: ['20,000', '25,000', '30,000', '35,000'],
          correct: 1,
          explanation: 'The Südtribüne holds approximately 25,000 standing spectators, making it the largest terrace in European football.'
        }
      ]
    },
    {
      id: 5,
      title: 'Derby della Madonnina: AC Milan vs Inter Milan',
      description: 'The Milan derby that divides a city',
      category: 'Milan Derby',
      difficulty: 'Hard',
      questions: [
        {
          question: 'What stadium do both AC Milan and Inter Milan call home?',
          options: ['San Siro', 'Giuseppe Meazza Stadium', 'Both names refer to the same stadium', 'Stadio Milano'],
          correct: 2,
          explanation: 'The stadium is officially called Giuseppe Meazza but is commonly known as San Siro.'
        },
        {
          question: 'Which team was founded first?',
          options: ['AC Milan (1899)', 'Inter Milan (1908)', 'They were founded in the same year', 'Records are unclear'],
          correct: 0,
          explanation: 'AC Milan was founded in 1899, while Inter Milan was founded in 1908 as a breakaway from Milan.'
        },
        {
          question: 'What does "Derby della Madonnina" refer to?',
          options: ['A famous player', 'The golden statue atop Milan Cathedral', 'The first derby match', 'A trophy'],
          correct: 1,
          explanation: 'The name refers to the Madonnina, the golden statue of the Virgin Mary on top of Milan Cathedral.'
        },
        {
          question: 'Which Milan Derby is considered the most famous in Champions League history?',
          options: ['2003 Champions League semi-final', '2005 Champions League final', '2007 Champions League semi-final', '2004 quarter-final'],
          correct: 0,
          explanation: 'The 2003 Champions League semi-final was the first time both Milan teams met in European competition.'
        },
        {
          question: 'Who scored the famous bicycle kick goal in a Milan Derby?',
          options: ['Kaká', 'Andrea Pirlo', 'Marco Materazzi', 'Hernán Crespo'],
          correct: 2,
          explanation: 'Marco Materazzi scored a spectacular bicycle kick goal for Inter against AC Milan.'
        }
      ]
    }
  ];

  const handleQuizPress = (quiz) => {
    if (!completedQuizzes.includes(quiz.id)) {
      navigation.navigate('QuizGame', { 
        quiz: quiz, 
        onComplete: () => markQuizAsCompleted(quiz.id) 
      });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      default: return '#999';
    }
  };

  const renderQuizCard = (quiz) => {
    const isCompleted = completedQuizzes.includes(quiz.id);
    
    return (
      <View key={quiz.id} style={[styles.quizCard, isCompleted && styles.completedQuizCard]}>
        <View style={styles.quizContent}>
          <View style={styles.quizInfo}>
            <Text style={[styles.quizTitle, isCompleted && styles.completedTitle]}>
              {quiz.title}
            </Text>
            <Text style={[styles.quizDescription, isCompleted && styles.completedDescription]}>
              {quiz.description}
            </Text>
            <View style={styles.quizMeta}>
              <Text style={[styles.quizCategory, isCompleted && styles.completedText]}>
                {quiz.category}
              </Text>
              <Text style={[
                styles.quizDifficulty, 
                { color: isCompleted ? '#666' : getDifficultyColor(quiz.difficulty) }
              ]}>
                {quiz.difficulty}
              </Text>
              <Text style={[styles.questionCount, isCompleted && styles.completedText]}>
                {quiz.questions.length} questions
              </Text>
            </View>
            <Text style={[
              styles.quizStatus,
              isCompleted ? styles.completedStatus : styles.availableStatus
            ]}>
              {isCompleted ? 'Completed ✓' : 'Available'}
            </Text>
          </View>
          {!isCompleted ? (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => handleQuizPress(quiz)}
            >
              <Text style={styles.playButtonText}>PLAY</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.completedBadge}>
              <Text style={styles.completedBadgeText}>DONE</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quizzes & Achievements</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'quizzes' ? styles.activeTab : styles.inactiveTab
          ]}
          onPress={() => setActiveTab('quizzes')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'quizzes' ? styles.activeTabText : styles.inactiveTabText
          ]}>
            Quizzes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'achievements' ? styles.activeTab : styles.inactiveTab
          ]}
          onPress={() => setActiveTab('achievements')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'achievements' ? styles.activeTabText : styles.inactiveTabText
          ]}>
            Achievements
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'quizzes' ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>QUIZZES</Text>
              <Text style={styles.quizCount}>({quizzes.length})</Text>
            </View>
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Progress: {completedQuizzes.length}/{quizzes.length} completed
              </Text>
            </View>
            {quizzes.map(renderQuizCard)}
          </>
        ) : (
          <View style={styles.achievementsContainer}>
            <Text style={styles.achievementsText}>Achievements coming soon...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
  },
  backArrow: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#333',
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#555',
  },
  inactiveTab: {
    backgroundColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  inactiveTabText: {
    color: '#999',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  quizCount: {
    fontSize: 16,
    color: '#999',
    marginLeft: 8,
  },
  progressContainer: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  quizCard: {
    backgroundColor: '#222',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  completedQuizCard: {
    backgroundColor: '#1a1a1a',
    opacity: 0.8,
  },
  quizContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  quizInfo: {
    flex: 1,
    marginRight: 12,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    lineHeight: 22,
  },
  completedTitle: {
    color: '#aaa',
  },
  quizDescription: {
    fontSize: 13,
    color: '#bbb',
    marginBottom: 6,
    lineHeight: 18,
  },
  completedDescription: {
    color: '#777',
  },
  quizMeta: {
    flexDirection: 'row',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  quizCategory: {
    fontSize: 12,
    color: '#888',
    marginRight: 12,
    fontWeight: '500',
  },
  completedText: {
    color: '#666',
  },
  quizDifficulty: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 12,
  },
  questionCount: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  quizStatus: {
    fontSize: 14,
  },
  completedStatus: {
    color: '#4CAF50',
  },
  availableStatus: {
    color: '#999',
  },
  playButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  completedBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  achievementsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  achievementsText: {
    fontSize: 18,
    color: '#999',
  },
});
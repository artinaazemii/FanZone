import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileIcon from '../screens/ProfileIcon'; // Import the ProfileIcon component

/* Helper function to generate a team quiz with generic questions */
const createTeamQuiz = (id, name, homeStadium, foundingYear) => ({
  id,
  name,
  questions: [
    {
      id: '1',
      question: `What is ${name}'s home stadium?`,
      options: [homeStadium, 'Option 2', 'Option 3', 'Option 4'],
      correct: 0,
    },
    {
      id: '2',
      question: `In which year was ${name} founded?`,
      options: [foundingYear, 'Option 2', 'Option 3', 'Option 4'],
      correct: 0,
    },
  ],
});

/* ----- European Leagues Teams ----- */
// Premier League teams
const premierLeagueTeams = [
  createTeamQuiz('1', 'Arsenal', 'Emirates Stadium', '1886'),
  createTeamQuiz('2', 'Aston Villa', 'Villa Park', '1874'),
  createTeamQuiz('3', 'Brentford', 'Brentford Community Stadium', '1889'),
  createTeamQuiz('4', 'Brighton & Hove Albion', 'Amex Stadium', '1901'),
  createTeamQuiz('5', 'Burnley', 'Turf Moor', '1882'),
  createTeamQuiz('6', 'Chelsea', 'Stamford Bridge', '1905'),
  createTeamQuiz('7', 'Crystal Palace', 'Selhurst Park', '1905'),
  createTeamQuiz('8', 'Everton', 'Goodison Park', '1878'),
  createTeamQuiz('9', 'Fulham', 'Craven Cottage', '1879'),
  createTeamQuiz('10', 'Leeds United', 'Elland Road', '1919'),
  createTeamQuiz('11', 'Leicester City', 'King Power Stadium', '1884'),
  createTeamQuiz('12', 'Liverpool', 'Anfield', '1892'),
  createTeamQuiz('13', 'Manchester City', 'Etihad Stadium', '1880'),
  createTeamQuiz('14', 'Manchester United', 'Old Trafford', '1878'),
  createTeamQuiz('15', 'Newcastle United', "St James' Park", '1892'),
  createTeamQuiz('16', 'Nottingham Forest', 'City Ground', '1865'),
  createTeamQuiz('17', 'Southampton', "St Mary's Stadium", '1885'),
  createTeamQuiz('18', 'Tottenham Hotspur', 'Tottenham Hotspur Stadium', '1882'),
  createTeamQuiz('19', 'West Ham United', 'London Stadium', '1895'),
  createTeamQuiz('20', 'Wolverhampton Wanderers', 'Molineux Stadium', '1877'),
];

// La Liga teams
const laLigaTeams = [
  createTeamQuiz('1', 'Real Madrid', 'Santiago Bernabéu', '1902'),
  createTeamQuiz('2', 'Barcelona', 'Camp Nou', '1899'),
  createTeamQuiz('3', 'Atletico Madrid', 'Wanda Metropolitano', '1903'),
  createTeamQuiz('4', 'Sevilla', 'Ramón Sánchez Pizjuán', '1890'),
  createTeamQuiz('5', 'Real Betis', 'Benito Villamarín', '1907'),
  createTeamQuiz('6', 'Villarreal', 'El Madrigal', '1923'),
  createTeamQuiz('7', 'Athletic Bilbao', 'San Mamés', '1898'),
  createTeamQuiz('8', 'Real Sociedad', 'Anoeta', '1909'),
  createTeamQuiz('9', 'Celta Vigo', 'Estadio de Balaídos', '1923'),
  createTeamQuiz('10', 'Osasuna', 'El Sadar', '1920'),
  createTeamQuiz('11', 'Granada', 'Nuevo Los Cármenes', '1931'),
  createTeamQuiz('12', 'Valencia', 'Mestalla', '1919'),
  createTeamQuiz('13', 'Levante', 'Estadi Ciutat de València', '1909'),
  createTeamQuiz('14', 'Espanyol', 'RCDE Stadium', '1900'),
  createTeamQuiz('15', 'Rayo Vallecano', 'Campo de Fútbol de Vallecas', '1924'),
  createTeamQuiz('16', 'Elche', 'Estadio Manuel Martínez Valero', '1923'),
  createTeamQuiz('17', 'Almeria', 'Estadio de los Juegos Mediterráneos', '1989'),
  createTeamQuiz('18', 'Mallorca', 'Visit Mallorca Stadium', '1916'),
  createTeamQuiz('19', 'Getafe', 'Coliseum Alfonso Pérez', '1983'),
  createTeamQuiz('20', 'Cádiz', 'Nuevo Mirandilla', '1910'),
];

// Bundesliga teams
const bundesligaTeams = [
  createTeamQuiz('1', 'Bayern Munich', 'Allianz Arena', '1900'),
  createTeamQuiz('2', 'Borussia Dortmund', 'Signal Iduna Park', '1909'),
  createTeamQuiz('3', 'RB Leipzig', 'Red Bull Arena', '2009'),
  createTeamQuiz('4', 'Bayer Leverkusen', 'BayArena', '1904'),
  createTeamQuiz('5', 'Borussia Mönchengladbach', 'Borussia-Park', '1900'),
  createTeamQuiz('6', 'Eintracht Frankfurt', 'Deutsche Bank Park', '1899'),
  createTeamQuiz('7', 'VfL Wolfsburg', 'Volkswagen Arena', '1945'),
  createTeamQuiz('8', 'VfB Stuttgart', 'Mercedes-Benz Arena', '1893'),
  createTeamQuiz('9', 'Schalke 04', 'Veltins-Arena', '1904'),
  createTeamQuiz('10', 'Hertha BSC', 'Olympiastadion Berlin', '1892'),
  createTeamQuiz('11', '1899 Hoffenheim', 'PreZero Arena', '1899'),
  createTeamQuiz('12', 'Werder Bremen', 'Weserstadion', '1899'),
  createTeamQuiz('13', 'Union Berlin', 'Stadion An der Alten Försterei', '1966'),
  createTeamQuiz('14', 'FC Augsburg', 'WWK Arena', '1907'),
  createTeamQuiz('15', 'Arminia Bielefeld', 'SchücoArena', '1905'),
  createTeamQuiz('16', 'VfL Bochum', 'Vonovia-Ruhrstadion', '1848'),
  createTeamQuiz('17', 'SC Freiburg', 'Europa-Park Stadion', '1904'),
  createTeamQuiz('18', 'FC Köln', 'RheinEnergieStadion', '1948'),
];

// Serie A teams
const serieATeams = [
  createTeamQuiz('1', 'Juventus', 'Allianz Stadium', '1897'),
  createTeamQuiz('2', 'AC Milan', 'San Siro', '1899'),
  createTeamQuiz('3', 'Inter Milan', 'San Siro', '1908'),
  createTeamQuiz('4', 'Napoli', 'Stadio Diego Armando Maradona', '1926'),
  createTeamQuiz('5', 'Roma', 'Stadio Olimpico', '1927'),
  createTeamQuiz('6', 'Lazio', 'Stadio Olimpico', '1900'),
  createTeamQuiz('7', 'Fiorentina', 'Stadio Artemio Franchi', '1926'),
  createTeamQuiz('8', 'Atalanta', 'Gewiss Stadium', '1907'),
  createTeamQuiz('9', 'Torino', 'Stadio Olimpico Grande Torino', '1906'),
  createTeamQuiz('10', 'Sampdoria', 'Stadio Luigi Ferraris', '1946'),
  createTeamQuiz('11', 'Bologna', "Stadio Renato Dall'Ara", '1909'),
  createTeamQuiz('12', 'Verona', "Stadio Marc'Antonio Bentegodi", '1903'),
  createTeamQuiz('13', 'Sassuolo', 'Mapei Stadium – Città del Tricolore', '1920'),
  createTeamQuiz('14', 'Udinese', 'Stadio Friuli', '1896'),
  createTeamQuiz('15', 'Genoa', 'Stadio Luigi Ferraris', '1893'),
  createTeamQuiz('16', 'Empoli', 'Stadio Carlo Castellani', '1920'),
  createTeamQuiz('17', 'Cagliari', 'Sardegna Arena', '1920'),
  createTeamQuiz('18', 'Benevento', 'Stadio Ciro Vigorito', '1929'),
  createTeamQuiz('19', 'Spezia', 'Stadio Alberto Picco', '1906'),
  createTeamQuiz('20', 'Venezia', 'Stadio Pier Luigi Penzo', '1907'),
];

// Ligue 1 teams
const ligue1Teams = [
  createTeamQuiz('1', 'Paris Saint-Germain', 'Parc des Princes', '1970'),
  createTeamQuiz('2', 'Marseille', 'Stade Vélodrome', '1899'),
  createTeamQuiz('3', 'Lyon', 'Groupama Stadium', '1950'),
  createTeamQuiz('4', 'Monaco', 'Stade Louis II', '1924'),
  createTeamQuiz('5', 'Lille', 'Stade Pierre-Mauroy', '1944'),
  createTeamQuiz('6', 'Nice', 'Allianz Riviera', '1904'),
  createTeamQuiz('7', 'Bordeaux', 'Matmut Atlantique', '1881'),
  createTeamQuiz('8', 'Rennes', 'Roazhon Park', '1901'),
  createTeamQuiz('9', 'Reims', 'Stade Auguste-Delaune', '1910'),
  createTeamQuiz('10', 'Saint-Étienne', 'Stade Geoffroy-Guichard', '1919'),
  createTeamQuiz('11', 'Strasbourg', 'Stade de la Meinau', '1906'),
  createTeamQuiz('12', 'Nantes', 'Stade de la Beaujoire', '1943'),
  createTeamQuiz('13', 'Metz', 'Stade Saint-Symphorien', '1932'),
  createTeamQuiz('14', 'Lorient', 'Stade du Moustoir', '1926'),
  createTeamQuiz('15', 'Angers', 'Stade Raymond-Kopa', '1919'),
  createTeamQuiz('16', 'Brest', 'Stade Francis-Le Blé', '1950'),
  createTeamQuiz('17', 'Amiens', 'Stade de la Licorne', '1901'),
  createTeamQuiz('18', 'Clermont', 'Stade Gabriel-Montpied', '1911'),
];

/* ----- International Tournaments Teams ----- */
// World Cup (national teams)
const worldCupTeams = [
  createTeamQuiz('1', 'Brazil', 'Maracanã', '1914'),
  createTeamQuiz('2', 'Germany', 'Olympiastadion Berlin', '1900'),
  createTeamQuiz('3', 'Argentina', 'Estadio Monumental', '1893'),
  createTeamQuiz('4', 'France', 'Stade de France', '1919'),
  createTeamQuiz('5', 'Spain', 'Estadio La Cartuja', '1913'),
  createTeamQuiz('6', 'Italy', 'Stadio Olimpico', '1910'),
  createTeamQuiz('7', 'England', 'Wembley Stadium', '1923'),
  createTeamQuiz('8', 'Netherlands', 'Johan Cruyff Arena', '1996'),
];

// European Championship (national teams)
const europeanChampionshipTeams = [
  createTeamQuiz('1', 'Spain', 'Estadio La Cartuja', '1913'),
  createTeamQuiz('2', 'Italy', 'Stadio Olimpico', '1910'),
  createTeamQuiz('3', 'Germany', 'Olympiastadion Berlin', '1900'),
  createTeamQuiz('4', 'France', 'Stade de France', '1919'),
  createTeamQuiz('5', 'England', 'Wembley Stadium', '1923'),
  createTeamQuiz('6', 'Portugal', 'Estádio Nacional', '1914'),
  createTeamQuiz('7', 'Belgium', 'King Baudouin Stadium', '1930'),
  createTeamQuiz('8', 'Netherlands', 'Johan Cruyff Arena', '1996'),
];

/* ----- Top Tournaments Teams ----- */
// UEFA Champions League (club teams)
const championsLeagueTeams = [
  createTeamQuiz('1', 'Real Madrid', 'Santiago Bernabéu', '1902'),
  createTeamQuiz('2', 'Barcelona', 'Camp Nou', '1899'),
  createTeamQuiz('3', 'Bayern Munich', 'Allianz Arena', '1900'),
  createTeamQuiz('4', 'Liverpool', 'Anfield', '1892'),
  createTeamQuiz('5', 'Juventus', 'Allianz Stadium', '1897'),
  createTeamQuiz('6', 'Manchester City', 'Etihad Stadium', '1880'),
  createTeamQuiz('7', 'Paris Saint-Germain', 'Parc des Princes', '1970'),
  createTeamQuiz('8', 'AC Milan', 'San Siro', '1899'),
];

// Europa League (club teams)
const europaLeagueTeams = [
  createTeamQuiz('1', 'Sevilla', 'Ramón Sánchez Pizjuán', '1890'),
  createTeamQuiz('2', 'Inter Milan', 'San Siro', '1908'),
  createTeamQuiz('3', 'Arsenal', 'Emirates Stadium', '1886'),
  createTeamQuiz('4', 'West Ham United', 'London Stadium', '1895'),
  createTeamQuiz('5', 'Napoli', 'Stadio Diego Armando Maradona', '1926'),
  createTeamQuiz('6', 'Villarreal', 'El Madrigal', '1923'),
  createTeamQuiz('7', 'Benfica', 'Estádio da Luz', '1904'),
  createTeamQuiz('8', 'Olympique de Marseille', 'Stade Vélodrome', '1899'),
];

// Conference League (club teams)
const conferenceLeagueTeams = [
  createTeamQuiz('1', 'AS Roma', 'Stadio Olimpico', '1927'),
  createTeamQuiz('2', 'West Ham United', 'London Stadium', '1895'),
  createTeamQuiz('3', 'Fiorentina', 'Stadio Artemio Franchi', '1926'),
  createTeamQuiz('4', 'Bayer Leverkusen', 'BayArena', '1904'),
  createTeamQuiz('5', 'Eintracht Frankfurt', 'Deutsche Bank Park', '1899'),
  createTeamQuiz('6', 'Feyenoord', 'De Kuip', '1908'),
  createTeamQuiz('7', 'AC Milan', 'San Siro', '1899'),
  createTeamQuiz('8', 'Copenhagen', 'Parken Stadium', '1887'),
];

/* ----- Categories ----- */
const europeanLeagues = {
  title: 'European Leagues',
  quizzes: [
    { id: '1', league: 'Premier League', teams: premierLeagueTeams },
    { id: '2', league: 'La Liga', teams: laLigaTeams },
    { id: '3', league: 'Bundesliga', teams: bundesligaTeams },
    { id: '4', league: 'Serie A', teams: serieATeams },
    { id: '5', league: 'Ligue 1', teams: ligue1Teams },
  ],
};

const internationalTournaments = {
  title: 'International Tournaments',
  quizzes: [
    { id: '8', league: 'World Cup', teams: worldCupTeams },
    { id: '10', league: 'European Championship', teams: europeanChampionshipTeams },
  ],
};

const topTournaments = {
  title: 'Top Tournaments',
  quizzes: [
    { id: '9', league: 'UEFA Champions League', teams: championsLeagueTeams },
    { id: '11', league: 'Europa League', teams: europaLeagueTeams },
    { id: '12', league: 'Conference League', teams: conferenceLeagueTeams },
  ],
};

/* Combined categories */
const quizCategoriesData = [
  europeanLeagues,
  internationalTournaments,
  topTournaments,
];

/* ----- UI Components ----- */
// Component to render a single league/tournament (acts like a container)
const QuizCategory = ({ category, onSelectLeague }) => (
  <View style={styles.quizCategory}>
    <View style={styles.categoryHeader}>
      <Text style={styles.categoryTitle}>{category.title}</Text>
    </View>
    <View style={styles.quizGrid}>
      {category.quizzes.map((league) => (
        <TouchableOpacity
          key={league.id}
          style={styles.quizButton}
          onPress={() => onSelectLeague(league)}
        >
          <Text style={styles.quizText}>{league.league}</Text>
          {league.teams && (
            <Text style={styles.questionCount}>
              {league.teams.length} Teams
            </Text>
          )}
          {league.questions && !league.teams && (
            <Text style={styles.questionCount}>
              {league.questions.length} Questions
            </Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Component to render the list of categories and their leagues/tournaments
const QuizList = ({ categories, onSelectLeague }) => (
  <ScrollView style={styles.quizListContainer}>
    <Text style={styles.headerText}>Football Quiz Challenge</Text>
    {categories.map((category, index) => (
      <QuizCategory key={index} category={category} onSelectLeague={onSelectLeague} />
    ))}
  </ScrollView>
);

// Component to display list of teams for a given league/tournament
const TeamList = ({ league, onSelectTeam, onBack }) => (
  <ScrollView style={styles.teamListContainer}>
    <Text style={styles.headerText}>{league.league} Teams</Text>
    {league.teams.map((team) => (
      <TouchableOpacity
        key={team.id}
        style={styles.teamButton}
        onPress={() => onSelectTeam(team)}
      >
        <Text style={styles.teamText}>{team.name}</Text>
      </TouchableOpacity>
    ))}
    <TouchableOpacity style={styles.backButton} onPress={onBack}>
      <Text style={styles.backText}>Back to Leagues/Tournaments</Text>
    </TouchableOpacity>
  </ScrollView>
);

// Reusable QuizScreen component (used for both league and team quizzes)
const QuizScreen = ({ quiz, onQuit, backText }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!showFeedback && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, showFeedback]);

  const handleAnswerSelect = (selectedIndex) => {
    setSelectedOption(selectedIndex);
    setShowFeedback(true);
    if (quiz.questions[currentQuestion].correct === selectedIndex) {
      setScore(prevScore => prevScore + 1);
    }
    setTimeout(() => handleNextQuestion(), 2000);
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quiz.questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(10);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setTimeLeft(10);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  if (showScore) {
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.scoreText}>
          You scored {score} out of {quiz.questions.length}!
        </Text>
        <TouchableOpacity style={styles.backButton} onPress={resetQuiz}>
          <Text style={styles.backText}>Restart Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={onQuit}>
          <Text style={styles.backText}>{backText || 'Back'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <View style={styles.questionContainer}>
      <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>
      <Text style={styles.questionNumber}>
        Question {currentQuestion + 1} of {quiz.questions.length}
      </Text>
      <Text style={styles.questionText}>{question.question}</Text>
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => {
          let buttonStyle = styles.optionButton;
          if (showFeedback) {
            if (index === question.correct) {
              buttonStyle = styles.correctOption;
            } else if (index === selectedOption && index !== question.correct) {
              buttonStyle = styles.incorrectOption;
            }
          }
          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => handleAnswerSelect(index)}
              disabled={showFeedback}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={styles.backButton} onPress={onQuit}>
        <Text style={styles.backText}>{backText || 'Quit Quiz'}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main HomeScreen component managing navigation between category, team list, and quiz screens.
const HomeScreen = () => {
  // selectedLeague holds the league/tournament object when tapped.
  // selectedTeam holds the team object when chosen.
  // selectedQuiz holds a quiz for competitions without teams.
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const navigation = useNavigation();

  const handleSelectLeague = (league) => {
    if (league.teams) {
      setSelectedLeague(league);
    } else {
      setSelectedQuiz(league);
    }
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
  };

  const handleBackFromTeamList = () => {
    setSelectedLeague(null);
  };

  const handleBackFromQuiz = () => {
    if (selectedTeam) {
      setSelectedTeam(null);
    } else {
      setSelectedQuiz(null);
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      {/* Header with Profile Icon */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>Football Quiz</Text>
        <TouchableOpacity onPress={navigateToProfile} style={styles.profileIconContainer}>
          <ProfileIcon size={40} />
        </TouchableOpacity>
      </View>

      {selectedTeam ? (
        <QuizScreen quiz={selectedTeam} onQuit={handleBackFromQuiz} backText="Back to Teams" />
      ) : selectedLeague ? (
        <TeamList league={selectedLeague} onSelectTeam={handleSelectTeam} onBack={handleBackFromTeamList} />
      ) : selectedQuiz ? (
        <QuizScreen quiz={selectedQuiz} onQuit={handleBackFromQuiz} backText="Back to Categories" />
      ) : (
        <QuizList categories={quizCategoriesData} onSelectLeague={handleSelectLeague} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileIconContainer: {
    marginLeft: 'auto',
  },
  quizListContainer: {
    flex: 1,
    padding: 20,
  },
  teamListContainer: {
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
    shadowOffset: { width: 0, height: 2 },
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quizButton: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
    width: '48%',
  },
  quizText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  questionCount: {
    color: '#6c757d',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  teamButton: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  teamText: {
    color: '#1a1a1a',
    fontSize: 18,
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  questionNumber: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 10,
    textAlign: 'center',
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
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffc107',
    textAlign: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#28a745',
  },
  correctOption: {
    backgroundColor: '#28a745',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1c7430',
  },
  incorrectOption: {
    backgroundColor: '#f8d7da',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
});

export default HomeScreen;
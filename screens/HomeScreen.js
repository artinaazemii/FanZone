// HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileIcon from '../screens/ProfileIcon';

const { width, height } = Dimensions.get('window');

const createTeamQuiz = (id, name, stadium, year) => ({
  id,
  name,
  questions: [
    {
      id: '1',
      question: `What is ${name}'s home stadium?`,
      options: [stadium, 'Unknown A', 'Unknown B', 'Unknown C'],
      correct: 0
    },
    {
      id: '2',
      question: `In which year was ${name} founded?`,
      options: [year, '1900', '1950', '2000'],
      correct: 0
    }
  ]
});



const premierLeagueTeams = [
  createTeamQuiz('1','Arsenal','Emirates Stadium','1886'),
  createTeamQuiz('2','Aston Villa','Villa Park','1874'),
  createTeamQuiz('3','Brentford','Brentford Community Stadium','1889'),
  createTeamQuiz('4','Brighton & Hove Albion','Amex Stadium','1901'),
  createTeamQuiz('5','Burnley','Turf Moor','1882'),
  createTeamQuiz('6','Chelsea','Stamford Bridge','1905'),
  createTeamQuiz('7','Crystal Palace','Selhurst Park','1905'),
  createTeamQuiz('8','Everton','Goodison Park','1878'),
  createTeamQuiz('9','Fulham','Craven Cottage','1879'),
  createTeamQuiz('10','Leeds United','Elland Road','1919'),
  createTeamQuiz('11','Leicester City','King Power Stadium','1884'),
  createTeamQuiz('12','Liverpool','Anfield','1892'),
  createTeamQuiz('13','Manchester City','Etihad Stadium','1880'),
  createTeamQuiz('14','Manchester United','Old Trafford','1878'),
  createTeamQuiz('15','Newcastle United',"St James' Park",'1892'),
  createTeamQuiz('16','Nottingham Forest','City Ground','1865'),
  createTeamQuiz('17','Southampton',"St Mary's Stadium",'1885'),
  createTeamQuiz('18','Tottenham Hotspur','Tottenham Hotspur Stadium','1882'),
  createTeamQuiz('19','West Ham United','London Stadium','1895'),
  createTeamQuiz('20','Wolverhampton Wanderers','Molineux Stadium','1877')
];

const laLigaTeams = [
  createTeamQuiz('1','Real Madrid','Santiago Bernabéu','1902'),
  createTeamQuiz('2','Barcelona','Camp Nou','1899'),
  createTeamQuiz('3','Atletico Madrid','Wanda Metropolitano','1903'),
  createTeamQuiz('4','Sevilla','Ramón Sánchez Pizjuán','1890'),
  createTeamQuiz('5','Real Betis','Benito Villamarín','1907'),
  createTeamQuiz('6','Villarreal','El Madrigal','1923'),
  createTeamQuiz('7','Athletic Bilbao','San Mamés','1898'),
  createTeamQuiz('8','Real Sociedad','Anoeta','1909'),
  createTeamQuiz('9','Celta Vigo','Estadio de Balaídos','1923'),
  createTeamQuiz('10','Osasuna','El Sadar','1920'),
  createTeamQuiz('11','Granada','Nuevo Los Cármenes','1931'),
  createTeamQuiz('12','Valencia','Mestalla','1919'),
  createTeamQuiz('13','Levante','Ciutat de València','1909'),
  createTeamQuiz('14','Espanyol','RCDE Stadium','1900'),
  createTeamQuiz('15','Rayo Vallecano','Campo de Fútbol de Vallecas','1924'),
  createTeamQuiz('16','Elche','Manuel Martínez Valero','1923'),
  createTeamQuiz('17','Almería','Estadio de los Juegos Mediterráneos','1989'),
  createTeamQuiz('18','Mallorca','Visit Mallorca Stadium','1916'),
  createTeamQuiz('19','Getafe','Coliseum Alfonso Pérez','1983'),
  createTeamQuiz('20','Cádiz','Nuevo Mirandilla','1910')
];

const bundesligaTeams = [
  createTeamQuiz('1','Bayern Munich','Allianz Arena','1900'),
  createTeamQuiz('2','Borussia Dortmund','Signal Iduna Park','1909'),
  createTeamQuiz('3','RB Leipzig','Red Bull Arena','2009'),
  createTeamQuiz('4','Bayer Leverkusen','BayArena','1904'),
  createTeamQuiz('5','Borussia Mönchengladbach','Borussia-Park','1900'),
  createTeamQuiz('6','Eintracht Frankfurt','Deutsche Bank Park','1899'),
  createTeamQuiz('7','VfL Wolfsburg','Volkswagen Arena','1945'),
  createTeamQuiz('8','VfB Stuttgart','Mercedes-Benz Arena','1893'),
  createTeamQuiz('9','Schalke 04','Veltins-Arena','1904'),
  createTeamQuiz('10','Hertha BSC','Olympiastadion Berlin','1892'),
  createTeamQuiz('11','1899 Hoffenheim','PreZero Arena','1899'),
  createTeamQuiz('12','Werder Bremen','Weserstadion','1899'),
  createTeamQuiz('13','Union Berlin','Stadion An der Alten Försterei','1966'),
  createTeamQuiz('14','FC Augsburg','WWK Arena','1907'),
  createTeamQuiz('15','Arminia Bielefeld','SchücoArena','1905'),
  createTeamQuiz('16','VfL Bochum','Vonovia-Ruhrstadion','1848'),
  createTeamQuiz('17','SC Freiburg','Europa-Park Stadion','1904'),
  createTeamQuiz('18','1. FC Köln','RheinEnergieStadion','1948')
];

const serieATeams = [
  createTeamQuiz('1','Juventus','Allianz Stadium','1897'),
  createTeamQuiz('2','AC Milan','San Siro','1899'),
  createTeamQuiz('3','Inter Milan','San Siro','1908'),
  createTeamQuiz('4','Napoli','Stadio Diego Armando Maradona','1926'),
  createTeamQuiz('5','Roma','Stadio Olimpico','1927'),
  createTeamQuiz('6','Lazio','Stadio Olimpico','1900'),
  createTeamQuiz('7','Fiorentina','Stadio Artemio Franchi','1926'),
  createTeamQuiz('8','Atalanta','Gewiss Stadium','1907'),
  createTeamQuiz('9','Torino','Stadio Olimpico Grande Torino','1906'),
  createTeamQuiz('10','Sampdoria','Stadio Luigi Ferraris','1946'),
  createTeamQuiz('11','Bologna',"Stadio Renato Dall'Ara",'1909'),
  createTeamQuiz('12','Hellas Verona',"Stadio Marc'Antonio Bentegodi",'1903'),
  createTeamQuiz('13','Sassuolo','Mapei Stadium – Città del Tricolore','1920'),
  createTeamQuiz('14','Udinese','Stadio Friuli','1896'),
  createTeamQuiz('15','Genoa','Stadio Luigi Ferraris','1893'),
  createTeamQuiz('16','Empoli','Stadio Carlo Castellani','1920'),
  createTeamQuiz('17','Cagliari','Sardegna Arena','1920'),
  createTeamQuiz('18','Benevento','Stadio Ciro Vigorito','1929'),
  createTeamQuiz('19','Spezia','Stadio Alberto Picco','1906'),
  createTeamQuiz('20','Venezia','Stadio Pier Luigi Penzo','1907')
];

const ligue1Teams = [
  createTeamQuiz('1','Paris Saint-Germain','Parc des Princes','1970'),
  createTeamQuiz('2','Marseille','Stade Vélodrome','1899'),
  createTeamQuiz('3','Lyon','Groupama Stadium','1950'),
  createTeamQuiz('4','Monaco','Stade Louis II','1924'),
  createTeamQuiz('5','Lille','Stade Pierre-Mauroy','1944'),
  createTeamQuiz('6','Nice','Allianz Riviera','1904'),
  createTeamQuiz('7','Bordeaux','Matmut Atlantique','1881'),
  createTeamQuiz('8','Rennes','Roazhon Park','1901'),
  createTeamQuiz('9','Reims','Stade Auguste-Delaune','1910'),
  createTeamQuiz('10','Saint-Étienne','Stade Geoffroy-Guichard','1919'),
  createTeamQuiz('11','Strasbourg','Stade de la Meinau','1906'),
  createTeamQuiz('12','Nantes','Stade de la Beaujoire','1943'),
  createTeamQuiz('13','Metz','Stade Saint-Symphorien','1932'),
  createTeamQuiz('14','Lorient','Stade du Moustoir','1926'),
  createTeamQuiz('15','Angers','Stade Raymond-Kopa','1919'),
  createTeamQuiz('16','Brest','Stade Francis-Le Blé','1950'),
  createTeamQuiz('17','Amiens','Stade de la Licorne','1901'),
  createTeamQuiz('18','Clermont','Stade Gabriel-Montpied','1911'),
  createTeamQuiz('19','Montpellier','Stade de la Mosson','1974'),
  createTeamQuiz('20','Lens','Stade Bollaert-Delelis','1906')
];

const worldCupTeams = [
  createTeamQuiz('1','Brazil','Maracanã','1914'),
  createTeamQuiz('2','Germany','Olympiastadion Berlin','1900'),
  createTeamQuiz('3','Argentina','Estadio Monumental','1893'),
  createTeamQuiz('4','France','Stade de France','1919'),
  createTeamQuiz('5','Spain','Estadio La Cartuja','1913'),
  createTeamQuiz('6','Italy','Stadio Olimpico','1910'),
  createTeamQuiz('7','England','Wembley Stadium','1923'),
  createTeamQuiz('8','Netherlands','Johan Cruyff Arena','1996')
];

const europeanChampTeams = [
  createTeamQuiz('1','Spain','Estadio La Cartuja','1913'),
  createTeamQuiz('2','Italy','Stadio Olimpico','1910'),
  createTeamQuiz('3','Germany','Olympiastadion Berlin','1900'),
  createTeamQuiz('4','France','Stade de France','1919'),
  createTeamQuiz('5','England','Wembley Stadium','1923'),
  createTeamQuiz('6','Portugal','Estádio Nacional','1914'),
  createTeamQuiz('7','Belgium','King Baudouin Stadium','1930'),
  createTeamQuiz('8','Netherlands','Johan Cruyff Arena','1996')
];

const championsLeagueTeams = [
  createTeamQuiz('1','Real Madrid','Santiago Bernabéu','1902'),
  createTeamQuiz('2','Barcelona','Camp Nou','1899'),
  createTeamQuiz('3','Bayern Munich','Allianz Arena','1900'),
  createTeamQuiz('4','Liverpool','Anfield','1892'),
  createTeamQuiz('5','Juventus','Allianz Stadium','1897'),
  createTeamQuiz('6','Manchester City','Etihad Stadium','1880'),
  createTeamQuiz('7','Paris Saint-Germain','Parc des Princes','1970'),
  createTeamQuiz('8','AC Milan','San Siro','1899')
];

const europaLeagueTeams = [
  createTeamQuiz('1','Sevilla','Ramón Sánchez Pizjuán','1890'),
  createTeamQuiz('2','Inter Milan','San Siro','1908'),
  createTeamQuiz('3','Arsenal','Emirates Stadium','1886'),
  createTeamQuiz('4','West Ham United','London Stadium','1895'),
  createTeamQuiz('5','Napoli','Stadio Diego Armando Maradona','1926'),
  createTeamQuiz('6','Villarreal','El Madrigal','1923'),
  createTeamQuiz('7','Benfica','Estádio da Luz','1904'),
  createTeamQuiz('8','Marseille','Stade Vélodrome','1899')
];

const conferenceLeagueTeams = [
  createTeamQuiz('1','AS Roma','Stadio Olimpico','1927'),
  createTeamQuiz('2','West Ham United','London Stadium','1895'),
  createTeamQuiz('3','Fiorentina','Stadio Artemio Franchi','1926'),
  createTeamQuiz('4','Bayer Leverkusen','BayArena','1904'),
  createTeamQuiz('5','Eintracht Frankfurt','Deutsche Bank Park','1899'),
  createTeamQuiz('6','Feyenoord','De Kuip','1908'),
  createTeamQuiz('7','AC Milan','San Siro','1899'),
  createTeamQuiz('8','Copenhagen','Parken Stadium','1887')
];

const quizCategoriesData = [
  {
    title: 'European Leagues',
    quizzes: [
      { id:'1', league:'Premier League', teams: premierLeagueTeams },
      { id:'2', league:'La Liga',        teams: laLigaTeams       },
      { id:'3', league:'Bundesliga',     teams: bundesligaTeams   },
      { id:'4', league:'Serie A',        teams: serieATeams       },
      { id:'5', league:'Ligue 1',        teams: ligue1Teams       }
    ]
  },
  {
    title: 'International',
    quizzes: [
      { id:'6', league:'World Cup',        teams: worldCupTeams      },
      { id:'7', league:'Euro Championship',teams: europeanChampTeams }
    ]
  },
  {
    title: 'Top Tournaments',
    quizzes: [
      { id:'8',  league:'Champions League', teams: championsLeagueTeams  },
      { id:'9',  league:'Europa League',    teams: europaLeagueTeams     },
      { id:'10', league:'Conference League',teams: conferenceLeagueTeams }
    ]
  }
];
const QuizCategory = ({ category, onSelectLeague }) => (
  <View style={styles.quizCategory}>
    <Text style={styles.categoryTitle}>{category.title}</Text>
    <View style={styles.quizGrid}>
      {category.quizzes.map(l => (
        <TouchableOpacity
          key={l.id}
          style={styles.quizButton}
          onPress={() => onSelectLeague(l)}
        >
          <Text style={styles.quizText}>{l.league}</Text>
          <Text style={styles.countText}>{l.teams.length} Teams</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const QuizList = ({ categories, onSelectLeague }) => (
  <ScrollView style={styles.quizList}>
    {categories.map((cat, i) => (
      <QuizCategory key={i} category={cat} onSelectLeague={onSelectLeague} />
    ))}
  </ScrollView>
);

const TeamList = ({ league, onSelectTeam, onBack }) => (
  <View style={{ flex: 1 }}>
    <TouchableOpacity style={styles.backTop} onPress={onBack}>
      <Text style={styles.backTopText}>← Back</Text>
    </TouchableOpacity>
    <Text style={styles.teamHeader}>{league.league} Teams</Text>
    <ScrollView contentContainerStyle={styles.teamList}>
      {league.teams.map(t => (
        <TouchableOpacity
          key={t.id}
          style={styles.teamButton}
          onPress={() => onSelectTeam(t)}
        >
          <Text style={styles.teamName}>{t.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const QuizScreen = ({ quiz, onQuit, backText }) => {
  const [qIdx, setQIdx]         = useState(0);
  const [score, setScore]       = useState(0);
  const [finished, setFinished] = useState(false);
  const [time, setTime]         = useState(10);
  const [choice, setChoice]     = useState(null);
  const [feedback, setFeedback] = useState(false);

  useEffect(() => {
    if (!feedback && time > 0) {
      const t = setTimeout(() => setTime(t => t - 1), 1000);
      return () => clearTimeout(t);
    } else if (time === 0) nextQ();
  }, [time, feedback]);

  const answer = idx => {
    setChoice(idx);
    setFeedback(true);
    if (idx === quiz.questions[qIdx].correct) setScore(s => s + 1);
    setTimeout(nextQ, 1200);
  };

  const nextQ = () => {
    const nxt = qIdx + 1;
    if (nxt < quiz.questions.length) {
      setQIdx(nxt);
      setTime(10);
      setChoice(null);
      setFeedback(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <View style={styles.endContainer}>
        <Text style={styles.endText}>
          You scored {score}/{quiz.questions.length}
        </Text>
        <TouchableOpacity
          style={styles.endBtn}
          onPress={() => {
            setQIdx(0);
            setScore(0);
            setFinished(false);
            setTime(10);
          }}
        >
          <Text style={styles.endBtnText}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.endBtn} onPress={onQuit}>
          <Text style={styles.endBtnText}>{backText}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const q = quiz.questions[qIdx];
  return (
    <View style={styles.quizContainer}>
      <Text style={styles.timer}>Time: {time}s</Text>
      <Text style={styles.qNum}>
        Q{qIdx + 1}/{quiz.questions.length}
      </Text>
      <Text style={styles.qText}>{q.question}</Text>
      {q.options.map((opt, i) => {
        let btn = styles.optBtn;
        if (feedback) {
          if (i === q.correct) btn = styles.optCorrect;
          else if (i === choice) btn = styles.optWrong;
        }
        return (
          <TouchableOpacity
            key={i}
            style={btn}
            onPress={() => answer(i)}
            disabled={feedback}
          >
            <Text style={styles.optText}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity style={styles.quitBtn} onPress={onQuit}>
        <Text style={styles.quitText}>{backText}</Text>
      </TouchableOpacity>
    </View>
  );
};

// ---------------------------------------------
// MEMORY MATCH GAME

const MEMORY_TEAMS = [
  { id:'arsenal',    logo:'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Arsenal_FC.svg/800px-Arsenal_FC.svg.png' },
  { id:'barcelona',  logo:'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/800px-FC_Barcelona_%28crest%29.svg.png' },
  { id:'realmadrid', logo:'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/800px-Real_Madrid_CF.svg.png' },
  { id:'bayern',     logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Logo_FC_Bayern_M%C3%BCnchen_%282002%E2%80%932017%29.svg/800px-Logo_FC_Bayern_M%C3%BCnchen_%282002%E2%80%932017%29.svg.png' },
  { id:'liverpool',  logo:'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/800px-Liverpool_FC.svg.png' },
  { id:'psg',        logo:'https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/800px-Paris_Saint-Germain_F.C..svg.png' },
  { id:'mancity',    logo:'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/800px-Manchester_City_FC_badge.svg.png' },
  { id:'juventus',   logo:'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Juventus_Logo.png/800px-Juventus_Logo.png' },
  { id:'chelsea',    logo:'https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/800px-Chelsea_FC.svg.png' },
  { id:'tottenham',  logo:'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Tottenham_Hotspur.svg/800px-Tottenham_Hotspur.svg.png' }
];

const makeDeck = () => {
  const deck = [];
  MEMORY_TEAMS.forEach(t => {
    deck.push({ key: t.id+'a', team:t, flipped:false, matched:false });
    deck.push({ key: t.id+'b', team:t, flipped:false, matched:false });
  });
  return deck.sort(() => Math.random() - 0.5);
};

const MemoryMatchGame = ({ onQuit }) => {
  const [deck, setDeck]       = useState(makeDeck());
  const [first, setFirst]     = useState(null);
  const [second, setSecond]   = useState(null);
  const [lock, setLock]       = useState(false);
  const [matches, setMatches] = useState(0);

  const total = MEMORY_TEAMS.length * 2;
  const cols  = Math.ceil(Math.sqrt(total));
  const rows  = Math.ceil(total/cols);
  const M     = 8;
  const Hhdr  = 80;
  const avail = height - Hhdr;
  const wcard = (width - (cols+1)*M)/cols;
  const hcard = (avail - (rows+1)*M)/rows;
  const Csize = Math.floor(Math.min(wcard, hcard));

  const flipCard = idx => {
    if (lock || deck[idx].flipped || deck[idx].matched) return;
    const d = [...deck]; d[idx].flipped = true; setDeck(d);
    if (first === null) setFirst(idx);
    else { setSecond(idx); setLock(true); }
  };

  useEffect(() => {
    if (first !== null && second !== null) {
      const a = deck[first], b = deck[second];
      if (a.team.id === b.team.id) {
        const d = [...deck];
        d[first].matched = d[second].matched = true;
        setDeck(d);
        setMatches(m => m + 1);
        resetTurn();
      } else {
        setTimeout(() => {
          const d = [...deck];
          d[first].flipped = d[second].flipped = false;
          setDeck(d);
          resetTurn();
        }, 500);
      }
    }
  }, [second]);

  const resetTurn = () => {
    setFirst(null);
    setSecond(null);
    setLock(false);
  };

  if (matches === MEMORY_TEAMS.length) {
    return (
      <View style={styles.gameContainer}>
        <View style={styles.gameHeader}>
          <TouchableOpacity onPress={onQuit}>
            <Text style={styles.backTopText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.gameTitle}>Memory Match</Text>
          <View style={{ width: 60 }} />
        </View>
        <Text style={styles.winText}>🎉 You matched all teams!</Text>
        <TouchableOpacity style={styles.gameBtn} onPress={onQuit}>
          <Text style={styles.gameBtnText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.gameContainer}>
      <View style={styles.gameHeader}>
        <TouchableOpacity onPress={onQuit}>
          <Text style={styles.backTopText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.gameTitle}>Memory Match</Text>
        <View style={{ width: 60 }} />
      </View>
      <View style={styles.memoryContainer}>
        {deck.map((item, i) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.card,
              { width:Csize, height:Csize, margin:M/2 },
              item.flipped||item.matched ? styles.cardOn : styles.cardOff
            ]}
            onPress={() => flipCard(i)}
          >
            {(item.flipped||item.matched) && (
              <Image
                source={{ uri: item.team.logo, cache: 'force-cache' }}
                style={{ width: Csize-10, height: Csize-10, resizeMode: 'contain' }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ---------------------------------------------
// TAP-THE-BALL GAME

const BallTapGame = ({ onQuit }) => {
  const BALL = 80;
  const randomPos = () => ({
    left: Math.random() * (width - BALL),
    top:  Math.random() * (height - BALL - 150) + 150
  });

  const [pos, setPos]       = useState(randomPos());
  const [score, setScore]   = useState(0);
  const [timeLeft, setTime] = useState(10);
  const [over, setOver]     = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) { setOver(true); return; }
    const t = setTimeout(() => setTime(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft]);

  const tap = () => {
    setScore(s => s + 1);
    setPos(randomPos());
  };

  if (over) {
    return (
      <View style={styles.gameContainer}>
        <View style={styles.gameHeader}>
          <TouchableOpacity onPress={onQuit}>
            <Text style={styles.backTopText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.gameTitle}>Tap the Ball!</Text>
          <View style={{ width: 60 }} />
        </View>
        <Text style={styles.gameScore}>Your Score: {score}</Text>
        <TouchableOpacity style={styles.gameBtn} onPress={onQuit}>
          <Text style={styles.gameBtnText}>Back to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (  
    <View style={styles.gameContainer}>
      <View style={styles.gameHeader}>
        <TouchableOpacity onPress={onQuit}>
          <Text style={styles.backTopText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.gameTitle}>Tap the Ball!</Text>
        <View style={{ width: 60 }} />
      </View>
      <Text style={styles.gameScore}>Time: {timeLeft}s  Score: {score}</Text>
      <TouchableOpacity
        style={[styles.ball, { top:pos.top, left:pos.left, width:BALL, height:BALL }]}
        activeOpacity={0.7}
        onPress={tap}
      >
        <Text style={styles.ballText}>⚽️</Text>
      </TouchableOpacity>
    </View>
  );
};

// ---------------------------------------------
// MAIN HOME SCREEN

export default function HomeScreen() {
  const nav = useNavigation();
  const [selLeague, setSelLeague] = useState(null);
  const [selTeam,   setSelTeam]   = useState(null);
  const [selQuiz,   setSelQuiz]   = useState(null);
  const [playMem,   setPlayMem]   = useState(false);
  const [playBall,  setPlayBall]  = useState(false);

  const goProfile = () => nav.navigate('Profile');

  if (playMem)  return <MemoryMatchGame onQuit={() => setPlayMem(false)} />;
  if (playBall) return <BallTapGame     onQuit={() => setPlayBall(false)} />;

  if (selTeam) {
    return (
      <QuizScreen
        quiz={selTeam}
        onQuit={() => setSelTeam(null)}
        backText="Back to Teams"
      />
    );
  }

  if (selLeague) {
    return (
      <TeamList
        league={selLeague}
        onSelectTeam={setSelTeam}
        onBack={() => setSelLeague(null)}
      />
    );
  }

  if (selQuiz) {
    return (
      <QuizScreen
        quiz={selQuiz}
        onQuit={() => setSelQuiz(null)}
        backText="Back to Categories"
      />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
      </View>

      <QuizList
        categories={quizCategoriesData}
        onSelectLeague={l => (l.teams ? setSelLeague(l) : setSelQuiz(l))}
      />

      <TouchableOpacity style={styles.playBtn} onPress={() => setPlayMem(true)}>
        <Text style={styles.playBtnText}>🧠 Play Memory Match</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.playBtn} onPress={() => setPlayBall(true)}>
        <Text style={styles.playBtnText}>🏃‍♂️ Tap the Ball</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ---------------------------------------------
// STYLES

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#f5f5f5' },
  header:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title:            { fontSize: 20, fontWeight: 'bold' },

  quizList:         { padding: 16 },
  quizCategory:     { marginBottom: 24 },
  categoryTitle:    { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  quizGrid:         { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  quizButton:       { width: '48%', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center', elevation: 2 },
  quizText:         { fontSize: 16, fontWeight: '500' },
  countText:        { fontSize: 12, color: '#555', marginTop: 4 },

  backTop:          { padding: 12, backgroundColor: '#fff', elevation: 2 },
  backTopText:      { fontSize: 16, color: '#2196f3' },
  teamHeader:       { fontSize: 18, fontWeight: '600', textAlign: 'center', marginVertical: 12 },
  teamList:         { paddingHorizontal: 16 },
  teamButton:       { backgroundColor: '#fff', padding: 14, borderRadius: 8, marginVertical: 6, elevation: 1, alignItems: 'center' },
  teamName:         { fontSize: 16 },

  quizContainer:    { flex: 1, padding: 16, justifyContent: 'center' },
  timer:            { textAlign: 'center', color: '#e91e63', marginBottom: 4 },
  qNum:             { textAlign: 'center', color: '#777', marginBottom: 8 },
  qText:            { fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 16 },
  optBtn:           { backgroundColor: '#fff', padding: 12, marginVertical: 6, borderRadius: 8, elevation: 1 },
  optText:          { textAlign: 'center' },
  optCorrect:       { backgroundColor: '#c8e6c9', padding: 12, marginVertical: 6, borderRadius: 8 },
  optWrong:         { backgroundColor: '#ffcdd2', padding: 12, marginVertical: 6, borderRadius: 8 },
  quitBtn:          { marginTop: 16, backgroundColor: '#e91e63', padding: 12, borderRadius: 8, alignItems: 'center' },
  quitText:         { color: '#fff' },
  endContainer:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  endText:         { fontSize: 20, marginBottom: 20 },
  endBtn:          { backgroundColor: '#2196f3', padding: 12, borderRadius: 8 },
  endBtnText:      { color: '#fff' },

  gameHeader:      { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  gameTitle:       { fontSize: 24, fontWeight: '600' },

  gameContainer:   { flex: 1, alignItems: 'center', paddingTop: 20 },
  memoryContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' },
  card:            { borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  cardOff:         { backgroundColor: '#0288d1' },
  cardOn:          { backgroundColor: '#fff', borderWidth: 2, borderColor: '#0288d1' },
  winText:         { fontSize: 22, color: '#2e7d32', marginVertical: 20 },
  gameBtn:         { backgroundColor: '#0288d1', padding: 12, borderRadius: 8 },
  gameBtnText:     { color: '#fff' },

  ball:            { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  ballText:        { fontSize: 40 },
  gameScore:       { fontSize: 18, marginVertical: 8 },

  playBtn:         { backgroundColor: '#26a69a', padding: 14, margin: 20, borderRadius: 8, alignItems: 'center' },
  playBtnText:     { color: '#fff', fontSize: 18 }
});

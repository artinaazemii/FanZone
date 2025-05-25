import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  ScrollView,
  ImageBackground,
} from "react-native"
import { useNavigation } from "@react-navigation/native"

const { width, height } = Dimensions.get("window")

// Best European teams data with badge images
const europeanTeams = [
  {
    name: "Real Madrid",
    badge: "https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png",
    color: "#FFFFFF",
    league: "La Liga",
  },
  {
    name: "Barcelona",
    badge: "https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png",
    color: "#A50044",
    league: "La Liga",
  },
  {
    name: "Bayern Munich",
    badge: "https://logos-world.net/wp-content/uploads/2020/06/FC-Bayern-Munchen-Logo.png",
    color: "#DC052D",
    league: "Bundesliga",
  },
  {
    name: "PSG",
    badge: "https://logos-world.net/wp-content/uploads/2020/07/PSG-Logo.png",
    color: "#004170",
    league: "Ligue 1",
  },
  {
    name: "Manchester City",
    badge: "https://logos-world.net/wp-content/uploads/2020/06/Manchester-City-Logo.png",
    color: "#6CABDD",
    league: "Premier League",
  },
  {
    name: "Liverpool",
    badge: "https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo.png",
    color: "#C8102E",
    league: "Premier League",
  },
  {
    name: "Juventus",
    badge: "https://logos-world.net/wp-content/uploads/2020/06/Juventus-Logo.png",
    color: "#000000",
    league: "Serie A",
  },
  {
    name: "AC Milan",
    badge: "https://logos-world.net/wp-content/uploads/2020/11/Milan-Logo.png",
    color: "#FB090B",
    league: "Serie A",
  },
  {
    name: "Inter Milan",
    badge: "https://logos-world.net/wp-content/uploads/2021/04/FC-Internazionale-Milano-Logo.png",
    color: "#0068A8",
    league: "Serie A",
  },
  {
    name: "Chelsea",
    badge: "https://logos-world.net/wp-content/uploads/2020/05/Chelsea-Logo.png",
    color: "#034694",
    league: "Premier League",
  },
  {
    name: "Arsenal",
    badge: "https://logos-world.net/wp-content/uploads/2020/05/Arsenal-Logo.png",
    color: "#DC143C",
    league: "Premier League",
  },
  {
    name: "Atletico Madrid",
    badge: "https://logos-world.net/wp-content/uploads/2020/06/atletico-madrid-Logo.png",
    color: "#CE3524",
    league: "La Liga",
  },
  {
    name: "Borussia Dortmund",
    badge: "https://logos-world.net/wp-content/uploads/2020/11/Borussia-Dortmund-Logo.png",
    color: "#FDE100",
    league: "Bundesliga",
  },
  {
    name: "Manchester United",
    badge: "https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-logo.png",
    color: "#087FD1",
    league: "Premier League",
  },
  {
    name: "Tottenham",
    badge: "https://logos-world.net/wp-content/uploads/2020/06/Tottenham-Hotspur-Logo.png",
    color: "#132257",
    league: "Premier League",
  },
  {
    name: "Ajax",
    badge: "https://logos-world.net/wp-content/uploads/2020/06/Ajax-Logo.png",
    color: "#D2122E",
    league: "Eredivisie",
  },
]
export default function MatchingPairsScreen() {
  const navigation = useNavigation()
  const [currentScreen, setCurrentScreen] = useState("menu")
  const [showGuide, setShowGuide] = useState(false)
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(50)
  const [gameActive, setGameActive] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [cardFlipAnimations, setCardFlipAnimations] = useState({})

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  // Initialize game
  const initializeGame = () => {
    const gameCards = []
    const selectedTeams = europeanTeams.slice(0, 12)

    selectedTeams.forEach((team, index) => {
      gameCards.push({ id: index * 2, team, flipped: false, matched: false })
      gameCards.push({ id: index * 2 + 1, team, flipped: false, matched: false })
    })

    const shuffledCards = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedCards([])
    setScore(0)
    setTimer(50)
    setGameActive(true)
    setGameStarted(true)

    // Initialize flip animations for all cards
    const animations = {}
    shuffledCards.forEach((card) => {
      animations[card.id] = new Animated.Value(0)
    })
    setCardFlipAnimations(animations)
  }

  // Timer effect
  useEffect(() => {
    let interval
    if (gameActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
    } else if (timer === 0 && gameStarted) {
      setGameActive(false)
    }
    return () => clearInterval(interval)
  }, [gameActive, timer, gameStarted])

  // Handle card flip
  const handleCardFlip = (cardId) => {
    if (!gameActive || flippedCards.length >= 2) return

    const card = cards.find((c) => c.id === cardId)
    if (card.flipped || card.matched) return

    // Start flip animation
    const flipAnimation = cardFlipAnimations[cardId]
    if (!flipAnimation) return

    Animated.timing(flipAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find((c) => c.id === firstId)
      const secondCard = cards.find((c) => c.id === secondId)

      if (firstCard.team.name === secondCard.team.name) {
        // Match found - keep cards flipped
        setTimeout(() => {
          setMatchedCards((prev) => [...prev, firstId, secondId])
          setScore((prev) => prev + 10)
          setFlippedCards([])
        }, 600)
      } else {
        // No match - flip cards back
        setTimeout(() => {
          // Animate cards back to original position
          Animated.timing(cardFlipAnimations[firstId], {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }).start()

          Animated.timing(cardFlipAnimations[secondId], {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }).start()

          setFlippedCards([])
        }, 1000)
      }
    }
  }

  const startGame = () => {
    setCurrentScreen("game")
    initializeGame()
  }

  const goBack = () => {
    if (currentScreen === "menu") {
      navigation.goBack()
    } else {
      setCurrentScreen("menu")
      setGameActive(false)
      setGameStarted(false)
    }
  }

  // Menu Screen
  if (currentScreen === "menu") {
    return (
      <ImageBackground
        source={{
          uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-rzgiMfI2oNmM3iWiTLpP4ImTU50snn.jpeg",
        }}
        style={styles.container}
        resizeMode="cover"
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

        {/* Dark overlay for better text readability */}
        <View style={styles.overlay} />

        {/* Animated Content */}
        <Animated.View
          style={[
            styles.menuContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Back Button */}
          <TouchableOpacity style={styles.modernBackButton} onPress={goBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.mainTitle}>Matching Pairs</Text>
            <Text style={styles.description}>
              The objective is to collect the most pairs of cards. Watch out, time is limited
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowGuide(true)} activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>QUICK START GUIDE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={startGame} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>PLAY</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Guide Modal */}
        <Modal visible={showGuide} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modernModal}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Match Rules</Text>
                  <TouchableOpacity onPress={() => setShowGuide(false)} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.guideContent}>
                  <View style={styles.guideStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>1</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepTitle}>Flip the Cards</Text>
                      <Text style={styles.stepDescription}>
                        Tap any card to reveal the European club badge underneath
                      </Text>
                    </View>
                  </View>

                  <View style={styles.guideStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>2</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepTitle}>Find Matches</Text>
                      <Text style={styles.stepDescription}>
                        Match two cards with the same club badge to score points
                      </Text>
                    </View>
                  </View>

                  <View style={styles.guideStep}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>3</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepTitle}>Beat the Clock</Text>
                      <Text style={styles.stepDescription}>Find all 12 pairs before the 50-second timer runs out</Text>
                    </View>
                  </View>

                  <View style={styles.scoringInfo}>
                    <Text style={styles.scoringTitle}>Featured Leagues</Text>
                    <Text style={styles.scoringText}>• Premier League (England)</Text>
                    <Text style={styles.scoringText}>• La Liga (Spain)</Text>
                    <Text style={styles.scoringText}>• Serie A (Italy)</Text>
                    <Text style={styles.scoringText}>• Bundesliga (Germany)</Text>
                    <Text style={styles.scoringText}>• Ligue 1 (France)</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.gotItButton} onPress={() => setShowGuide(false)}>
                  <Text style={styles.gotItButtonText}>Got It!</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    )
  }

  // Game Screen
  return (
    <View style={styles.gameContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1a2332" />

      <Animated.View style={[styles.gameContent, { opacity: fadeAnim }]}>
        {/* Game Header */}
        <View style={styles.gameHeader}>
          <TouchableOpacity onPress={goBack} style={styles.gameBackButton}>
            <Text style={styles.gameBackText}>←</Text>
          </TouchableOpacity>

          <View style={styles.gameStats}>
            <View style={styles.timerContainer}>
              <Text style={styles.timerLabel}>TIME</Text>
              <Text style={[styles.timerText, timer <= 10 && styles.timerWarning]}>{timer}s</Text>
            </View>

            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>SCORE</Text>
              <Text style={styles.scoreText}>{score}</Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(matchedCards.length / 24) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{matchedCards.length / 2}/12 pairs found</Text>
        </View>

        {/* Scrollable Game Grid */}
        <ScrollView
          style={styles.gameScrollView}
          contentContainerStyle={styles.gameGridContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gameGrid}>
            {cards.map((card, index) => {
              const isFlipped = flippedCards.includes(card.id) || matchedCards.includes(card.id)
              const flipAnimation = cardFlipAnimations[card.id] || new Animated.Value(0)

              // Create interpolated values for smooth flip
              const frontInterpolate = flipAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "180deg"],
              })

              const backInterpolate = flipAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ["180deg", "360deg"],
              })

              const frontOpacity = flipAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 0, 0],
              })

              const backOpacity = flipAnimation.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0, 1],
              })

              return (
                <TouchableOpacity
                  key={card.id}
                  style={styles.cardContainer}
                  onPress={() => handleCardFlip(card.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardWrapper}>
                    {/* Card Back (default state) */}
                    <Animated.View
                      style={[
                        styles.card,
                        styles.cardFace,
                        {
                          opacity: frontOpacity,
                          transform: [{ rotateY: frontInterpolate }],
                        },
                      ]}
                    >
                      <View style={styles.cardBack}>
                        <Text style={styles.cardBackIcon}>⚽</Text>
                      </View>
                    </Animated.View>

                    {/* Card Front (flipped state) */}
                    <Animated.View
                      style={[
                        styles.card,
                        styles.cardFace,
                        styles.cardFaceBack,
                        {
                          opacity: backOpacity,
                          transform: [{ rotateY: backInterpolate }],
                        },
                      ]}
                    >
                      <View style={styles.cardFlippedContent}>
                        <Image source={{ uri: card.team.badge }} style={styles.badgeImage} resizeMode="contain" />
                        <Text style={styles.teamName}>{card.team.name}</Text>
                        <Text style={styles.leagueName}>{card.team.league}</Text>
                      </View>
                    </Animated.View>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Game Over Modal */}
      {!gameActive && gameStarted && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.gameOverModal}>
              <View style={styles.gameOverHeader}>
                <Text style={styles.gameOverIcon}>{matchedCards.length === 24 ? "🏆" : "⏰"}</Text>
                <Text style={styles.gameOverTitle}>{matchedCards.length === 24 ? "Perfect Match!" : "Full Time!"}</Text>
                <Text style={styles.gameOverSubtitle}>
                  {matchedCards.length === 24
                    ? "You matched all European teams!"
                    : `You found ${matchedCards.length / 2} out of 12 pairs`}
                </Text>
              </View>

              <View style={styles.finalStats}>
                <View style={styles.finalStatItem}>
                  <Text style={styles.finalStatNumber}>{score}</Text>
                  <Text style={styles.finalStatLabel}>Final Score</Text>
                </View>
                <View style={styles.finalStatItem}>
                  <Text style={styles.finalStatNumber}>{matchedCards.length / 2}</Text>
                  <Text style={styles.finalStatLabel}>Pairs Found</Text>
                </View>
                <View style={styles.finalStatItem}>
                  <Text style={styles.finalStatNumber}>{50 - timer}s</Text>
                  <Text style={styles.finalStatLabel}>Time Used</Text>
                </View>
              </View>

              {matchedCards.length > 0 && (
                <View style={styles.matchedTeamsContainer}>
                  <Text style={styles.matchedTeamsTitle}>Teams Matched</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.matchedTeamsList}>
                    {cards
                      .filter((card) => matchedCards.includes(card.id))
                      .filter((card, index, arr) => arr.findIndex((c) => c.team.name === card.team.name) === index)
                      .map((card, index) => (
                        <View key={index} style={styles.matchedTeamItem}>
                          <Image source={{ uri: card.team.badge }} style={styles.smallBadge} resizeMode="contain" />
                        </View>
                      ))}
                  </ScrollView>
                </View>
              )}

              <View style={styles.gameOverButtons}>
                <TouchableOpacity style={styles.playAgainButton} onPress={startGame}>
                  <Text style={styles.playAgainText}>Play Again</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuButton} onPress={goBack}>
                  <Text style={styles.menuButtonText}>Main Menu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  menuContent: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
    zIndex: 10,
  },
  modernBackButton: {
    position: "absolute",
    top: 60,
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  backIcon: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40, // Reduced from 60
    marginTop: 40, // Add top margin
  },
  mainTitle: {
    fontSize: 36, // Reduced from 42
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 16, // Reduced from 18
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    lineHeight: 24, // Reduced from 26
    paddingHorizontal: 20,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: "#ffffff",
    borderRadius: 22, // Reduced from 25
    paddingVertical: 14, // Reduced from 18
    paddingHorizontal: 28, // Reduced from 32
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 16, // Reduced from 18
    fontWeight: "bold",
    color: "#333333",
  },
  secondaryButton: {
    borderRadius: 22, // Reduced from 25
    borderWidth: 2,
    borderColor: "#ffffff",
    paddingVertical: 12, // Reduced from 16
    alignItems: "center",
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    fontSize: 14, // Reduced from 16
    color: "#ffffff",
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modernModal: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#666",
  },
  guideContent: {
    marginBottom: 24,
  },
  guideStep: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1976d2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  scoringInfo: {
    backgroundColor: "rgba(25, 118, 210, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  scoringTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 8,
  },
  scoringText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  gotItButton: {
    backgroundColor: "#1976d2",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  gotItButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  gameContainer: {
    flex: 1,
    backgroundColor: "#1a2332",
  },
  gameContent: {
    flex: 1,
    paddingTop: 60,
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  gameBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  gameBackText: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
  },
  gameStats: {
    flexDirection: "row",
    gap: 20,
  },
  timerContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timerLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  timerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  timerWarning: {
    color: "#FF6B6B",
  },
  scoreContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scoreLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  progressContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginTop: 8,
  },
  gameScrollView: {
    flex: 1,
  },
  gameGridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  gameGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  cardContainer: {
    width: (width - 80) / 4,
    height: (width - 80) / 4,
    margin: 4,
  },
  card: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardFlipped: {
    transform: [{ scaleX: 1.02 }, { scaleY: 1.02 }],
  },
  cardFlippedContent: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  cardBack: {
    flex: 1,
    backgroundColor: "#2c3e50",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  cardBackIcon: {
    fontSize: 20,
    color: "#ffffff",
    marginBottom: 4,
  },
  badgeImage: {
    width: "70%",
    height: "60%",
    marginBottom: 4,
  },
  teamName: {
    fontSize: 9,
    color: "#333333",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 2,
  },
  leagueName: {
    fontSize: 7,
    color: "#666666",
    textAlign: "center",
  },
  gameOverModal: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "90%",
    maxHeight: "80%",
  },
  gameOverHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  gameOverIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  gameOverTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
  },
  gameOverSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  finalStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 32,
    backgroundColor: "rgba(25, 118, 210, 0.1)",
    borderRadius: 16,
    paddingVertical: 20,
  },
  finalStatItem: {
    alignItems: "center",
  },
  finalStatNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 4,
  },
  finalStatLabel: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  matchedTeamsContainer: {
    width: "100%",
    marginBottom: 32,
  },
  matchedTeamsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 16,
    textAlign: "center",
  },
  matchedTeamsList: {
    maxHeight: 60,
  },
  matchedTeamItem: {
    width: 48,
    height: 48,
    backgroundColor: "#f8f9fa",
    borderRadius: 24,
    padding: 8,
    marginRight: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  smallBadge: {
    width: "100%",
    height: "100%",
  },
  gameOverButtons: {
    width: "100%",
    gap: 12,
  },
  playAgainButton: {
    backgroundColor: "#1976d2",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  playAgainText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  menuButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#1976d2",
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  menuButtonText: {
    fontSize: 16,
    color: "#1976d2",
    fontWeight: "600",
  },
  cardWrapper: {
    flex: 1,
    position: "relative",
  },
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden",
  },
  cardFaceBack: {
    transform: [{ rotateY: "180deg" }],
  },
})
"use client"
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
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useCoins } from "../context/CoinContext"
import AsyncStorage from "@react-native-async-storage/async-storage"

const { width } = Dimensions.get("window")

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
]

const COOLDOWN_HOURS = 12
const COOLDOWN_KEY = "matching_pairs_cooldown"

export default function MatchingPairsScreen() {
  const navigation = useNavigation()
  const [currentScreen, setCurrentScreen] = useState("menu")
  const [gameMode, setGameMode] = useState("fun")
  const [showGuide, setShowGuide] = useState(false)
  const [cards, setCards] = useState([])
  const [flippedCards, setFlippedCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [score, setScore] = useState(0)
  const { coins, addCoins, spendCoins } = useCoins()
  const [timer, setTimer] = useState(50)
  const [gameActive, setGameActive] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [cardFlipAnimations, setCardFlipAnimations] = useState({})
  const [cooldownEndTime, setCooldownEndTime] = useState(null)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
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

    checkCooldown()
  }, [])

  const checkCooldown = async () => {
    try {
      const cooldownData = await AsyncStorage.getItem(COOLDOWN_KEY)
      if (cooldownData) {
        const endTime = Number.parseInt(cooldownData)
        if (Date.now() < endTime) {
          setCooldownEndTime(endTime)
        } else {
          await AsyncStorage.removeItem(COOLDOWN_KEY)
        }
      }
    } catch (error) {
      console.error("Error checking cooldown:", error)
    }
  }
  const setCooldown = async () => {
    try {
      const endTime = Date.now() + COOLDOWN_HOURS * 60 * 60 * 1000
      await AsyncStorage.setItem(COOLDOWN_KEY, endTime.toString())
      setCooldownEndTime(endTime)
    } catch (error) {
      console.error("Error setting cooldown:", error)
    }
  }
  const canPlayCoinMode = () => {
    return coins >= 10 && (!cooldownEndTime || Date.now() >= cooldownEndTime)
  }
  const getRemainingCooldownTime = () => {
    if (!cooldownEndTime) return null
    const remaining = cooldownEndTime - Date.now()
    if (remaining <= 0) return null

    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const initializeGame = async (selectedMode) => {
    const gameCards = []
    europeanTeams.slice(0, 12).forEach((team, index) => {
      gameCards.push({ id: index * 2, team, flipped: false, matched: false })
      gameCards.push({ id: index * 2 + 1, team, flipped: false, matched: false })
    })
    const shuffled = gameCards.sort(() => Math.random() - 0.5)

    setCards(shuffled)
    setFlippedCards([])
    setMatchedCards([])
    setScore(0)
    setTimer(90)
    setGameMode(selectedMode)
    setGameActive(true)
    setGameStarted(true)
    if (selectedMode === "coins") {
      await spendCoins(10)
      await setCooldown()
    }

    const animations = {}
    shuffled.forEach((c) => (animations[c.id] = new Animated.Value(0)))
    setCardFlipAnimations(animations)
  }

  useEffect(() => {
    let interval
    if (gameActive && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000)
    } else if (timer === 0 && gameStarted) {
      setGameActive(false)
    }
    return () => clearInterval(interval)
  }, [gameActive, timer, gameStarted])

  const handleCardFlip = (cardId) => {
    if (!gameActive || flippedCards.length >= 2) return
    const card = cards.find((c) => c.id === cardId)
    if (card.flipped || card.matched) return

    const flipAnim = cardFlipAnimations[cardId]
    Animated.timing(flipAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start()

    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped
      const first = cards.find((c) => c.id === firstId)
      const second = cards.find((c) => c.id === secondId)

      if (first.team.name === second.team.name) {
        setTimeout(() => {
          setMatchedCards((prev) => {
            const updated = [...prev, firstId, secondId]
            if (updated.length === europeanTeams.slice(0, 12).length * 2) {
              setGameActive(false)
            }
            return updated
          })
          setScore((prev) => prev + 10)
          setFlippedCards([])
        }, 600)
      } else {
        setTimeout(() => {
          Animated.timing(cardFlipAnimations[firstId], { toValue: 0, duration: 600, useNativeDriver: true }).start()
          Animated.timing(cardFlipAnimations[secondId], { toValue: 0, duration: 600, useNativeDriver: true }).start()
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  useEffect(() => {
    if (
      !gameActive &&
      gameStarted &&
      matchedCards.length === europeanTeams.slice(0, 12).length * 2 &&
      gameMode === "coins"
    ) {
      addCoins(20)
    }
  }, [gameActive, gameStarted, matchedCards.length, gameMode])

  const startGame = (mode) => {
    if (mode === "coins" && !canPlayCoinMode()) {
      if (coins < 10) {
        Alert.alert("Not Enough Coins", "You need 10 coins to play this mode.", [{ text: "OK" }])
      } else {
        Alert.alert("Cooldown Active", `You can play coin mode again in ${getRemainingCooldownTime()}`, [
          { text: "OK" },
        ])
      }
      return
    }

    setCurrentScreen("game")
    initializeGame(mode)
  }

  const goBack = () => {
    if (currentScreen === "menu") navigation.goBack()
    else if (currentScreen === "game") {
      setCurrentScreen("mode-select")
      setGameActive(false)
      setGameStarted(false)
    } else setCurrentScreen("menu")
  }

  if (coins === null)
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center", backgroundColor: "#1a2332" }]}>
        <Text style={{ color: "#fff", fontSize: 18 }}>Loading...</Text>
      </View>
    )

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
        <View style={styles.overlay} />

        <Animated.View
          style={[
            styles.menuContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity style={styles.modernBackButton} onPress={goBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Text style={styles.mainTitle}>Matching Pairs</Text>
            <Text style={styles.description}>
              The objective is to collect the most pairs of cards. Watch out, time is limited
            </Text>

            {cooldownEndTime && Date.now() < cooldownEndTime && (
              <View style={styles.cooldownContainer}>
                <Text style={styles.cooldownText}>⏰ Coin mode available in: {getRemainingCooldownTime()}</Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowGuide(true)} activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>QUICK START GUIDE</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setCurrentScreen("mode-select")}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>PLAY</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

    
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
                    <Text style={styles.scoringTitle}>Game Modes</Text>
                    <Text style={styles.scoringText}>• Play for Fun - Free practice mode, play anytime</Text>
                    <Text style={styles.scoringText}>• Play to Win Coins - Costs 10 coins, once every 12 hours</Text>
                    <Text style={styles.scoringText}>• Complete coin mode to earn 20 coins</Text>
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

  if (currentScreen === "mode-select") {
    return (
      <ImageBackground
        source={{
          uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/background-rzgiMfI2oNmM3iWiTLpP4ImTU50snn.jpeg",
        }}
        style={styles.container}
        resizeMode="cover"
      >
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <View style={styles.overlay} />

        <Animated.View style={[styles.menuContent, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.modernBackButton} onPress={goBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerContainer}>
            <Text style={styles.mainTitle}>Choose Game Mode</Text>
            <Text style={styles.description}>Select how you want to play</Text>
          </View>

          <View style={styles.modeContainer}>
            {/* Play for Fun Mode */}
            <TouchableOpacity style={styles.modeCard} onPress={() => startGame("fun")} activeOpacity={0.8}>
              <View style={styles.modeIcon}>
                <Text style={styles.modeIconText}>🎮</Text>
              </View>
              <Text style={styles.modeTitle}>Play for Fun</Text>
              <Text style={styles.modeDescription}>
                Enjoy the game with no stakes. Perfect your skills and have fun matching European football clubs!
              </Text>
              <View style={styles.modeBadge}>
                <Text style={styles.modeBadgeText}>Free to Play</Text>
              </View>
            </TouchableOpacity>

            {/* Play to Win Coins Mode */}
            <TouchableOpacity
              style={[styles.modeCard, !canPlayCoinMode() && styles.modeCardDisabled]}
              onPress={() => startGame("coins")}
              activeOpacity={canPlayCoinMode() ? 0.8 : 1}
            >
              <View style={styles.modeIcon}>
                <Text style={styles.modeIconText}>🪙</Text>
              </View>
              <Text style={styles.modeTitle}>Play to Win Coins</Text>
              <Text style={styles.modeDescription}>
                Risk 10 coins to play. Complete the game to earn a 20 coin bonus reward!
                {!canPlayCoinMode() && coins < 10 && "\n\n⚠️ You need 10 coins to play this mode."}
                {!canPlayCoinMode() && coins >= 10 && `\n\n⏰ Available in ${getRemainingCooldownTime()}`}
              </Text>
              <View style={styles.coinInfo}>
                <View style={styles.modeBadge}>
                  <Text style={styles.modeBadgeText}>Entry: 10 coins</Text>
                </View>
                <View style={[styles.modeBadge, styles.coinsBadge]}>
                  <Text style={styles.coinsBadgeText}>You have: {coins} coins</Text>
                </View>
              </View>
              {!canPlayCoinMode() && coins < 10 && (
                <Text style={styles.insufficientCoinsText}>❌ Not enough coins</Text>
              )}
              {!canPlayCoinMode() && coins >= 10 && <Text style={styles.insufficientCoinsText}>⏰ On cooldown</Text>}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ImageBackground>
    )
  }

  return (
    <View style={styles.gameContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#1a2332" />

      <Animated.View style={[styles.gameContent, { opacity: fadeAnim }]}>
     
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

            {gameMode === "coins" && (
              <View style={styles.coinsContainer}>
                <Text style={styles.coinsLabel}>COINS</Text>
                <Text style={styles.coinsText}>{coins}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(matchedCards.length / 24) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{matchedCards.length / 2}/12 pairs found</Text>
        </View>

        <ScrollView
          style={styles.gameScrollView}
          contentContainerStyle={styles.gameGridContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gameGrid}>
            {cards.map((card, index) => {
              const isFlipped = flippedCards.includes(card.id) || matchedCards.includes(card.id)
              const flipAnimation = cardFlipAnimations[card.id] || new Animated.Value(0)

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
                    {/* Card Back */}
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

                    {/* Card Front */}
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

      {!gameActive && gameStarted && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.gameOverModal}>
              <View style={styles.gameOverHeader}>
                <Text style={styles.gameOverIcon}>{matchedCards.length === 24 ? "🏆" : timer === 0 ? "⏰" : "🎯"}</Text>
                <Text style={styles.gameOverTitle}>
                  {matchedCards.length === 24 ? "Perfect Match!" : timer === 0 ? "Time's Up!" : "Game Over"}
                </Text>
                <Text style={styles.gameOverSubtitle}>
                  {matchedCards.length === 24
                    ? "You matched all European teams!"
                    : `You found ${matchedCards.length / 2} out of 12 pairs`}
                </Text>
              </View>

              <View style={styles.statsRow}>
  <View style={styles.statsCol}>
    <Text style={styles.statsValue}>{score}</Text>
    <Text style={styles.statsLabel}>Score</Text>
  </View>
  <View style={styles.statsCol}>
    <Text style={styles.statsValue}>{matchedCards.length / 2}</Text>
    <Text style={styles.statsLabel}>Pairs</Text>
  </View>
  <View style={styles.statsCol}>
    <Text style={styles.statsValue}>{50 - timer}s</Text>
    <Text style={styles.statsLabel}>Time</Text>
  </View>
</View>


              {gameMode === "coins" && matchedCards.length === 24 && (
                <View style={styles.coinRewardsContainer}>
                  <Text style={styles.coinRewardsTitle}>🪙 Coin Rewards</Text>
                  <Text style={styles.coinRewardsText}>Completion Bonus: +20 coins</Text>
                  <Text style={styles.totalCoinsText}>Total Coins: {coins}</Text>
                </View>
              )}

              <View style={styles.gameOverButtons}>
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
  statsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  backgroundColor: 'rgba(25,118,210,0.08)',
  borderRadius: 18,
  paddingVertical: 18,
  paddingHorizontal: 4,
  marginTop: 10,
  marginBottom: 24,
},
statsCol: {
  flex: 1,
  alignItems: 'center',
  minWidth: 85,
},
statsValue: {
  fontSize: 26,
  fontWeight: 'bold',
  color: '#1976d2',
  marginBottom: 3,
  textAlign: 'center',
},
statsLabel: {
  fontSize: 13,
  color: '#444',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  textAlign: 'center',
},

  backIcon: {
    fontSize: 20,
    color: "#ffffff",
    fontWeight: "bold",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 40,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.7)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.95)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cooldownContainer: {
    backgroundColor: "rgba(255, 152, 0, 0.2)",
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 152, 0, 0.3)",
  },
  cooldownText: {
    color: "#FF9800",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
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
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  secondaryButton: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#ffffff",
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "600",
  },
  modeContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  modeCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modeCardDisabled: {
    opacity: 0.6,
  },
  modeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(25, 118, 210, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modeIconText: {
    fontSize: 24,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
    textAlign: "center",
  },
  modeDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  modeBadge: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 4,
  },
  modeBadgeText: {
    fontSize: 12,
    color: "#1976d2",
    fontWeight: "600",
  },
  coinInfo: {
    alignItems: "center",
    gap: 8,
  },
  coinsBadge: {
    backgroundColor: "#fff3e0",
  },
  coinsBadgeText: {
    color: "#f57c00",
  },
  insufficientCoinsText: {
    fontSize: 12,
    color: "#d32f2f",
    marginTop: 8,
    textAlign: "center",
  },
  coinsContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  coinsLabel: {
    fontSize: 10,
    color: "rgba(255, 193, 7, 0.8)",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  coinsText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFC107",
  },
  coinRewardsContainer: {
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  coinRewardsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f57c00",
    marginBottom: 8,
  },
  coinRewardsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  totalCoinsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f57c00",
    marginTop: 8,
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
  alignItems: "center",
  width: "100%",
  marginBottom: 32,
  backgroundColor: "rgba(25, 118, 210, 0.07)",
  borderRadius: 16,
  paddingVertical: 20,
  paddingHorizontal: 8, 
  gap: 0,               
},
finalStatItem: {
  alignItems: "center",
  flex: 1,              
  minWidth: 90,          
},
finalStatNumber: {
  fontSize: 28,        
  fontWeight: "bold",
  color: "#1976d2",
  marginBottom: 4,
  lineHeight: 34,         
},
finalStatLabel: {
  fontSize: 12,
  color: "#666",
  textTransform: "uppercase",
  letterSpacing: 1,
  marginTop: 2,          
},

  gameOverButtons: {
    width: "100%",
    gap: 12,
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

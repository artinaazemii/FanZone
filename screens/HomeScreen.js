import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from 'react-native';

export default function HomeScreen() {
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('https://newsdata.io/api/1/news?apikey=pub_87953313fec29d330e232a87b012687583be0&q=football&language=en');
        const data = await res.json();
        setNews(data.results || []);
      } catch (error) {
        console.error('News fetch error:', error);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* News Section */}
      <Text style={styles.headerText}>📰 Football News</Text>
      {loadingNews ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.newsContainer}
        >
          {news.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.card}
              onPress={() => Linking.openURL(item.link)}
            >
              {item.image_url ? (
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.cardPlaceholder} />
              )}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.description ? (
                  <Text style={styles.cardDescription} numberOfLines={3}>
                    {item.description}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Games Hub Section */}
      <Text style={styles.subHeaderText}>Games Hub</Text>
      <View style={styles.gamesGrid}>
        <TouchableOpacity
          style={styles.gameCard}
          onPress={() => {
            // TODO: navigate to Matching Pairs screen
            console.log('Navigating to Matching Pairs');
          }}
        >
          <Image
            source={require('../assets/MatchingPairs.png')}
            style={styles.gameIcon}
            resizeMode="contain"
          />
          <Text style={styles.gameText}>Matching Pairs</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.gameCard}
          onPress={() => {
            // TODO: navigate to Quizzes screen
            console.log('Navigating to Quizzes');
          }}
        >
          <Image
            source={require('../assets/Quizzes.png')}
            style={styles.gameIcon}
            resizeMode="contain"
          />
          <Text style={styles.gameText}>Quizzes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 16,
  },
  loader: {
    marginTop: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
  },
  newsContainer: {
    paddingHorizontal: 16,
  },
  card: {
    width: 260,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardPlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#ccc',
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginVertical: 12,
  },
  gamesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  gameCard: {
    flex: 1,
    backgroundColor: '#222',
    marginHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 20,
    elevation: 2,
  },
  gameIcon: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  gameText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

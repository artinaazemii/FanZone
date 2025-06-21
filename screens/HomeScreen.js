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

const timeAgo = (dateString) => {
  const now = new Date();
  const published = new Date(dateString);
  const diffInMs = now - published;
  const diffInMinutes = Math.floor(diffInMs / 60000);

  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

const categories = ['Football', 'Premier League', 'Transfers', 'Champions League'];

export default function HomeScreen({ navigation }) {
  const [news, setNews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Football');

  const fetchNews = async (category = 'Football') => {
    setLoadingNews(true);
    try {
      const res = await fetch(
        `https://newsdata.io/api/1/news?apikey=pub_87953313fec29d330e232a87b012687583be0&q=${category}&language=en`
      );
      const data = await res.json();
      setNews(data.results || []);
    } catch (error) {
      console.error('News fetch error:', error);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Category Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filterBtn,
              selectedCategory === cat && styles.activeFilterBtn,
            ]}
            onPress={() => {
              setSelectedCategory(cat);
              fetchNews(cat);
            }}
          >
            <Text
              style={[
                styles.filterText,
                selectedCategory === cat && styles.activeFilterText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* News Section */}
      <Text style={styles.sectionTitle}>Latest News</Text>

      {loadingNews ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <>
          {news[0] && (
            <TouchableOpacity
              style={styles.mainNewsCard}
              onPress={() => Linking.openURL(news[0].link)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: news[0].image_url }} style={styles.mainNewsImage} />
              <Text style={styles.mainNewsTitle}>{news[0].title}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.channelName}>{news[0].source_id}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.timeAgo}>{timeAgo(news[0].pubDate)}</Text>
              </View>
            </TouchableOpacity>
          )}

          <Text style={styles.subHeaderText}>Recomendation Topic</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendScroll}
          >
            {news.slice(1, 10).map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.recommendCardHorizontal}
                onPress={() => Linking.openURL(item.link)}
                activeOpacity={0.85}
              >
                {item.image_url && (
                  <Image source={{ uri: item.image_url }} style={styles.recommendImageH} />
                )}
                <Text style={styles.recommendTitleH} numberOfLines={2}>
                  {item.title}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.channelName}>{item.source_id}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.timeAgo}>{timeAgo(item.pubDate)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {/* Games Section */}
      <Text style={styles.subHeaderText}>Games Hub</Text>
      <View style={styles.gamesGrid}>
        <TouchableOpacity
          style={styles.gameCard}
          onPress={() => navigation.navigate('MatchingPairs')}
        >
          <Image
            source={require('../assets/MatchingPairsss.png')}
            style={styles.matchingPairsIcon}
            resizeMode="contain"
          />
          <Text style={styles.gameText}>Matching Pairs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gameCard}
          onPress={() => navigation.navigate('Quizzes')}
        >
          <Image
            source={require('../assets/Quizzess.png')}
            style={styles.quizzesIcon}
            resizeMode="cover"
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
    backgroundColor: '#121212',
    paddingTop: 16,
  },
  loader: {
    marginTop: 20,
  },
  filterScroll: {
    paddingLeft: 16,
    marginBottom: 12,
  },
  filterBtn: {
    backgroundColor: '#2c2c2e',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterBtn: {
    backgroundColor: '#1e88e5',
  },
  filterText: {
    fontSize: 13,
    color: '#d1d1d6',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 8,
    color: '#fff',
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 12,
    color: '#fff',
  },
  mainNewsCard: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  mainNewsImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  mainNewsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#fff',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  channelName: {
    fontSize: 13,
    color: '#1e88e5',
  },
  timeAgo: {
    fontSize: 13,
    color: '#999',
  },
  dot: {
    marginHorizontal: 6,
    color: '#999',
  },
  recommendScroll: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  recommendCardHorizontal: {
    width: 220,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    marginRight: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recommendImageH: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 8,
  },
  recommendTitleH: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  gamesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  gameCard: {
    flex: 1,
    backgroundColor: '#2c2c2e',
    marginHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 20,
    elevation: 3,
  },
  matchingPairsIcon: {
    width: 90,
    height: 90,
    marginBottom: 12,
  },
  quizzesIcon: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  gameText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
});


import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import moment from 'moment';

const Scoreboard = () => {
  const API_KEY = '8ba36eecb7d04d6b95330c9bc0246244';

  const [matches, setMatches]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [competition, setCompetition] = useState('PL');
  const [section, setSection]   = useState('today');

  const competitions = [
    { id: 'WC',  name: 'World Cup' },
    { id: 'CL',  name: 'Champions League' },
    { id: 'BL1', name: 'Bundesliga' },
    { id: 'PL',  name: 'Premier League' },
    { id: 'SA',  name: 'Serie A' },
    { id: 'PD',  name: 'La Liga' },
  ];

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.football-data.org/v4/competitions/${competition}/matches`,
        { headers: { 'X-Auth-Token': API_KEY } }
      );
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [competition]);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  const sortAsc  = arr => [...arr].sort((a, b) =>
    moment(a.utcDate).diff(moment(b.utcDate))
  );             
  const sortDesc = arr => [...arr].sort((a, b) =>
    moment(b.utcDate).diff(moment(a.utcDate))
  );             

  const todayStart = moment().startOf('day');
  const todayEnd   = moment().endOf('day');

  const sectionsData = {
    upcoming : sortAsc(
      matches.filter(m => moment(m.utcDate).isAfter(todayEnd))
    ),
    today    : sortAsc(
      matches.filter(m =>
        moment(m.utcDate).isBetween(todayStart, todayEnd, null, '[]')
      )
    ),
    past     : sortDesc(             
      matches.filter(m => moment(m.utcDate).isBefore(todayStart))
    ),
  };

  const renderMatch = ({ item }) => {
    const live = ['IN_PLAY', 'PAUSED'].includes(item.status);

    return (
      <View style={[styles.card, live && styles.cardLive]}>
        <Text style={styles.date}>
          {moment(item.utcDate).format('MMM D, HH:mm')}
        </Text>

        <View style={styles.scoreRow}>
          <Text style={styles.team}>{item.homeTeam.name}</Text>
          <Text style={styles.score}>{item.score.fullTime.home ?? '-'}</Text>
        </View>

        <View style={styles.scoreRow}>
          <Text style={styles.team}>{item.awayTeam.name}</Text>
          <Text style={styles.score}>{item.score.fullTime.away ?? '-'}</Text>
        </View>

        <Text
          style={[
            styles.status,
            live
              ? styles.liveText
              : item.status === 'FINISHED'
              ? styles.finishedText
              : {},
          ]}
        >
          {live
            ? 'LIVE'
            : item.status === 'FINISHED'
            ? 'FT'
            : moment(item.utcDate).format('HH:mm')}
        </Text>
      </View>
    );
  };

  if (loading && !matches.length)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchMatches}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.compBarContent}
        >
          {competitions.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.compBtn,
                competition === c.id && styles.compBtnSel,
              ]}
              onPress={() => {
                setCompetition(c.id);
                setSection('today');
              }}
            >
              <Text
                style={[
                  styles.compText,
                  competition === c.id && styles.compTextSel,
                ]}
              >
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.tabBar}>
          {['upcoming', 'today', 'past'].map(key => (
            <TouchableOpacity
              key={key}
              style={[styles.tabBtn, section === key && styles.tabBtnSel]}
              onPress={() => setSection(key)}
            >
              <Text
                style={[
                  styles.tabText,
                  section === key && styles.tabTextSel,
                ]}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        style={styles.content}
        data={sectionsData[section]}
        keyExtractor={i => i.id.toString()}
        renderItem={renderMatch}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchMatches} />
        }
        ListEmptyComponent={<Text style={styles.empty}>No matches</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },

  header: {
    backgroundColor: '#1e1e1e',
  },

  compBarContent: {
    paddingHorizontal: 8,
    height: 50,
    alignItems: 'center',
  },
  compBtn: {
    marginRight: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#2c2c2e',
  },
 
  compBtnSel: {
    backgroundColor: '#fff',
  },
  compText: {
    color: '#d1d1d6',
    fontSize: 12,
  },

  compTextSel: {
    color: '#121212',
    fontWeight: 'bold',
  },

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a1a',
    height: 40,
    alignItems: 'center',
  },
  tabBtn: {
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnSel: {
    borderBottomColor: '#1e88e5',
  },
  tabText: {
    fontSize: 14,
    color: '#aaa',
  },
  tabTextSel: {
    color: '#1e88e5',
    fontWeight: '600',
  },

  content: {
    flex: 1,
  },
  list: {
    padding: 8,
    paddingBottom: 80,
  },

  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: { elevation: 2 },
    }),
  },
  cardLive: {
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },

  date: {
    fontSize: 12,
    color: '#bbb',
    marginBottom: 6,
    textAlign: 'center',
  },

  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  team: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  score: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },

  status: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#ccc',
  },
  liveText: {
    color: '#ff5252',
  },
  finishedText: {
    color: '#4caf50',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#ff6e6e',
    marginBottom: 8,
  },
  retryBtn: {
    backgroundColor: '#1e88e5',
    padding: 10,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },

  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});
export default Scoreboard;

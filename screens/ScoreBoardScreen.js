import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Button,
  ScrollView,
} from 'react-native';
import moment from 'moment';

const Scoreboard = () => {
  const API_KEY = '8ba36eecb7d04d6b95330c9bc0246244';
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [competition, setCompetition] = useState('PL');

  const availableCompetitions = [
    { id: 'WC', name: 'World Cup' },
    { id: 'CL', name: 'Champions League' },
    { id: 'BL1', name: 'Bundesliga' },
    { id: 'PL', name: 'Premier League' },
    { id: 'SA', name: 'Serie A' },
    { id: 'PD', name: 'La Liga' },
    { id: 'EL', name: 'Europa League' },
    { id: 'EFL', name: 'EFL Championship' },
    { id: 'L1', name: 'League One' },
    { id: 'L2', name: 'League Two' },
    { id: 'FAC', name: 'FA Cup' },
    { id: 'FL1', name: 'Football League Trophy' },
  ];

  const fetchMatches = async (compId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://api.football-data.org/v4/competitions/${compId}/matches`,
        {
          headers: {
            'X-Auth-Token': API_KEY,
          },
        }
      );

      if (response.status === 403) {
        throw new Error('API token invalid or rate limit exceeded');
      }

      const data = await response.json();

      if (!data.matches) {
        throw new Error('No matches found in response');
      }

      setMatches(data.matches);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches(competition);
  }, [competition]);

  const categorizeMatches = () => {
    const todayStart = moment().startOf('day');
    const todayEnd = moment().endOf('day');

    const pastMatches = matches
      .filter(
        (match) =>
          moment(match.utcDate).isBefore(todayStart) ||
          (match.status === 'FINISHED' && moment(match.utcDate).isBefore(todayEnd))
      )
      .sort((a, b) => moment(b.utcDate).diff(moment(a.utcDate)));

    const todayMatches = matches
      .filter((match) =>
        moment(match.utcDate).isBetween(todayStart, todayEnd, null, '[]')
      )
      .sort((a, b) => moment(a.utcDate).diff(moment(b.utcDate)));

    const upcomingMatches = matches
      .filter((match) => moment(match.utcDate).isAfter(todayEnd))
      .sort((a, b) => moment(a.utcDate).diff(moment(b.utcDate)));

    return { pastMatches, todayMatches, upcomingMatches };
  };

  const { pastMatches, todayMatches, upcomingMatches } = categorizeMatches();

  const renderMatch = ({ item }) => (
    <View
      style={[
        styles.matchContainer,
        (item.status === 'IN_PLAY' || item.status === 'PAUSED') && styles.liveMatchBox,
      ]}
    >
      <Text style={styles.matchDate}>
        {moment(item.utcDate).format('MMM D, HH:mm')}
      </Text>
      <View style={styles.teamRow}>
        <Text style={styles.teamName}>{item.homeTeam.name}</Text>
        <Text style={styles.score}>
          {item.score.fullTime.home !== null ? item.score.fullTime.home : '-'}
        </Text>
      </View>
      <View style={styles.teamRow}>
        <Text style={styles.teamName}>{item.awayTeam.name}</Text>
        <Text style={styles.score}>
          {item.score.fullTime.away !== null ? item.score.fullTime.away : '-'}
        </Text>
      </View>
      <Text
        style={[
          styles.status,
          (item.status === 'IN_PLAY' || item.status === 'PAUSED') && styles.live,
          item.status === 'FINISHED' && styles.finished,
        ]}
      >
        {item.status === 'IN_PLAY'
          ? 'LIVE'
          : item.status === 'PAUSED'
          ? 'HT'
          : item.status === 'FINISHED'
          ? 'FT'
          : moment(item.utcDate).format('HH:mm')}
      </Text>
    </View>
  );

  const renderSection = (title, matches) => {
    if (matches.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMatch}
          scrollEnabled={false}
        />
      </View>
    );
  };

  if (loading && matches.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
        <Text style={styles.note}>Note: Free tier has limited requests</Text>
        <Button title="Retry" onPress={() => fetchMatches(competition)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.selector}>
        {availableCompetitions.map((comp) => (
          <Button
            key={comp.id}
            title={comp.name}
            onPress={() => setCompetition(comp.id)}
            color={competition === comp.id ? '#1e88e5' : '#aaa'}
          />
        ))}
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => fetchMatches(competition)}
          />
        }
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.columnsContainer}>
          <View style={styles.column}>
            {renderSection('Past Matches', pastMatches)}
          </View>
          <View style={styles.column}>
            {renderSection('Today Matches', todayMatches)}
          </View>
          <View style={styles.column}>
            {renderSection('Upcoming Matches', upcomingMatches)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#f5f5f5',
},
selector: {
flexDirection: 'row',
flexWrap: 'wrap',
justifyContent: 'center',
padding: 8,
backgroundColor: '#e3e3e3',
},
columnsContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
paddingHorizontal: 4,
},
column: {
flex: 1,
paddingHorizontal: 4,
},
section: {
marginVertical: 8,
backgroundColor: '#fff',
borderRadius: 8,
padding: 8,
elevation: 2,
},
sectionTitle: {
fontSize: 18,
fontWeight: 'bold',
marginBottom: 8,
textAlign: 'center',
color: '#444',
},
matchContainer: {
borderBottomWidth: 1,
borderBottomColor: '#ccc',
paddingVertical: 6,
},
teamRow: {
flexDirection: 'row',
justifyContent: 'space-between',
marginVertical: 2,
},
teamName: {
fontSize: 14,
fontWeight: '600',
color: '#333',
},
score: {
fontSize: 14,
fontWeight: 'bold',
color: '#000',
},
matchDate: {
fontSize: 12,
color: '#666',
marginBottom: 4,
textAlign: 'center',
},
status: {
fontSize: 12,
fontWeight: '600',
textAlign: 'center',
marginTop: 4,
},
live: {
color: 'red',
},
finished: {
color: '#4caf50',
},
liveMatchBox: {
backgroundColor: '#ffeaea',
borderRadius: 6,
padding: 6,
marginVertical: 4,
},
scrollContainer: {
padding: 8,
paddingBottom: 100,
},
center: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
},
error: {
fontSize: 16,
color: 'red',
marginBottom: 8,
},
note: {
fontSize: 12,
color: '#777',
marginBottom: 12,
},
});

export default Scoreboard;

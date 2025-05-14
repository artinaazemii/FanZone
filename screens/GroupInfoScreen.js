// screens/GroupInfoScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { db }          from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function GroupInfoScreen({ route }) {
  const { teamId, teamName } = route.params;
  const [members, setMembers] = useState([]);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    (async() => {
      try {
        const snap = await getDoc(doc(db,'teamChats',teamId));
        if (snap.exists()) setMembers(snap.data().participants||[]);
      } catch(e){ console.error(e); }
      setLoad(false);
    })();
  },[teamId]);

  if (loading) {
    return <View style={styles.loader}><ActivityIndicator size="large" color="#3498db"/></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Members of {teamName}</Text>
      <FlatList
        data={members}
        keyExtractor={i=>i.uid}
        renderItem={({item})=>(
          <View style={styles.row}><Text style={styles.name}>{item.name}</Text></View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16, backgroundColor:'#fff' },
  loader:   { flex:1, justifyContent:'center', alignItems:'center' },
  header:   { fontSize:20, fontWeight:'bold', marginBottom:12 },
  row:      { paddingVertical:10, borderBottomWidth:1, borderColor:'#eee' },
  name:     { fontSize:16 },
});

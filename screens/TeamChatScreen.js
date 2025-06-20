// screens/TeamChatScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, TouchableWithoutFeedback,
  StyleSheet, KeyboardAvoidingView, Platform, Alert, Modal, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';

import { auth, db } from '../firebaseConfig';
import {
  collection, query, orderBy, onSnapshot, addDoc,
  serverTimestamp, deleteDoc, doc, getDoc, setDoc, updateDoc,
} from 'firebase/firestore';

const ADMIN_UID = 'k7CSHSfyfIdycjostOnX0SoHF4w1';

/* helper-a date & time */
const dayKey = (ts) => {
  const d = ts?.toDate?.() ?? new Date(0);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};
const dateLabel = (ts) =>
  ts?.toDate?.().toLocaleDateString(undefined, {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  }).toUpperCase() || '';
const timeOnly = (ts) =>
  ts?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';

export default function TeamChatScreen({ route }) {
  const { teamId, teamName } = route.params;
  const navigation   = useNavigation();
  const insets       = useSafeAreaInsets();

  const [messages, setMessages]   = useState([]);
  const [members,  setMembers]    = useState([]);
  const [input,    setInput]      = useState('');
  const [replyTo,  setReplyTo]    = useState(null);
  const [showMembers, setShowMembers] = useState(false);

  /* ref për scroll-to-bottom */
  const flatRef = React.createRef();
  const scrollToBottom = (animated=false) =>
    flatRef.current?.scrollToEnd({ animated });

  /*  ▸ siguro adminId */
  useEffect(() => {
    const ref = doc(db,'teamChats',teamId);
    return onSnapshot(ref,s=>{
      if (s.exists() && s.data().adminId !== ADMIN_UID)
        updateDoc(ref,{ adminId: ADMIN_UID });
    });
  },[teamId]);

  /*  ▸ ban / join check + listenerë  */
  useEffect(() => {
    const memberRef = doc(db,'teamChats',teamId,'members',auth.currentUser.uid);
    let unsub;
    (async()=>{
      if (
        auth.currentUser.uid!==ADMIN_UID &&
        (await getDoc(doc(db,'teamChats',teamId,'bans',auth.currentUser.uid))).exists()
      ){
        Alert.alert('Access denied','You were removed by admin.');
        navigation.goBack(); return;
      }
      if (!(await getDoc(memberRef)).exists()){
        await setDoc(memberRef,{
          displayName: auth.currentUser.displayName||'User',
          joinedAt: serverTimestamp(),
        });
      }
      unsub = onSnapshot(memberRef,s=>{
        if(!s.exists()){
          Alert.alert('Removed','You were kicked by admin.',
            [{text:'OK',onPress:()=>navigation.goBack()}]);
        }
      });
    })();
    return()=>unsub&&unsub();
  },[teamId,navigation]);

  /*  ▸ read/unread badge  */
  useFocusEffect(React.useCallback(()=>{
    const stRef = doc(db,'users',auth.currentUser.uid,'chatStatus',teamId);
    setDoc(stRef,{ lastSeen: serverTimestamp() },{merge:true});
    return()=>setDoc(stRef,{ lastSeen: serverTimestamp() },{merge:true});
  },[teamId]));

  /*  ▸ mesazhet  */
  useEffect(()=>{
    const q = query(collection(db,'teamChats',teamId,'messages'),orderBy('createdAt','asc'));
    return onSnapshot(q,s=>setMessages(s.docs.map(d=>({id:d.id,...d.data()}))));
  },[teamId]);

  /* scroll në fund kur ndryshojnë mesazhet */
  useEffect(()=>{ if(flatRef.current && messages.length) scrollToBottom(false); },
    [messages]);

  /*  ▸ members  */
  useEffect(()=>onSnapshot(
    collection(db,'teamChats',teamId,'members'),
    s=>setMembers(s.docs.map(d=>({id:d.id,...d.data()})))
  ),[teamId]);

  /*  ▸ header  */
  useLayoutEffect(()=>{
    navigation.setOptions({
      title: teamName,
      headerRight:()=>(
        <TouchableOpacity onPress={()=>setShowMembers(true)} style={{marginRight:12}}>
          <Ionicons name="people" size={24} color="#3498db"/>
        </TouchableOpacity>
      ),
    });
  },[navigation,teamName]);

  /*  ▸ dërgo mesazh  */
  const sendMessage = async () => {
    const txt = input.trim();
    if (!txt) return;

    /* ndërto objektin, shto reply vetëm nëse ekziston */
    const msg = {
      text: txt,
      createdAt: serverTimestamp(),
      userId: auth.currentUser.uid,
      displayName: auth.currentUser.displayName || 'User',
      type: 'text',
    };
    if (replyTo) msg.reply = replyTo;   // ⇠ vetëm kur ka citim

    await addDoc(collection(db,'teamChats',teamId,'messages'), msg)
      .catch(e=>Alert.alert('Send failed',e.message));

    setInput('');
    setReplyTo(null);
  };

  /*  ▸ fshi mesazh  */
  const del = id =>
    Alert.alert('Delete message?','This cannot be undone.',[
      {text:'Cancel',style:'cancel'},
      {text:'Delete',style:'destructive',
       onPress:()=>deleteDoc(doc(db,'teamChats',teamId,'messages',id))
                  .catch(e=>Alert.alert('Delete failed',e.message))},
    ]);

  /*  ▸ swipe-to-reply  */
  const startReply = item => setReplyTo({
    id:item.id,
    text:item.type==='image'?'📷 Image':item.text,
    displayName:item.displayName,
    type:item.type,
    imageUrl:item.imageUrl??null,
  });

  const LeftAction = () => (
    <View style={styles.swipeBox}>
      <Ionicons name="return-up-back" size={20} color="#fff"/>
    </View>
  );

  const renderMsg = ({item,index})=>{
    const isMe  = item.userId===auth.currentUser.uid;
    const prev  = index>0?messages[index-1]:null;
    const showDate = !prev || dayKey(prev.createdAt)!==dayKey(item.createdAt);

    const rowRef = React.createRef();
    const onOpen = () => { startReply(item); rowRef.current?.close(); };

    return (
      <>
        {showDate && <View style={styles.dateWrap}>
          <Text style={styles.dateTxt}>{dateLabel(item.createdAt)}</Text>
        </View>}

        <Swipeable
          ref={rowRef}
          renderLeftActions={LeftAction}
          overshootLeft={false}
          onSwipeableOpen={onOpen}
        >
          <View style={[styles.row,isMe?styles.rowR:styles.rowL]}>
            <View style={[styles.bubble,isMe?styles.my:styles.their]}>
              {item.reply && (
                <View style={styles.replyPreview}>
                  <Text style={styles.replyName}>{item.reply.displayName}</Text>
                  {item.reply.type==='image'
                    ?<Text style={styles.replyText}>📷 Image</Text>
                    :<Text style={styles.replyText} numberOfLines={1}>{item.reply.text}</Text>}
                </View>
              )}

              {!isMe && <Text style={styles.name}>{item.displayName}</Text>}
              {item.type==='image'
                ?<Image source={{uri:item.imageUrl}} style={styles.img}/>
                :<Text style={styles.msg}>{item.text}</Text>}
              <Text style={styles.time}>{timeOnly(item.createdAt)}</Text>
            </View>

            {isMe && (
              <TouchableOpacity onPress={()=>del(item.id)} style={styles.trash}>
                <Ionicons name="trash" size={18} color="#900"/>
              </TouchableOpacity>
            )}
          </View>
        </Swipeable>
      </>
    );
  };

  /* banner reply (tap anywhere to cancel) */
  const ReplyBanner = () => (
    <TouchableWithoutFeedback onPress={() => setReplyTo(null)}>
      <View style={styles.replyBanner}>
        <Ionicons name="return-up-back" size={18} color="#3498db"/>
        <View style={{flex:1,marginLeft:6}}>
          <Text style={styles.replyName}>{replyTo.displayName}</Text>
          <Text style={styles.replyBannerText} numberOfLines={1}>
            {replyTo.type==='image'?'📷 Image':replyTo.text}
          </Text>
        </View>
        <Ionicons name="close" size={20} color="#777"/>
      </View>
    </TouchableWithoutFeedback>
  );

  /* ───────── JSX ───────── */
  return (
    <>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS==='ios'?'padding':undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={i=>i.id}
          renderItem={renderMsg}
          contentContainerStyle={styles.list}
          onLayout={()=>scrollToBottom(false)}
          onContentSizeChange={()=>scrollToBottom(false)}
        />

        {replyTo && <ReplyBanner/>}

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder={replyTo ? `Reply to ${replyTo.displayName}…` : `Message ${teamName}`}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            onFocus={()=>setReplyTo(null)}    // prek-input ≈ anulo reply
          />
          <TouchableOpacity onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#3498db"/>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <MembersModal
        visible={showMembers}
        onClose={()=>setShowMembers(false)}
        members={members}
        kick={kickMember}
        isAdmin={auth.currentUser.uid===ADMIN_UID}
        teamName={teamName}
        insetsTop={insets.top}
      />
    </>
  );

  /* helper për kick */
  async function kickMember(m){
    try{
      await deleteDoc(doc(db,'teamChats',teamId,'members',m.id));
      await setDoc(doc(db,'teamChats',teamId,'bans',m.id),{
        displayName:m.displayName,
        kickedAt:serverTimestamp(),
      });
    }catch(e){Alert.alert('Kick failed',e.message);}
  }
}

/* Modal i pjesëtarëve – identik me versionin e mëparshëm */
function MembersModal({visible,onClose,members,kick,isAdmin,teamName,insetsTop}){
  return(
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.modal,{paddingTop:insetsTop}]}>
        <Text style={styles.modalTitle}>{teamName} Members ({members.length})</Text>
        <FlatList
          data={members}
          keyExtractor={m=>m.id}
          renderItem={({item})=>(
            <View style={styles.memberRow}>
              <Ionicons name="person-circle" size={24} color="#555"/>
              <Text style={styles.memberName}>
                {item.displayName}
                {item.id===auth.currentUser.uid && <Text style={styles.youTxt}> (You)</Text>}
                {item.id===ADMIN_UID && <Text style={styles.adminTxt}> (Admin)</Text>}
              </Text>
              {isAdmin && item.id!==auth.currentUser.uid && (
                <TouchableOpacity onPress={()=>kick(item)} style={styles.kickBtn}>
                  <Text style={styles.kickTxt}>Kick</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeTxt}>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
}

/* ───────── STYLES (si më parë) ───────── */
const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#fff'},
  list:{padding:16},

  dateWrap:{alignItems:'center',marginVertical:8},
  dateTxt:{backgroundColor:'#eee',paddingHorizontal:8,paddingVertical:4,borderRadius:12,
           fontSize:12,fontWeight:'600',color:'#555'},

  row:{flexDirection:'row',alignItems:'flex-end',marginBottom:12},
  rowR:{alignSelf:'flex-end'}, rowL:{alignSelf:'flex-start'},

  bubble:{padding:10,borderRadius:8,maxWidth:'75%'},
  my:{backgroundColor:'#dcf8c6'}, their:{backgroundColor:'#f1f0f0'},

  name:{fontSize:12,fontWeight:'bold',marginBottom:4},
  msg:{fontSize:16},
  time:{fontSize:10,color:'#777',marginTop:4,alignSelf:'flex-end'},
  img:{width:200,height:200,borderRadius:8},

  replyPreview:{borderLeftWidth:2,borderLeftColor:'#3498db',paddingLeft:4,marginBottom:2},
  replyName:{fontSize:11,fontWeight:'600',color:'#3498db'},
  replyText:{fontSize:11,color:'#555'},

  trash:{marginLeft:8,padding:4},

  inputRow:{flexDirection:'row',alignItems:'center',
            padding:8,borderTopWidth:1,borderColor:'#ddd'},
  input:{flex:1,padding:10,borderRadius:20,backgroundColor:'#f5f5f5',marginRight:8},

  replyBanner:{flexDirection:'row',alignItems:'center',
               paddingHorizontal:8,paddingVertical:4,
               backgroundColor:'#eef6ff',borderTopWidth:1,borderColor:'#d0e3ff'},
  replyBannerText:{fontSize:12,color:'#555'},

  swipeBox:{justifyContent:'center',alignItems:'center',width:42,backgroundColor:'#3498db'},

  /* modal */
  modal:{flex:1,backgroundColor:'#fff',paddingHorizontal:16},
  modalTitle:{fontSize:20,fontWeight:'700',textAlign:'center',marginBottom:12},
  memberRow:{flexDirection:'row',alignItems:'center',paddingVertical:8},
  memberName:{marginLeft:8,fontSize:16},
  youTxt:{fontSize:12,fontStyle:'italic',color:'#555'},
  adminTxt:{fontSize:12,fontWeight:'600',color:'#f39c12'},
  kickBtn:{marginLeft:12,paddingHorizontal:8,paddingVertical:4,
           backgroundColor:'#e74c3c',borderRadius:4},
  kickTxt:{color:'#fff',fontSize:14,fontWeight:'600'},
  closeBtn:{alignSelf:'center',marginTop:24,paddingHorizontal:24,paddingVertical:12,
            backgroundColor:'#3498db',borderRadius:24},
  closeTxt:{color:'#fff',fontWeight:'600',fontSize:16},
});

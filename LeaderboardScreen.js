import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { firestore } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export default function LeaderboardScreen() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const usersCollection = collection(firestore, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const leaderboardData = usersSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => b.points - a.points); 

        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error fetching leaderboard: ", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.text}>{item.name} - {item.points} bodova</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Ladderboard</Text>
      <FlatList
        data={leaderboard}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 10,
    margin: 5,
    borderBottomWidth: 1,
    width: '90%',
  },
  text: {
    fontSize: 18,
  },
});

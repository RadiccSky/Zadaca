import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { auth, firestore } from '../firebaseConfig'; 
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function GameOneScreen() {
  const [number, setNumber] = useState(0);
  const [numbers, setNumbers] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [sum, setSum] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [points, setPoints] = useState(0);  
  const [user, setUser] = useState(null);  

  
  const getUserPoints = async (userId) => {
    const userRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return docSnap.data().points || 0;  
    } else {
      return 0;  
    }
  };

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); 
        const currentPoints = await getUserPoints(currentUser.uid);
        setPoints(currentPoints);  
      } else {
        setUser(null);  
        setPoints(0);   
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let intervalId;
    let count = 0;

    if (isRunning) {
      intervalId = setInterval(() => {
        let newNumber;
        do {
          newNumber = Math.floor(Math.random() * 10);
        } while (numbers.length > 0 && newNumber === numbers[numbers.length - 1]);

        setNumber(newNumber);
        setNumbers(prevNumbers => [...prevNumbers, newNumber]);
        count += 1;

        if (count >= 10) {
          clearInterval(intervalId);
          setTimeout(() => {
            setInputVisible(true);
            setIsRunning(false);
          }, 800);
        }
      }, 800); 
    }

    return () => clearInterval(intervalId);  
  }, [isRunning]);

  const handleStart = () => {
    setNumber(0);
    setNumbers([]);
    setIsRunning(true);
    setInputVisible(false);
    setSum("");
    setResultMessage("");
  };

  const handleSumChange = (text) => {
    setSum(text);
  };

 
  const updatePointsInFirestore = async (newPoints) => {
    if (user) {
      const userRef = doc(firestore, 'users', user.uid);
      await updateDoc(userRef, {
        points: newPoints,
      });
    }
  };

  const handleSubmit = () => {
    const calculatedSum = numbers.reduce((acc, num) => acc + num, 0);
    let newPoints = points;

    if (parseInt(sum) === calculatedSum) {
      setResultMessage("TOČNO: Točan zbroj!");
      newPoints += 5;  
    } else {
      setResultMessage(`NETOČNO: Netočan zbroj! Točan zbroj je ${calculatedSum}`);
      newPoints -= 7; 
    }

    setPoints(newPoints); 

    
    updatePointsInFirestore(newPoints);

    setTimeout(() => {
      setNumber(0);
      setNumbers([]);
      setInputVisible(false);
      setSum("");
      setResultMessage("");
    }, 5000); 
  };

  return (
    <View style={styles.container}>
      {inputVisible ? (
        <View style={styles.inputContainer}>
          <Text>Zbroj ovih brojeva je?</Text>
          <TextInput
            style={styles.input}
            value={sum}
            onChangeText={handleSumChange}
            keyboardType="numeric"
          />
          <Pressable style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Pošalji</Text>
          </Pressable>
          {resultMessage ? <Text style={styles.resultText}>{resultMessage}</Text> : null}
          <Text style={styles.points}>Bodovi: {points}</Text>
        </View>
      ) : (
        <View style={styles.gameContainer}>
          <Text style={styles.number}>{number}</Text>
          {!isRunning && (
            <Pressable style={styles.button} onPress={handleStart}>
              <Text style={styles.buttonText}>Pokreni</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContainer: {
    alignItems: 'center',
  },
  number: {
    fontSize: 48,
    margin: 20,
  },
  inputContainer: {
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    margin: 10,
    width: 200,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'gray',
    padding: 10,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  points: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

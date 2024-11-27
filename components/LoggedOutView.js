import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import LoginInput from "./ui/LoginInput";
import LoginButton from "./ui/LoginButton";
import ErrorMessage from "./ui/ErrorMessage";
import { AuthContext } from "../AuthContext";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

export default function LoggedOutView() {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, passw)
      .then(() => {
        login();
      })
      .catch((error) => setErrorMsg(error.message));
  };

  const handleRegister = () => {
    if (email && passw) {
      createUserWithEmailAndPassword(auth, email, passw)
        .then(() => {
          login();
          navigation.navigate("Home");
        })
        .catch((error) => setErrorMsg(error.message));
    } else {
      setErrorMsg("Molimo unesite email i lozinku.");
    }
  };

  return (
    <View style={styles.container}>
      <LoginInput
        placeholder="Unesite Vašu email adresu"
        value={email}
        secureTextEntry={false}
        onChangeText={setEmail}
      />

      <LoginInput
        placeholder="Unesite vašu lozinku"
        secureTextEntry={true}
        value={passw}
        onChangeText={setPassw}
      />

      <ErrorMessage error={errorMsg} />
      <LoginButton title="Prijava" onPress={handleLogin} />
      <LoginButton title="Registriraj se" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});

import API from "@/api";
import { setSystemMessage } from "@/redux/slices/notificationSlice";
import { setAuthenticated, setProfile } from "@/redux/slices/userSlice";
import { styles } from "@/styles";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const EmailLogin = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const formCheck = () => {
    if (email && email.length > 0) {
      if (!validateEmail(email)) {
        dispatch(
          setSystemMessage({
            type: "danger",
            message: "Invalid Email. Please enter a valid email",
          })
        );
        return false;
      }
    } else {
      // setErrorMessage("Enter your email");
      dispatch(
        setSystemMessage({
          type: "danger",
          message: "Enter your email",
        })
      );
      return false;
    }

    if (password && password.length > 0) {
    } else {
      dispatch(
        setSystemMessage({
          type: "danger",
          message: "Enter a password",
        })
      );
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (formCheck()) {
      const config = {};
      try {
        const {
          token,
          refresh_token,
          email: _email,
          id,
        } = await API.V1.Auth.LogIn(
          { email: email.toLowerCase(), password },
          config
        );
        console.log(token, refresh_token);

        dispatch(setProfile({ token, refresh_token, email: _email, id }));
        dispatch(setAuthenticated(true));
        router.replace("/(tabs)");
      } catch (err) {
        dispatch(
          setSystemMessage({
            type: "danger",
            message: "Invalid email or password",
          })
        );
      }
    }
  };

  return (
    <SafeAreaView
      style={{
        height: "100%",
        width: "100%",
        ...styles.mainBackgroundContainer,
      }}
    >
      <View
        style={{
          marginTop: Dimensions.get("screen").height * 0.2,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 40, color: "white", fontWeight: "bold" }}>
          Welcome back
        </Text>
      </View>
      <View>
        <Text style={{ paddingHorizontal: 20, color: "white", fontSize: 18 }}>
          Log back in to continue
        </Text>
      </View>
      <View style={{ paddingHorizontal: 20, marginVertical: 30 }}>
        <TextInput
          placeholder="email"
          placeholderTextColor="gray"
          autoCapitalize="none"
          style={{
            color: "black",
            padding: 10,
            backgroundColor: "white",
            borderRadius: 5,
          }}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="password"
          placeholderTextColor="gray"
          secureTextEntry
          autoCapitalize="none"
          style={{
            color: "black",
            padding: 10,
            backgroundColor: "white",
            borderRadius: 5,
            marginVertical: 10,
          }}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            backgroundColor: "#ffa000",
            marginHorizontal: "10%",
            marginVertical: "2%",
            paddingHorizontal: "7%",
            paddingVertical: "3%",
            borderRadius: 7,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={submit}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              paddingHorizontal: "10%",
              fontWeight: "bold",
            }}
          >
            Log in
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{ paddingHorizontal: 20, width: "100%", alignItems: "center" }}
      >
        <Text style={{ fontWeight: "bold", color: "white" }}>
          Don't have an account?{" "}
          <Text
            onPress={() => router.navigate("/(auth)/emailSignUp")}
            style={{ color: "#ffa000", textDecorationLine: "underline" }}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default EmailLogin;

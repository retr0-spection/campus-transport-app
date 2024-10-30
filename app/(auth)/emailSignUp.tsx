import API from "@/api"
import { setSystemMessage } from "@/redux/slices/notificationSlice"
import { setAuthenticated, setProfile } from "@/redux/slices/userSlice"
import { styles } from "@/styles"
import { AntDesign } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { Alert, Dimensions, Text, TextInput, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { useDispatch } from "react-redux"



const EmailSignUp = () => {
  const router = useRouter()
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const dispatch = useDispatch()

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };



  const formCheck = () => {
    if (email && email.length > 0) {
      if (!validateEmail(email)) {
        dispatch(setSystemMessage({
          type: "danger",
          message: "Invalid Email. Please enter a valid email",
        }));
        return false;
      }
    } else {
      // setErrorMessage("Enter your email");
      dispatch(setSystemMessage({
        type: "danger",
        message: "Enter your email",
      }));
      return false;
    }

    if (password && password.length > 0) {
    } else {
      dispatch(setSystemMessage({
        type: "danger",
        message: "Enter a password",
      }));
      return false;
    }

    if (confirmPassword === password) {
    } else {
      dispatch(setSystemMessage({
        type: "danger",
        message: "Passwords do not match!",
      }));
      return false;
    }


    return true;
  }

  const submit = async () => {
    if (formCheck()){
      const config = {
        
      }
      const {token, refresh_token, email:_email, id} = await API.V1.Auth.SignUp({email, password}, config)
      console.log(token, refresh_token)

      dispatch(setProfile({token, refresh_token, email:_email, id}))
      dispatch(setAuthenticated(true))
      router.replace('/(tabs)')
    }
  }
  

    return   <SafeAreaView
    style={{ height: "100%", width: "100%", ...styles.mainBackgroundContainer }}
  >
    <View style={{marginTop:Dimensions.get('screen').height*.2,paddingHorizontal:20}}>
      <Text style={{fontSize:40,color:'white', fontWeight:'bold'}}>Welcome</Text>
    </View>
    <View>
      <Text style={{paddingHorizontal:20, color:'white', fontSize:18}}>Create an account to get started</Text>
    </View>
    <View style={{paddingHorizontal:20, marginVertical:30}}>
      <TextInput autoCapitalize={'none'} autoComplete="email" placeholder="email" placeholderTextColor='gray' onChangeText={setEmail} style={{color:'black', padding:10,backgroundColor:'white', borderRadius:5}} />
      <TextInput autoCapitalize={'none'}  secureTextEntry placeholder="password"  placeholderTextColor='gray' onChangeText={setPassword} style={{color:'black', padding:10,backgroundColor:'white',borderRadius:5, marginVertical:10}}  />
      <TextInput placeholder="confirm password"  secureTextEntry  placeholderTextColor='gray' onChangeText={setConfirmPassword} style={{color:'black', padding:10,backgroundColor:'white',borderRadius:5, marginBottom:10}}  />
      <TouchableOpacity  activeOpacity={0.7} style={{backgroundColor:'#ffa000', marginHorizontal:'10%',marginVertical:'2%',paddingHorizontal:'7%',paddingVertical:'3%',borderRadius:7,  flexDirection:'row', alignItems:'center',justifyContent:'center' }} onPress={submit}>
            <Text style={{color:'white', fontSize:20, paddingHorizontal:'10%', fontWeight:'bold'}}>Sign up</Text>
          </TouchableOpacity>
    </View>
    <View style={{paddingHorizontal:20, width:'100%', alignItems:'center'}}>
      <Text style={{fontWeight:'bold', color:'white'}}>Already have an account? <Text onPress={() => router.navigate('/(auth)/emailLogIn')} style={{color:'#ffa000', textDecorationLine:'underline'}}>Log in</Text></Text>
    </View>
    </SafeAreaView>
}

export default EmailSignUp
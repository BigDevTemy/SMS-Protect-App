import React, { useState } from "react"
import {Image,StyleSheet,TextInput, TouchableOpacity,KeyboardAvoidingView,ActivityIndicator,ScrollView} from 'react-native'
import {View,Text,Icon} from 'native-base'
import {s} from '../../../app.styles'
import { MaterialIcons } from "@expo/vector-icons";
import Logo from '../../../../assets/start_logo.png'
import useStore from "../../../../store.js";

export function SignInScreen({navigation}){

    const[showPassword,setShowPassword] = useState(false)
    const[phoneNumber,setPhonenumber] = useState('')
    const[password,setPasswordValue] = useState('')
    const [loading,setIsLoading] = useState(false)
    const {setLogin,phonenumber} = useStore()

    console.log('phonenumer',phonenumber)

    const handleToggle = ()=>{
        setShowPassword(!showPassword)
    }

    const handlePhoneNumber = (text)=>
    {
        setPhonenumber(text)
    }
    const handlePassword = (text)=>
    {
        console.log(text)
        setPasswordValue(text)
    }
    const handleLogin = ()=>{
       
        if(loading){
            return true
        }
        setIsLoading(true)
        setLogin(phoneNumber,password)
        setTimeout(()=>{
                setIsLoading(false)
                navigation.navigate('Home')
        },3000)
        
    }

    return (
        <View style={[s.containerSignin]}>

                <View style={styles.logoareaView}>
                    <Image source={Logo} style={styles.logo}/>
                    <Text style={styles.logoText}>SMS PROTECT</Text>
                </View>

                <View style={s.siginForm}>
                        <View style={styles.spaceUp}>
                            <Text style={{color:'#267fc4',fontWeight:'bold',fontSize:16}}>SIGN IN</Text>
                        </View>

                        
                        <KeyboardAvoidingView
                            style={{ flex: 1,width:'100%',height:'100%',marginTop:30 }}
                            behavior={Platform.OS === 'ios' ? 'padding' : null}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                            >
                           <ScrollView contentContainerStyle={styles.container}>

                            <View
                                    style={{
                                        backgroundColor: "rgba(243, 243, 243, 1)",
                                        borderBottomColor: 'rgba(243, 243, 243, 1)',
                                        borderBottomWidth: 1,
                                        paddingTop:10,
                                        paddingLeft:10
                                    }}>
                                    <Text style={{fontSize:15,fontWeight:'bold',color:"rgba(0,0,0,0.5)"}}>Phonenumber</Text>
                                    <TextInput
                                        editable
                                        maxLength={20}
                                        style={{paddingTop: 5}}
                                        onChangeText={handlePhoneNumber}
                                    />
                                </View>
                                <View
                                    style={{
                                        backgroundColor: "rgba(243, 243, 243, 1)",
                                        borderBottomColor: 'rgba(243, 243, 243, 1)',
                                        borderBottomWidth: 1,
                                        paddingTop:10,
                                        paddingLeft:10,
                                        marginTop:10
                                    }}>
                                    <Text style={{fontSize:15,fontWeight:'bold',color:"rgba(0,0,0,0.5)"}}>Password</Text>
                                    <View style={{width:'100%',display:"flex",flexDirection:'row'}}>
                                        <TextInput
                                            editable
                                            secureTextEntry={!showPassword}
                                            maxLength={20}
                                            style={{padding: 5,flex:1}}
                                            onChangeText={handlePassword}
                                        />
                                        <TouchableOpacity onPress={()=>handleToggle()}>
                                            {showPassword ? 
                                            <Icon
                                                
                                                size="6"
                                                color="gray.400"
                                                    as={<MaterialIcons name="visibility" />}
                                            /> :

                                            <Icon
                                                
                                                size="6"
                                                color="gray.400"
                                                    as={<MaterialIcons name="visibility-off" />}
                                            /> 
                                            
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    

                                </View>

                                <View style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',marginTop:20}}>
                                    <TouchableOpacity disabled={loading}  onPress={handleLogin} style={{width:'70%',height:50,borderRadius:20,backgroundColor:"#267fc4",display:'flex',justifyContent:'center',alignItems:'center'}}>
                                    {loading ? (
                                            <ActivityIndicator size="small" color="#ffffff" /> // Render the activity indicator while loading
                                        ) : (
                                            <Text style={{color:'#fff',fontSize:14,fontWeight:'bold'}}>SIGN IN</Text>// Render the button text when not loading
                                        )}
                                        
                                    </TouchableOpacity>
                                    <View style={{marginTop:10}}>
                                        <Text style={{fontSize:14,fontWeight:"bold",color:"rgba(0,0,0,0.5)"}}>Forget Password</Text>
                                    </View>
                                    <TouchableOpacity style={{marginTop:10}} onPress={()=>navigation.navigate('SignUp')} >
                                        <Text style={{fontSize:14,fontWeight:"bold",color:"#267fc4"}}>Don't have an account? Create Account</Text>
                                    </TouchableOpacity>
                                </View>
                           </ScrollView>
                            
                        </KeyboardAvoidingView>


                </View>
            
           
            
        </View>
    )
}


const styles = StyleSheet.create({

    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
      },
      content: {
        flex: 1,
        justifyContent: 'center',
      },
  
   logoareaView:{
    width:'100%',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    marginTop:'10%'
   },
   logo:{
    width:'30%',
    height:'30%'
   },
   logoText:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:20,
    marginTop:10,
    
   },
   spaceUp:{
    marginTop:20
   }
   
   
   

  });
 
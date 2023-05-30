import React, { useState } from "react"
import {Image,StyleSheet,TextInput, TouchableOpacity,KeyboardAvoidingView,ScrollView} from 'react-native'
import {View,Text,Icon} from 'native-base'
import {s} from '../../../app.styles'
import { MaterialIcons } from "@expo/vector-icons";
import Logo from '../../../../assets/start_logo.png'
import { alignItems } from "styled-system";

export function SignUpInScreen({navigation}){

    const[showPassword,setShowPassword] = useState(false)

    const handleToggle = ()=>{
        setShowPassword(!showPassword)
    }

    return (
        <View style={[s.containerSignin]}>

                <View style={styles.logoareaView}>
                    <Image source={Logo} style={styles.logo}/>
                    <Text style={styles.logoText}>SMS PROTECT</Text>
                </View>

                <View style={s.sigupForm}>
                        <View style={styles.spaceUp}>
                            <Text style={{color:'#267fc4',fontWeight:'bold',fontSize:16}}>SIGN UP</Text>
                        </View>

                        
                        <KeyboardAvoidingView
                            style={{ flex: 1,width:'100%',marginTop:30 }}
                            behavior={Platform.OS === 'ios' ? 'padding' : null}
                            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
                            >
                           <ScrollView contentContainerStyle={styles.container}>
                            <View
                                    style={{
                                        backgroundColor: "rgba(243, 243, 243, 1)",
                                        borderBottomColor: 'rgba(243, 243, 243, 1)',
                                        borderBottomWidth: 1,
                                        padding:10
                                    }}>
                                    <Text style={{fontSize:15,fontWeight:'bold',color:"rgba(0,0,0,0.5)"}}>Phonenumber</Text>
                                    <TextInput
                                        editable
                                        maxLength={20}
                                        style={{paddingTop: 5}}
                                    />
                                </View>
                                <View
                                    style={{
                                        backgroundColor: "rgba(243, 243, 243, 1)",
                                        borderBottomColor: 'rgba(243, 243, 243, 1)',
                                        borderBottomWidth: 1,
                                        padding:10,
                                        marginTop:10
                                    }}>
                                    <Text style={{fontSize:15,fontWeight:'bold',color:"rgba(0,0,0,0.5)"}}>First name</Text>
                                    <TextInput
                                        editable
                                        maxLength={20}
                                        style={{paddingTop: 5}}
                                    />
                                </View>
                                <View
                                    style={{
                                        backgroundColor: "rgba(243, 243, 243, 1)",
                                        borderBottomColor: 'rgba(243, 243, 243, 1)',
                                        borderBottomWidth: 1,
                                        padding:10,
                                        marginTop:10
                                    }}>
                                    <Text style={{fontSize:15,fontWeight:'bold',color:"rgba(0,0,0,0.5)"}}>Last name</Text>
                                    <TextInput
                                        editable
                                        maxLength={20}
                                        style={{paddingTop: 5}}
                                    />
                                </View>
                                <View
                                    style={{
                                        backgroundColor: "rgba(243, 243, 243, 1)",
                                        borderBottomColor: 'rgba(243, 243, 243, 1)',
                                        borderBottomWidth: 1,
                                        padding:10,
                                        marginTop:10
                                    }}>
                                    <Text style={{fontSize:15,fontWeight:'bold',color:"rgba(0,0,0,0.5)"}}>Password</Text>
                                    <View style={{width:'100%',display:"flex",flexDirection:'row'}}>
                                        <TextInput
                                            editable
                                            secureTextEntry={!showPassword}
                                            maxLength={20}
                                            style={{padding: 5,flex:1}}
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
                                    <View style={{width:'70%',height:50,borderRadius:20,backgroundColor:"#267fc4",display:'flex',justifyContent:'center',alignItems:'center'}}>
                                        <Text style={{color:'#fff',fontSize:14,fontWeight:'bold'}}>SIGN UP</Text>
                                    </View>

                                    <TouchableOpacity style={{marginTop:10}} onPress={()=>navigation.navigate('SignIn')} >
                                        <Text style={{fontSize:14,fontWeight:"bold",color:"#267fc4"}}>SignIn</Text>
                                    </TouchableOpacity>
                                    
                                </View>
                           </ScrollView>
                         
                        </KeyboardAvoidingView>


                </View>
            
           
            
        </View>
    )
}


const styles = StyleSheet.create({
  
   logoareaView:{
    width:'100%',
    display:'flex',
    flexDirection:'column',
    marginTop:'10%',
    alignItems:'center',
   

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
   ,
   container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
   
   

  });
 
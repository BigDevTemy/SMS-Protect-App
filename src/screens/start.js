import React, { useEffect ,useState} from "react"
import {Image,StyleSheet,TouchableOpacity} from 'react-native'
import {View,Text,Pressable} from 'native-base'
import {s} from '../app.styles'
import Logo from '../../assets/start_logo.png'
import useStore from "../../store"

export function StartScreen({navigation}){

    const {phonenumber} = useStore();
    const [loading,isLoading] = useState(true)

    useEffect(()=>{
        if(phonenumber && phonenumber.length > 0){
            navigation.navigate('Home')
        }
        isLoading(false)
    },[])
  
    
    const handleSignin =()=>{
        navigation.navigate('SignIn')
       
    }

    const renderComponent = ()=>{

        return <View style={[s.containerStart]}>
                    <View style={styles.body}>
                        <View style={styles.logoareaView}>
                            <Image source={Logo} style={styles.logo}/>
                            <Text style={styles.logoText}>SMS PROTECT</Text>
                        </View>

                        <View style={styles.getStartedView}>
                        
                            <TouchableOpacity  style={styles.getstarted} onPress={()=>navigation.navigate('SignUp')}>
                                <Text style={styles.getstartedText}>GET STARTED</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.spaceUp} onPress={()=>handleSignin()}>
                                <Text style={styles.signin}>SIGN IN</Text>
                            </TouchableOpacity>
                        </View>
                        
                        

                        
                    </View>
                </View>

    }

    return (
            
            <View style={[s.containerStart]}>
                <View style={styles.body}>
                    <View style={styles.logoareaView}>
                        <Image source={Logo} style={styles.logo}/>
                        <Text style={styles.logoText}>SMS PROTECT</Text>
                    </View>

                    <View style={styles.getStartedView}>
                    
                        <TouchableOpacity  style={styles.getstarted} onPress={()=>navigation.navigate('SignUp')}>
                            <Text style={styles.getstartedText}>GET STARTED</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.spaceUp} onPress={()=>handleSignin()}>
                            <Text style={styles.signin}>SIGN IN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View> 
    )
}


const styles = StyleSheet.create({
   body:{
    width:'100%',
    height:'100%',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
   },
   logoareaView:{
    width:'100%',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
   },
   logo:{
    width:'30%',
    height:'30%'
   },
   logoText:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:20,
    marginTop:10
   },
   getStartedView:{
    
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    marginTop:'50%'
   },
   getstarted:{
    width:'50%',
    height:50,
    backgroundColor:'#fff',
    borderRadius:15,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
   },
   getstartedText:{
    color:'#267fc4',
    fontWeight:'bold',
    fontSize:14,
    
   },
   signin:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:16
   },
   spaceUp:{
    marginTop:20
   }
   
   

  });
 
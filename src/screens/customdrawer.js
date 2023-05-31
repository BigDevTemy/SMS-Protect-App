import React, { useState, useEffect } from "react";
import {StatusBar,Image,StyleSheet,TouchableOpacity} from 'react-native'
import {View,Text,Icon, Pressable} from 'native-base'
import { MaterialIcons,FontAwesome } from "@expo/vector-icons";
import {s} from '../app.styles'
import { useNavigationState,DrawerActions,useNavigation  } from '@react-navigation/native';
import Premium from '../../assets/premium.png'
import useStore from "../../store";
import { display, paddingBottom } from "styled-system";

export function CustomDrawer() {
    const navigation = useNavigation()
   
    const navigationState = useNavigationState((state) => state);
    const {username,phonenumber,setLogin} = useStore()
    const isDrawerOpen = navigationState?.history?.some((entry) => entry.type === 'drawer');
    useEffect(()=>{
          
    },[isDrawerOpen])
    const handleClose = ()=>{
        navigation.dispatch(DrawerActions.closeDrawer());
        
    }

    const handleLogout = ()=>{
        setLogin('','')
        navigation.navigate('SignIn')
    }

    const Table = () => {
        return (
          <View style={styles.table}>
            <View style={styles.tableRowOne}>
                <View style={[styles.tableCell,styles.tapline]}>
                    <View style={styles.textContent}>
                        <Icon
                            size="6"
                            color="#ff0000"
                            as={<MaterialIcons name="security" />}
                        />
                    
                        <Text style={s.letteringSize}>
                                2
                        </Text>
                    </View>
                    <View style={{paddingBottom:10}}>
                            <Text style={{color:'#fff',marginTop:10,fontSize:12}}>Spam calls identified</Text>
                    </View>
                    
                </View>
                <View style={[styles.tableCell,styles.spacing]}>
                    <View style={styles.textContent}>
                        <Icon
                            size="6"
                            color="#90EE90"
                            as={<MaterialIcons name="access-time" />}
                        />
                    
                        <Text style={s.letteringSize}>
                                56 
                        </Text>
                    </View>
                    <View style={{paddingBottom:10}}>
                            <Text style={{color:'#fff',marginTop:10,fontSize:12}}>Time saved from spammers</Text>
                    </View>
                    
                </View>
            </View>
            <View style={styles.tableRowTwo}>
            <View style={[styles.tableCell,styles.tapline]}>
                    <View style={styles.textContent}>
                        <Icon
                            size="6"
                            color="#ADD8E6"
                            as={<MaterialIcons name="search" />}
                        />
                    
                        <Text style={s.letteringSize}>
                                28
                        </Text>
                    </View>
                    <View >
                            <Text style={{color:'#fff',marginTop:10,fontSize:12}}>unknown number identified</Text>
                    </View>
                    
                </View>
                <View style={[styles.tableCell,styles.spacing]}>
                    <View style={styles.textContent}>
                        <Icon
                            size="6"
                            color="#FFD700"
                            as={<MaterialIcons name="attach-money" />}
                        />
                    
                        <Text style={s.letteringSize}>
                                7
                        </Text>
                    </View>
                    <View >
                            <Text style={{color:'#fff',marginTop:10,fontSize:12}}>messages moved to spam</Text>
                    </View>
                    
                </View>
            </View>
          </View>
        );
      };

    return (
        <View style={[s.flexOne,s.customDrawer,isDrawerOpen && s.addToWidth]}>
            <StatusBar barStyle = "light-content" hidden = {false} backgroundColor = "transparent" translucent = {true}/>
            <View style={[s.title]}>
                <Pressable onPress={()=>handleClose()}>
                    <Icon
                    
                        size="6"
                        color="white"
                        as={<MaterialIcons name="arrow-back" />}
                    />
                </Pressable>
                <View style={{width:'25%',display:"flex",flexDirection:"column",alignItems:'center'}}>
                    <Text style={s.profilename}>{username}</Text>
                    <Text style={s.phonenumber}>{phonenumber}</Text>
                    
                </View>
                <View>
                <Icon
                    m="2"
                    size="6"
                    color="white"
                     as={<MaterialIcons name="settings" />}
                />
                </View>
            </View>

            <View style={[s.customDrawerBorder,s.upgrade]}>
                <Image source={Premium} style={{width:20,height:20}} />
                <Text style={[s.drawerTextColor,s.m_textSpace,]}>Upgrade to premium</Text>

            </View>

            <View style={[s.customDrawerBorder,s.secondSection]}>
                <View style={s.flexCustomBetween}>
                    <View style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
                        <Text style={s.drawerTextColor}>Last 30days</Text>
                        <Icon
                            size="6"
                            color="white"
                            as={<MaterialIcons name="arrow-drop-down" />}
                        />
                    </View>
                    <View>
                        <Icon
                            size="8"
                            color="white"
                            as={<MaterialIcons name="share" />}
                        />

                    </View>
                </View>
                <View style={{marginTop:10}}>
                    <Table/>
                </View>

            </View>

            <View style={[s.customDrawerBorder,s.thirdSection]}>
                <View style={[s.thirdSectionContentView,s.thirdSectionContentView_mt]}>
                    <View>
                        <Icon
                            size="6"
                            color="#fff"
                            as={<MaterialIcons name="notifications" />}
                        />
                    </View>
                    <View style={[s.flexOne,s.ms_textSpace]}>
                            <Text style={[s.drawerTextColor,styles.cellText]}>Notification</Text>
                    </View>
                </View>
                <View style={[s.thirdSectionContentView,s.thirdSectionContentView_mt]}>
                    <View>
                        <Icon
                            size="6"
                            color="#fff"
                            as={<MaterialIcons name="palette" />}
                        />
                    </View>
                    <View style={[s.flexOne,s.ms_textSpace]}>
                            <Text style={[s.drawerTextColor,styles.cellText]}>Change Theme</Text>
                    </View>
                </View>
                <View style={[s.thirdSectionContentView,s.thirdSectionContentView_mt]}>
                    <View>
                        <Icon
                            size="6"
                            color="#fff"
                            as={<MaterialIcons name="family-restroom" />}
                        />
                    </View>
                    <View style={[s.flexOne,s.ms_textSpace]}>
                            <Text style={[s.drawerTextColor,styles.cellText]}>Parentyn</Text>
                    </View>
                </View>
                <View style={[s.thirdSectionContentView,s.thirdSectionContentView_mt]}>
                    <View>
                        <Icon
                            size="6"
                            color="#fff"
                            as={<MaterialIcons name="person-add" />}
                        />
                    </View>
                    <View style={[s.flexOne,s.ms_textSpace]}>
                            <Text style={[s.drawerTextColor,styles.cellText]}>Invite Friends</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={s.logout} onPress={()=>handleLogout()} >
                <Icon
                    size="6"
                    color="#ff0000"
                    as={<MaterialIcons name="logout" />}
                />
                <Text style={{color:'#fff',fontSize:16}}>
                    Logout
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    table: {
      
      borderRadius: 4,
      paddingBottom: 20,
      height:'100%',
    },
    tableRowOne: {
      flexDirection: 'row',
      height:'40%',
      display:"flex",
      borderBottomWidth:2,
      borderColor:"#fff",
      justifyContent:'flex-start',
      alignItems:'center',
      paddingBottom:0
      
    },
    tableRowTwo: {
        flexDirection: 'row',
       
      },
    tableCell: {
      flex: 1,
      padding: 0,
    
    
      alignItems: 'flex-start',
      display:"flex",
      flexDirection:'column',
      justifyContent:'center'
      
    },
    tapline:{
        borderRightWidth: 2,
        borderLeftWidth:0,
        borderBottomWidth:0,
        borderTopWidth:0,
        borderColor:"white"
        
    },
    cellText: {
      fontSize: 16,
    },
    textContent:{
        width:'100%',
        marginTop:10,
        
        display:'flex',
        flexDirection:"row",
        justifyContent:"flex-start",
        alignItems:"center"
    },
    spacing:{
        paddingLeft:10
    }
  });
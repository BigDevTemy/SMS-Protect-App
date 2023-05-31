import { StyleSheet ,Dimensions} from "react-native";
import { alignItems, flexDirection, marginLeft, marginTop, paddingBottom } from "styled-system";

export const s = StyleSheet.create({
  flexOne: {
    flex: 1,
  },
  customDrawer:{
    display:'flex',
    width:'100%',
    height:'100%',
    backgroundColor:'#000',
    // backgroundColor:'#267fc4',
    
    paddingLeft:20,
    paddingRight:20,
    paddingTop:10,

  },
  title:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:25
  },
  profilename:{
    color:'#fff'
  },
  phonenumber:{
    color:'rgba(255, 255, 255, 0.5)'
  },
  addToWidth: {
    width:Dimensions.get('window').width
  },
  allCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  containerStart: {
    width:'100%',
    height:'100%',
    flex: 1,
    flexDirection:"column",
    justifyContent: "center",
    backgroundColor: "#267fc4",
  },
  containerSignin: {
    flex: 1,
    flexDirection:"column",
    position:'relative',
  
    alignItems: "center",
    backgroundColor: "#267fc4",
  },
  button: {
    borderWidth: 1,
    borderColor: "grey",
    padding: 6,
    borderRadius: 10,
    marginTop: 12,
  },
  modalContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    marginHorizontal: 24,
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  permissionItem: {
    fontSize: 12,
    fontWeight: "bold",
    paddingVertical: 8,
  },
  divider: {
    borderWidth: 0.4,
  },
  grantButton: {
    borderWidth: 1,
    borderColor: "grey",
    padding: 6,
    borderRadius: 10,
    marginTop: 12,
    alignSelf: "center",
    marginBottom: 12,
  },
  messageTab:{
  flex:1,
  display:'flex',
  width:'100%',
  height:10,
  backgroundColor:'#fff'
  },
  customDrawerBorder:{
      borderWidth:2,
      borderColor:"rgba(255,255,255,0.4)",
      borderRadius:15,
      marginTop:20
  },
  upgrade:{
    height:'10%',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    paddingLeft:20
  },
  drawerTextColor:{
    color:'#fff'
  },
  m_textSpace:{
    marginLeft:10
  },
  ms_textSpace:{
    marginLeft:20,
    color:'#fff',
    borderBottomWidth:2,
    borderBottomColor:'#fff',
    paddingBottom:10,
    
  },
  secondSection:{
    height:'30%',
    padding:20
  },
  thirdSection:{
    height:'30%',
    paddingTop:10,
    paddingRight:20,
    paddingBottom:20,
    paddingLeft:20
  },
  flexCustomBetween:{
    width:'100%',
    display:"flex",
    flexDirection:'row',
    justifyContent:"space-between",
    alignItems:'center'
  },
  letteringSize:{
    fontSize:18,
    color:'#fff',
    marginLeft:5
  },
  thirdSectionContentView:{
    display:'flex',
    width:'100%',
    height:'18%',
    alignItems:'center',
    flexDirection:'row'
  },
  thirdSectionContentView_mt:{
   marginTop:10
  },

  siginForm:{
    width:'100%',
    height:'50%',
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
    backgroundColor:'#fff',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    marginTop:'5%',
    padding:20,
    position:'absolute',
    bottom:0,
    left:0,
    
  },
  
  sigupForm:{
    width:'100%',
    height:'60%',
    borderTopLeftRadius:25,
    borderTopRightRadius:25,
    backgroundColor:'#fff',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    marginTop:'5%',
    padding:20,
    position:'absolute',
    bottom:0,
    left:0,
    
  },
  logout:{
    display:'flex',
    flexDirection:'row',
    marginTop:10,
    width:'100%',
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:1,
    borderRadius:12,
    borderColor:'#fff'
  }



});

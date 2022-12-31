import React from 'react';
import {useState} from 'react'
import {ActivityIndicator ,View, Text, ScrollView,TouchableHighlight,Image } from 'react-native'
import FileViewer from "react-native-file-viewer";
import { useEffect } from 'react';
import RNFS from 'react-native-fs';

import storage from '@react-native-firebase/storage';


export default function File({name,size,url,random,socket,id}) {

const loader=<ActivityIndicator animating={true}  size={30} color="#ffffff" />
const fileicon=  <Image style={{ width: 30, height: 30 }} source={require('../images/icons/file2.png')} />
const filename= name.substring(0, 8) +"..." +name.substring( name.lastIndexOf(".") + 1,name.length)
const filesize=bytesToSize(size)
const [loading,setloading]=useState(true);

useEffect(()=>{

    async function call(){
        const base64=await RNFS.readFile(url,"base64")
        const ref=  storage().refFromURL(`gs://sharex-ca8a4.appspot.com/${name+random()}`)
       const uploadTask= ref.putString(base64,'base64');
    uploadTask.then(async ()=>{
        setloading(false);
        const data=await ref.getDownloadURL();
        console.log(data); 

const file={
    durl:data,
    name:name,
    size:size,
    id:id
}
        socket.emit('file',file);
    })
    }

    call();

   

},[])

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    ;
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
 }



async function handleFile(){
    await FileViewer.open(url);
}

    return(
<View  style={{ borderRadius: 20, borderBottomRightRadius: 0, marginRight: 10, width: 200,height:60, paddingVertical: 5, paddingHorizontal: 20, alignSelf: 'flex-end',paddingLeft:10, backgroundColor: 'dodgerblue', marginBottom: 30 }}>

                       
                    <TouchableHighlight underlayColor={"transparent"} onPress={handleFile} style={{flex:1}}>
                       
                    <View style={{flexDirection:'row',alignItems:'center',flex:1}}>

                        <View style={{zIndex:-2,borderRadius:20,width:40,height:40,justifyContent:'center',alignItems:'center',backgroundColor:"#e1dfeb"}}>
                        {loading?loader:fileicon}
                        </View>

                   <View style={{flexDirection:'column'.substring()}}>
                    <Text style={{marginLeft:10, color: '#fffefa', fontSize: 14 }}>{
filename
                    }</Text>
                    <Text style={{marginLeft:10, color: '#fffefa', fontSize: 10 }}>{filesize}</Text>
                    </View>
                         </View>
                    </TouchableHighlight>
                   
               
                </View>
    )

    
}

import React from 'react'
import { View, Text, Button, TextInput, BackHandler,ActivityIndicator, Alert, Image, TouchableHighlight } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import Messages from './Messages';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import storage from '@react-native-firebase/storage';

import File from './File';
import { useRef } from 'react';
import Ifile from './Ifile';


function Chat({ navigation }) {
    const [socket, setsocket] = useState("");
    const [Roomid, setRoomid] = useState("");
    const [message, setmessage] = useState("")
    const [messages, setmessages] = useState([])
    const [singleFile, setSingleFile] = useState('');
    const socketRef=useRef();
    const roomRef=useRef();


 
    useEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want to Disconnect?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                {
                    text: "YES", onPress: () => {
                        console.log("got to home");
                        socketRef.current.emit('client-Diss', {id:roomRef.current});
                        navigation.navigate('Home');
                    }
                }
            ]);
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);
    function random(min = 1, max = 999999) {
        let difference = max - min;
        let rand = Math.random();
        rand = Math.floor(rand * difference);
        rand = rand + min;

        return rand
    }

    useEffect(() => {
         socketRef.current = io("https://socket.ankitzxi05.repl.co");

         socketRef.current.on('clientDisconnect', (data) => {
            socketRef.current.close();
            navigation.navigate('Home');
        })

        socketRef.current.on('sent-message', (data) => {
            const ele = <View key={random(300, 30000)} style={{ borderRadius: 20, borderBottomLeftRadius: 0, marginLeft: 10, maxWidth: 200, paddingVertical: 5, paddingHorizontal: 20, alignSelf: 'flex-start', backgroundColor: 'dodgerblue', marginBottom: 30 }}><Text style={{ color: '#fffefa', fontSize: 17 }} >{data}</Text></View>
            setmessages(messages => [...messages, ele])
        })

        socketRef.current.on('send-file',(file)=>{
            const ele=<Ifile url={file.durl} size={file.size} key={random()} name={file.name} />;
            setmessages(messages => [...messages, ele])
        })

        async function getRoomid() {
            const value = await AsyncStorage.getItem('Roomid');
            socketRef.current.emit('joinRoom', { 'id': Number(value) });
            roomRef.current=value;
            setRoomid(value);
        }

        getRoomid()

        return () => {
            socketRef.current.close();

        }

    }, [])



    function handleMessage() {

        const data = { 'id': Roomid, 'message': message }
          socketRef.current &&   socketRef.current.emit('message', data);
        const ele = <View key={data.id + random()} style={{ borderRadius: 20, borderBottomRightRadius: 0, marginRight: 10, maxWidth: 250, paddingVertical: 5, paddingHorizontal: 20, alignSelf: 'flex-end', backgroundColor: 'dodgerblue', marginBottom: 30 }}><Text style={{ color: '#fffefa', fontSize: 17 }}>{message}</Text></View >
        setmessages(messages => [...messages, ele])
    }
    const selectOneFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
                
            });
        
                
            const file=res[0];

            const ele = <File socket={socketRef.current} random={random} url={file.uri} size={file.size} key={random()} name={file.name} id={Roomid} />        
            setmessages(messages => [...messages, ele]);


        } catch (err) {
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
                alert('Canceled from single doc picker');
            } else {
                //For Unknown Error
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };



    return (
        <>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#17161b',

                }}
            >

                <Messages messages={messages} roomid={Roomid} />


                <View style={{ zIndex: +55, width: 386, position: 'absolute', bottom: 5, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableHighlight onPress={selectOneFile}>
                        <Image style={{ width: 30, height: 30 }} source={require('../images/icons/documents.png')} />
                    </TouchableHighlight>
                    <TextInput
                        style={{ width: 300, borderRadius: 20, borderColor: 'grey', borderBottomWidth: 1, paddingLeft: 20, color: '#fffefa' }}
                        placeholderTextColor='#fffefa'
                        placeholder='enter message here'
                        onChangeText={(text) => setmessage(text)}
                    />
                    <TouchableHighlight onPress={handleMessage}>
                        <Image style={{ width: 25, height: 25 }} source={require('../images/icons/send-message.png')} />
                    </TouchableHighlight>
                </View>
            </View>
        </>
    )
}

export default Chat;
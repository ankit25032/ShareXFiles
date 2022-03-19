import React from 'react'
import { View, Text, Button, TextInput, BackHandler, Alert, Image, TouchableHighlight } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { io } from "socket.io-client";
import Messages from './Messages';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import axios from 'axios';


function Chat({ navigation }) {
    const [socket, setsocket] = useState("");
    const [Roomid, setRoomid] = useState("");
    const [message, setmessage] = useState("")
    const [messages, setmessages] = useState([])
    const [singleFile, setSingleFile] = useState('');

    useEffect(() => {
        const backAction = () => {
            Alert.alert("Hold on!", "Are you sure you want Disconnect?", [
                {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel"
                },
                {
                    text: "YES", onPress: () => {
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
        const newsocket = io("https://socket.ankitzxi05.repl.co");
        setsocket(newsocket);

        newsocket.on('clientDisconnect', (data) => {
            navigation.navigate('Home');
        })

        newsocket.on('sent-message', (data) => {
            const ele = <View key={random(300, 30000)} style={{ borderRadius: 25, borderTopLeftRadius: 0, marginRight: 10, maxWidth: 200, paddingVertical: 5, paddingHorizontal: 20, alignSelf: 'flex-start', backgroundColor: 'dodgerblue', marginBottom: 30 }}><Text style={{ color: '#fffefa', fontSize: 17 }} >{data}</Text></View>
            setmessages(messages => [...messages, ele])
        })

        async function getRoomid() {
            const value = await AsyncStorage.getItem('Roomid');
            newsocket.emit('joinRoom', { 'id': Number(value) });
            setRoomid(value);
        }

        getRoomid()

        return () => {
            newsocket.close();

        }

    }, [])



    function handleMessage() {


        const data = { 'id': Roomid, 'message': message }
        socket && socket.emit('message', data);
        const ele = <View key={data.id + random()} style={{ borderRadius: 25, borderTopRightRadius: 0, marginRight: 10, maxWidth: 250, paddingVertical: 5, paddingHorizontal: 20, alignSelf: 'flex-end', backgroundColor: 'dodgerblue', marginBottom: 30 }}><Text style={{ color: '#fffefa', fontSize: 17 }}>{message}</Text></View >
        setmessages(messages => [...messages, ele])


    }

    const selectOneFile = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
                //There can me more options as well
                // DocumentPicker.types.allFiles
                // DocumentPicker.types.images
                // DocumentPicker.types.plainText
                // DocumentPicker.types.audio
                // DocumentPicker.types.pdf
            });
            //Printing the log realted to the file


            console.log(res);
            var data = new FormData();
            data.append("myfile", {
                name: res[0].fileName,
                type: res[0].type,
                uri: res[0].uri
            });
            console.log(data);
            axios
                .post(
                    "https://inshare-file-sharing-app-api.ankitzxi05.repl.co/api/files",
                    data,
                    {}
                )
                .then((res) => {
                    console.log(res);
                });



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
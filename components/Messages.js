import React from 'react'
import {ActivityIndicator ,View, Text, ScrollView, } from 'react-native'
import File from './File';

function Messages({ roomid, messages }) {


    return (
        <>
            <View style={{ flex: 0.95, width: 380, marginBottom: 45, alignItems: 'center' }}>
                <Text style={{ color: '#fffefa' }}>{roomid}</Text>
                <ScrollView style={{ width: 380, flex: 1, paddingTop: 20 }} >
                    {messages.map((ele) => {
                        return ele;

                    })}
                </ScrollView>
               
            </View>
        </>
    )
}

export default Messages
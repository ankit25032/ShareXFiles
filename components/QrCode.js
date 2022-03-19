import React from 'react';
import { useRef, useEffect } from 'react';
import { View, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';


function QrCode({ navigation }) {

  useEffect(() => {
    scanner.current.reactivate();
    ;
  }, [])

  const scanner = useRef();

  async function onSuccess(e) {

    try {
      await AsyncStorage.setItem('Roomid', e.data);
    } catch (e) {
    }
    navigation.navigate('Chat')
  }

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
        <QRCodeScanner
          onRead={onSuccess}
          ref={scanner}
          topContent={
            <Text >
              Go to
              <Text >wikipedia.org/wiki/QR_code</Text> on
              your computer and scan the QR code.
            </Text>
          }
          bottomContent={

            <Text
              onPress={() => {

              }}
            >
              OK. Got it!
            </Text>

          }
        />
      </View>
    </>
  );
}

export default QrCode;

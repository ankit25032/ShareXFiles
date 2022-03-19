/* eslint-disable */
import React from 'react';
import { useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Linking,
  Button,
} from 'react-native';


const Home = ({ navigation }) => {

  const scanner = useRef();

  function onSuccess(e) {
    console.log(e.data);
  }
  function handleQR() {
    console.log('prees');
    navigation.navigate('Qrcode')
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#17161b',
        zIndex: +4
      }}>
      <View style={styles.character}>
        <Image
          style={{ width: 250, height: 250 }}
          source={require('../images/main.png')}
        />
      </View>
      <View style={styles.minicontainer}>
        <Text style={styles.text}>Enter The Code</Text>
        <TextInput
          maxLength={5}
          placeholderTextColor="#f5eceb"
          placeholder="Enter Share ID here"
          keyboardType="number-pad"
          style={styles.input}
        />
        <View style={{ margin: 10 }}>
          <Button
            onPress={handleQR}
            title="Connect"
            color="#211f1f"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
        <Text style={styles.text}>OR</Text>
        <View style={styles.qrbtn}>
          <Button
            onPress={handleQR}
            title="Scan With QR Code"
            color="#7c2bff"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  input: {
    width: '80%',
    height: 40,
    margin: 12,

    padding: 10,
    color: '#f5eceb',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  character: {
    width: 250,
    height: 250,
    position: 'absolute',
    top: 20,
  },
  minicontainer: {
    flex: 0.5,
    width: 380,
    position: 'relative',
    bottom: -200,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#131316',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  text: {
    color: 'white',
  },
  qrbtn: {
    marginTop: 10,
  },
});

export default Home;

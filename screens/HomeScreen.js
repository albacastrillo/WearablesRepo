// HomeScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

import Colors from '../constants/Colors'; 

export default function HomeScreen() {
  const navigation = useNavigation();

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(moment().format('MMMM Do YYYY'));
  }, []);

  const handleBoxPress = (screenName) => {
    navigation.navigate(screenName);
  }

  const handleBloatingPress = () => {
    navigation.navigate('Bloating');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.date}>Today, {currentDate}</Text>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.box} onPress={() => handleBoxPress('Breakfast')}>
          <Image source={require('../assets/images/coffee.png')} style={styles.image} />
          <Text style={styles.boxText}>Breakfast</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => handleBoxPress('LunchScreen')}>
          <Image source={require('../assets/images/sandwich.png')} style={styles.image} />  
          <Text style={styles.boxText}>Lunch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => handleBoxPress('DinnerScreen')}>
          <Image source={require('../assets/images/spaghetti.png')} style={styles.image} />
          <Text style={styles.boxText}>Dinner</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={() => handleBoxPress('SnacksScreen')}>
          <Image source={require('../assets/images/chocolate.png')} style={styles.image} />
          <Text style={styles.boxText}>Snacks</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.bloatingButton} onPress={handleBloatingPress}>
        <Image source={require('../assets/images/Logo.png')} style={styles.bloatingImage} />
        <Text style={styles.bloatingText}>Bloating</Text>
      </TouchableOpacity>

      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.bottomBox}>
          <Image source={require('../assets/images/water.webp')} style={styles.bottomImage} />
          <View style={styles.bottomTextBox}>
            <Text style={styles.boxText}>Water intake</Text>
            <Text style={styles.bottomText2}>1,5 L</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBox}>
          <Image source={require('../assets/images/toilet.png')} style={styles.bottomImage} />
          <View style={styles.bottomTextBox}>
            <Text style={styles.boxText}>Toilet visits</Text>
            <Text style={styles.bottomText2}>4</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.bottomBox}>
          <Image source={require('../assets/images/walking.png')} style={styles.bottomImage} />
          <View style={styles.bottomTextBox}>
            <Text style={styles.boxText}>Steps</Text>
            <Text style={styles.bottomText2}>10.342</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBox}>
          <Image source={require('../assets/images/running.png')} style={styles.bottomImage} />
          <View style={styles.bottomTextBox}>
            <Text style={styles.boxText}>Exercise</Text>
            <Text style={styles.bottomText2}>3 km</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    //flexDirection: 'row',
    //flexWrap: 'wrap',
    //justifyContent: 'space-between',
    flex: 1,
    //alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
  },
  date: {
    fontSize: 16,
    //fontWeight: 'semibold',
    color: Colors.primary,
    marginBottom: 16,
    alignSelf: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    //alignItems: 'center',
    marginBottom: 20,
  },
  box: {
    width: '23%',
    height: 100,
    backgroundColor: Colors.grayLight,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  boxText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
  },
  image: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 10,
    marginVertical: 5,
    marginTop: 10,
  },
  bloatingButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  bloatingText: {
    color: Colors.white,
    fontWeight: 'bold',
    marginTop: -20,
    fontSize: 12,
  },
  bloatingImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginTop: -20,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bottomBox: {
    width: '48.5%', 
    height: 100,
    backgroundColor: Colors.grayLight,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bottomText2: {
    fontSize: 16,
    //fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 10,
  },
  bottomImage: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
    borderRadius: 10,
    marginVertical: 5,
    marginTop: 10,
  },
  bottomTextBox: {
    marginLeft: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});
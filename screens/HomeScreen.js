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

      <View style={styles.outerCircle}>
        <TouchableOpacity style={styles.bloatingButton} onPress={handleBloatingPress}>
          <Text style={styles.bloatingText}>Bloating</Text>
          <Image source={require('../assets/images/Logo.png')} style={styles.bloatingImage} />
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow1}>
        <TouchableOpacity style={styles.bottomBox}>
          <Image source={require('../assets/images/water.webp')} style={styles.bottomImage} />
          <View style={styles.bottomTextBox}>
            <Text style={styles.bottomText1}>Water intake</Text>
            <Text style={styles.bottomText2}>1,5 L</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBox}>
          <Image source={require('../assets/images/toilet.png')} style={styles.bottomImage} />
          <View style={styles.bottomTextBox}>
            <Text style={styles.bottomText1}>Toilet visits</Text>
            <Text style={styles.bottomText2}>4</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow2}>
        <TouchableOpacity style={styles.bottomBox}>
          <Image source={require('../assets/images/walking.png')} style={styles.bottomImage} />
          <View style={styles.bottomTextBox}>
            <Text style={styles.bottomText1}>Steps</Text>
            <Text style={styles.bottomText2}>10.342</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBox}>
          <Image source={require('../assets/images/running.png')} style={styles.bottomImage} />
          <View style={styles.bottomTextBox}>
            <Text style={styles.bottomText1}>Exercise</Text>
            <Text style={styles.bottomText2}>3 km</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
    justifyContent: 'space-between', // Align the bloating button at the bottom
  },
  date: {
    fontSize: 16,
    color: Colors.primary,
    alignSelf: 'center',
    marginBottom: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  box: {
    width: '23%',
    height: 100,
    backgroundColor: Colors.grayLight,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    //marginVertical: 10,
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
    marginTop: 16,
  },
  outerCircle: {
    alignSelf: 'center',
    width: 155, // Adjust as needed, should be larger than bloatingButton
    height: 155, // Adjust as needed, should be larger than bloatingButton
    borderRadius: 100, // Half of width and height
    backgroundColor: 'transparent', // No background color
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5, // Adjust as needed for border thickness
    borderColor: Colors.primaryLight, // Adjust as needed for border color
    marginBottom: 8,
},
  bloatingButton: {
    alignSelf: 'center', // Align the button in the center horizontally
    width: 140,
    height: 140,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloatingText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 18,
    position: 'absolute', // Position the text absolutely within the button
    top: 30, // Adjust as needed to move the text up
  },
  bloatingImage: {
    width: 90,
    marginTop: 40,
    resizeMode: 'contain',
  },
  bottomRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomRow2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 70,
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
  bottomText1: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 8,
    marginBottom: 2,
  },
  bottomText2: {
    fontSize: 18,
    color: Colors.black,
    marginBottom: 20,
  },
  bottomImage: {
    width: '60%',
    height: '60%',
    resizeMode: 'contain',
    borderRadius: 10,
    marginVertical: 5,
    marginTop: 10,
    marginLeft: -20,
  },
  bottomTextBox: {
    marginLeft: -5,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

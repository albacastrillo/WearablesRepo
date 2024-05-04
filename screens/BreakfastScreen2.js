// BreakfastScreen.js

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, Button } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Checkbox } from 'react-native-paper'; 
import { PermissionsAndroid } from 'react-native';

import Colors from '../constants/Colors'; 

// Import the CameraScreen component
import CameraScreen from './CameraScreen';

// Request camera permission
async function requestCameraPermission(navigation) {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "AI logging",
        message:
          "Take a picture of your food and an AI will " +
          "detect and save what is on your plate!",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Camera permission granted");
      // Navigate to CameraScreen when permission is granted
      navigation.navigate('Camera');
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn(err);
  }
}

// Sample data for breakfast items
const breakfastItems = [
  { id: 20, name: 'Toast', image: require('../assets/images/toast.jpg') },
  { id: 21, name: 'Eggs', image: require('../assets/images/eggs.jpg') },
  { id: 22, name: 'Coffee', image: require('../assets/images/coffee.jpeg') },
  // Add more breakfast items here
];

const moreOptionsItems = [
  { id: 1, name: 'Tea', image: require('../assets/images/tea.png') },
  { id: 2, name: 'Pastry', image: require('../assets/images/croissant.jpg') },
  { id: 3, name: 'Strawberries', image: require('../assets/images/strawberries.jpg') },
  //{ id: 4, name: 'Bananas', image: require('../assets/images/banana.jpeg') },
  // Add more breakfast items here
];

export default function BreakfastScreen({ navigation }) {
  const [checked, setChecked] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState('');
  const [currentDate, setCurrentDate] = useState('');

  const handleAddItem = () => {
    if (searchInput.trim() !== '') {
      const existingItem = breakfastItems.concat(moreOptionsItems).find(item => item.name.toLowerCase() === searchInput.toLowerCase());
      if (existingItem) {
        if (!checked.includes(existingItem.id)) {
          setChecked([...checked, existingItem.id]);
        }
      } else {
        let image;
        if (searchInput.toLowerCase() === 'banana') {
          image = require('../assets/images/banana.jpeg');
        } else {
          image = require('../assets/no_image.png');
        }

        const newItem = {
          id: moreOptionsItems.length + 1,
          name: searchInput,
          image: image,
        };
        moreOptionsItems.unshift(newItem);
        setChecked([...checked, newItem.id]);
      }
      setSearchInput('');
    }
  };
  
  useEffect(() => {
    setCurrentDate(moment().format('MMMM Do YYYY'));
  }, []);

  const renderItem1 = ({ item }) => (
    <View style={styles.item1}>
      <View style={styles.itemContent}>
        <Image source={item.image} style={styles.itemImage} />
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
      <Checkbox
        status={checked.includes(item.id) ? 'checked' : 'unchecked'}
        onPress={() => {
          if (checked.includes(item.id)) {
            setChecked(checked.filter(checkedId => checkedId !== item.id));
          } else {
            setChecked([...checked, item.id]);
          }
        }}
        color={Colors.primary}
      />
    </View>
  );

  const renderItem2 = ({ item }) => (
    <View style={styles.item2}>
      <View style={styles.itemContent}>
        <Image source={item.image} style={styles.itemImage} />
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
      <Checkbox
        status={checked.includes(item.id) ? 'checked' : 'unchecked'}
        onPress={() => {
          if (checked.includes(item.id)) {
            setChecked(checked.filter(checkedId => checkedId !== item.id));
          } else {
            setChecked([...checked, item.id]);
          }
        }}
        color={Colors.primary}
      />
    </View>
  );

  
  const handleSave = () => {
    alert('Your breakfast has been logged.');

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.date}>Today, {currentDate}</Text>

      <View style={styles.searchBarContainer}>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Search..."
          value={searchInput}
          onChangeText={text => setSearchInput(text)}
          onSubmitEditing={handleAddItem}
        />
        <TouchableOpacity onPress={() => requestCameraPermission(navigation)} style={styles.cameraButton}>
          <Icon name="camera" size={30} color={Colors.grayDark} />
        </TouchableOpacity>
      </View>
        
      <Text style={styles.sectionTitle}>Frequently eaten</Text>
      <FlatList
        data={breakfastItems}
        renderItem={renderItem1}
        style={{marginBottom: 8}}
      />

      <Text style={styles.sectionTitle}>Recently eaten</Text>
      <FlatList
        data={moreOptionsItems}
        renderItem={renderItem2}
        keyExtractor={item => item.id.toString()}
        style={{marginBottom: 30}}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  date: {
    fontSize: 16,
    color: Colors.primary,
    marginTop: 8,
    marginBottom: 4,
    alignSelf: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 16,
    marginRight: 16,
    marginTop: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    marginBottom: 8,
  },
  cameraButton: {
    marginLeft: 10
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
  },
  item1: {
    backgroundColor: Colors.primaryLight,
    marginBottom: 5,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 5,
  },
  item2: {
    backgroundColor: Colors.grayLight,
    marginBottom: 5,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 5,
  },
  itemContent: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginLeft: 12,
  },
  itemImage: {
    width: 43,
    height: 43,
    borderRadius: 10,
    //marginBottom: 5,
    //marginLeft: 10
  },
  itemText: {
    textAlign: 'center',
    marginLeft: 16,
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  button: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 20, // Add more padding to the left
    paddingRight: 20, 

  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

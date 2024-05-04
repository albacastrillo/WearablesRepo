// BreakfastScreen.js

import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Checkbox } from 'react-native-paper'; 
import { PermissionsAndroid } from 'react-native';

import Colors from '../constants/Colors'; 

// Request camera permission
async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: "AI logging",
        message:
          "Take a picture of your food and an AI will " +
          "detect and save what is on your plate!",
        /*buttonNeutral: "Ask Me Later",*/
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
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
  { id: 4, name: 'Bananas', image: require('../assets/images/banana.jpeg') },
  // Add more breakfast items here
];

export default function BreakfastScreen({ navigation }) {
  const [checked, setChecked] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState(''); // Add this line
  const [currentDate, setCurrentDate] = useState('');

  const handleAddItem = () => {
    if (searchInput.trim() !== '') {
      // Check if the item already exists in the breakfastItems or moreOptionsItems array
      const existingItem = breakfastItems.concat(moreOptionsItems).find(item => item.name.toLowerCase() === searchInput.toLowerCase());
  
      if (existingItem) {
        // If the item exists, just select it
        if (!checked.includes(existingItem.id)) {
          setChecked([...checked, existingItem.id]);
        }
      } else {
        // If the item doesn't exist, add it to the moreOptionsItems array and select it
        const newItem = {
          id: moreOptionsItems.length + 1,
          name: searchInput,
          image: require('../assets/no_image.png'),
        };
        //moreOptionsItems.push(newItem);
        moreOptionsItems.unshift(newItem);
        setChecked([...checked, newItem.id]);
      }
  
      setSearchInput('');
    }
  };
  
  useEffect(() => {
    setCurrentDate(moment().format('MMMM Do YYYY'));
  }, []);

  // Function to render each breakfast item
  const renderItem = ({ item }) => (
    <View style={styles.item}>
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
        <TouchableOpacity onPress={requestCameraPermission} style={styles.cameraButton}>
          <Icon name="camera" size={30} color="#000" />
        </TouchableOpacity>
      </View>
        
      <Text style={styles.sectionTitle}>Frequently eaten</Text>
      <FlatList
        data={breakfastItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        style={{backgroundColor: Colors.primaryLight, marginBottom:1}}
      />

      <Text style={styles.sectionTitle}>Recently eaten</Text>
      <FlatList
        data={moreOptionsItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 10,
  },
  date: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 16,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchBarContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  cameraButton: {
    marginLeft: 10
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 16,
  },
  item: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between'
  },
  itemContent: {
    flexDirection: 'row', 
    alignItems: 'center'
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginBottom: 5,
    marginLeft: 10
  },
  itemText: {
    textAlign: 'center',
    marginLeft: 20
  },
});

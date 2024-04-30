// BloatingScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, FlatList, Keyboard } from 'react-native';
import moment from 'moment';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../constants/Colors';

const symptoms = [
  { name: 'Belching', image: require('../assets/images/belching.png') },
  { name: 'Diarrhea', image: require('../assets/images/diarrhea.png') },
  { name: 'Farting', image: require('../assets/images/farting.png') },
  { name: 'Gassy', image: require('../assets/images/gassy.png') },
  { name: 'Heartburn', image: require('../assets/images/heartburn.png') },
  { name: 'Heaviness', image: require('../assets/images/heaviness.png') },
  { name: 'Pain', image: require('../assets/images/pain.png') },
  { name: 'Puking', image: require('../assets/images/puke.png') },
  // Add more symptoms...
];

export default function BloatingScreen({ navigation }) {
  const [customSymptom, setCustomSymptom] = useState('');
  const [severity, setSeverity] = useState(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptoms, setCustomSymptoms] = useState([]);

  const handleSave = () => {
    setSelectedSymptoms([]);
    setSeverity(5);
    setCustomSymptoms([]);
    setCustomSymptom('');
    alert('Your symptoms have been logged.');
  };

  const handleSymptomPress = (symptom) => {
    setSelectedSymptoms(prev => {
      if (prev.includes(symptom)) {
        return prev.filter(s => s !== symptom);
      } else {
        return [...prev, symptom];
      }
    });
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() !== '') {
      setCustomSymptoms(prev => [...prev, customSymptom]);
      setCustomSymptom('');
      Keyboard.dismiss();
    }
  };

  const handleRemoveSymptom = (index) => {
    setCustomSymptoms(prev => prev.filter((_, i) => i !== index));
  };

  const saveData = async () => {
    const data = {
      selectedSymptoms: selectedSymptoms,
      severity: severity
    };
    try {
      await AsyncStorage.setItem('symptomData', JSON.stringify(data));
      // You can add any additional logic here, like navigating to another screen or showing a success message.
    } catch (error) {
      console.log("Error saving data:", error);
    }
  };

  const retrieveData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('symptomData');
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        // Display the saved symptoms as a message
        alert(`Selected Symptoms: ${data.selectedSymptoms.join(', ')}, Severity: ${data.severity}`);
      } else {
        alert('No saved data found.');
      }
    } catch (error) {
      console.log("Error retrieving data:", error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.date}>Today, {moment().format('MMMM Do YYYY')}</Text>
      
      <Text style={styles.sectionTitle}>How are you feeling?</Text>

      <FlatList
        data={symptoms}
        renderItem={({ item: symptom }) => (
          <TouchableOpacity 
            style={[
              styles.button, 
              {backgroundColor: selectedSymptoms.includes(symptom.name) ? Colors.primaryLight : Colors.grayLight}
            ]}
            onPress={() => handleSymptomPress(symptom.name)}
          >
            <Image source={symptom.image} style={styles.image} />
            <Text style={styles.buttonText}>{symptom.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
        numColumns={4}
      />

      <Text>Other:</Text>
      <TextInput
        style={styles.input}
        value={customSymptom}
        onChangeText={setCustomSymptom}
        placeholder="Enter your symptom..."
        onSubmitEditing={handleAddCustomSymptom}
      />

      <View style={styles.customSymptomsContainer}>
        {customSymptoms.map((symptom, index) => (
          <View key={index} style={styles.customSymptom}>
            <Text style={styles.customSymptomText}>{symptom}</Text>
            <TouchableOpacity onPress={() => handleRemoveSymptom(index)}>
              <Text style={styles.removeSymptom}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>How severe is your bloating?</Text>
      <Text>Severity: {severity}</Text>
      <Slider
        value={severity}
        onValueChange={setSeverity}
        minimumValue={1}
        maximumValue={10}
        step={1}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.gray}
        thumbTintColor={Colors.primary}
      />
      <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    padding: 15,
    backgroundColor: Colors.white,
  },
  container2: {
    padding: 15,
    backgroundColor: Colors.white,
  },
  date: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 16,
    alignSelf: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 16,
  },
  button: {
    //borderWidth: 1,
    borderRadius: 10,
    //borderColor: Colors.primaryLight,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '23%',
    alignSelf: 'center',
    margin: 3.5, 
  },
  buttonText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  image: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  customSymptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  customSymptom: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    height: 40,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.grayLight,
    alignSelf: 'flex-start',
    marginRight: 10,
  },
  customSymptomText: {
    color: Colors.grayDark,
    fontSize: 12,
    fontWeight: 'bold',
  },
  removeSymptom: {
    marginLeft: 12,
    color: Colors.grayDark,
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    alignItems: 'center',

  },
});
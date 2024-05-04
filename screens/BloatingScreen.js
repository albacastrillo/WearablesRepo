// BloatingScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Image, FlatList, Keyboard, Platform } from 'react-native';
import moment from 'moment';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';


import Colors from '../constants/Colors';

const symptoms = [
  { name: 'Swelling', image: require('../assets/symptoms/swelling.png') },
  { name: 'Gassy', image: require('../assets/symptoms/gassy.png') },
  { name: 'Constipation', image: require('../assets/symptoms/Constipation.png') },
  { name: 'Pain', image: require('../assets/symptoms/pain.png') },
  { name: 'Belching', image: require('../assets/symptoms/belching.png') },
  { name: 'Nausea', image: require('../assets/symptoms/nausea.png') },
  { name: 'Diarrhea', image: require('../assets/symptoms/diarrhea.png') },
  { name: 'Headache', image: require('../assets/symptoms/headache.png') },
  // Add more symptoms...
];

export default function BloatingScreen({ navigation }) {
  const [customSymptom, setCustomSymptom] = useState('');
  const [severity, setSeverity] = useState(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [customSymptoms, setCustomSymptoms] = useState([]);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const handleSave = () => {
    setSelectedSymptoms([]);
    setSeverity(5);
    setCustomSymptoms([]);
    setCustomSymptom('');
    alert('Your symptoms have been logged.');

    navigation.goBack();
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
  
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showTimepicker = () => {
    showMode('time');
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
        style={{marginHorizontal: -16}}
        value={severity}
        onValueChange={setSeverity}
        minimumValue={1}
        maximumValue={10}
        step={1}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor={Colors.gray}
        thumbTintColor={Colors.primary}
      />

      <View>
        <Text style={styles.sectionTitle}>What time were you bloated?</Text>
        <TouchableOpacity style={styles.buttonTime} onPress={showTimepicker}>
          <Text style={styles.buttonTimeText}>{date.toLocaleTimeString()}</Text>
        </TouchableOpacity>
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
          color={Colors.primary}
        />
      )}

      <View style={styles.container}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
    fontSize: 9.5,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  image: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
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
    right: 10,
    bottom: 10,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 20, // Add more padding to the left
    paddingRight: 20, 
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonTimeText: {
    color: 'black',
  },
});
import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import data from '../bloating_data.json';
import foodData from '../food_data.json';
import moment from 'moment';


const Stack = createStackNavigator();

export default function AnalyticsScreen2({ navigation }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [selectedFoodData, setSelectedFoodData] = useState([]);
  const [bloatingMetric, setBloatingMetric] = useState(0); 

  useEffect(() => {
    // Get the date 30 days ago
    const thirtyDaysAgo = moment().subtract(30, 'days');
  
    // Filter the data for the last 30 days
    const lastThirtyDaysData = data.filter(item => {
      const date = moment(item.date);
      return date.isSameOrAfter(thirtyDaysAgo);
    });
  
    // Extract unique dates affected by bloating
    const uniqueDates = new Set();
    lastThirtyDaysData.forEach(item => {
      const date = moment(item.date).format('YYYY-MM-DD');
      uniqueDates.add(date);
    });
  
    // Calculate the number of unique days affected by bloating
    const bloatingMetric = uniqueDates.size;
    setBloatingMetric(bloatingMetric);


}, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth > 0) {
      setCurrentMonth(currentMonth - 1);
    } else {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth < 11) {
      setCurrentMonth(currentMonth + 1);
    } else {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    }
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const days = Array.from({ length: daysInMonth + firstDayOfWeek }, (_, i) => {
    const day = i - firstDayOfWeek + 1;
    return day > 0 ? day : null;
  });

  const getDayColor = day => {
    const item = data.find(d => {
      const dDate = new Date(d.date);
      return dDate.getDate() === day && dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear;
    });
    if (item) {
      const green = Math.max(0, Math.floor(178 - item.severity * 20)).toString(16).padStart(2, '0');
      const blue = Math.max(0, Math.floor(40 - item.severity * 5)).toString(16).padStart(2, '0');
      return `#E0${green}${blue}`;
    }
    return '#FFFFFF';
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    const dayData = data.find(d => {
      const dDate = new Date(d.date);
      return dDate.getDate() === day && dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear;
    });
    setSelectedDayData(dayData);
    const foodDayData = foodData.filter(d => {
      const dDate = new Date(d.date);
      return dDate.getDate() === day && dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear;
    });
    setSelectedFoodData(foodDayData);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handlePrevMonth}>
          <Text style={styles.arrow}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.yearText}>{`${currentMonth + 1}/${currentYear}`}</Text>
        <TouchableOpacity style={styles.button} onPress={handleNextMonth}>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendar}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayOfWeek, index) => (
          <Text key={index} style={styles.dayOfWeek}>{dayOfWeek}</Text>
        ))}
        {days.map((day, index) => (
          <TouchableOpacity key={index} style={[styles.day, { backgroundColor: day ? getDayColor(day) : 'transparent' }]} onPress={() => handleDayClick(day)}>
            {day && <Text style={styles.dayText}>{day}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Popup or overlay */}
      <Modal visible={selectedDay !== null} animationType="slide">
        <View style={styles.popupContainer}>
          {selectedDayData && (
            <View style={styles.selectedDataContainer}>
              <Text style={styles.selectedDate}>{`${selectedDayData.date}`}</Text>
              <Text>{`Bloating Severity: ${selectedDayData.severity}`}</Text>
              <Text>{`Hour: ${selectedDayData.hour}`}</Text>
              <Text>{`Symptoms: ${selectedDayData.symptoms}`}</Text>
            </View>
          )}

          {selectedFoodData.length > 0 && (
            <View style={styles.foodDataContainer}>
              <Text style={styles.foodTitle}>Food Intake</Text>
              {selectedFoodData.map((food, index) => (
                <View key={index} style={styles.foodItem}>
                  <Text>{`${food.meal} (${food.hour}): ${food.food}`}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedDay(null)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.metricContainer}>
        <Text style={styles.metricLabel}>Bloating Last 30 Days</Text>
        <Text style={styles.metricValue}>{`${bloatingMetric}/30`}</Text>
      </View>



    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  metricContainer: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF5733',
  },
  metricLabel: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 10,
  },
  arrow: {
    fontSize: 20,
  },
  yearText: {
    fontSize: 20,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  dayOfWeek: {
    width: '14%',
    textAlign: 'center',
  },
  day: {
    width: '14%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    color: '#000',
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  selectedDataContainer: {
    marginBottom: 30,
  },
  selectedDate: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  foodDataContainer: {
    marginBottom: 20,
  },
  foodTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  foodItem: {
    marginBottom: 5,
  },
  closeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#F3F3F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

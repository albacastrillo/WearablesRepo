import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, Modal, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Chart from '../components/BrushBarChart.js'; // Assuming the component is in a file called BarChart.js

import data from '../bloating_data.json';
import foodData from '../food_data.json';
import moment from 'moment';
import SearchFoodSeverity from "../components/SearchFood.js"
import PieChartComponent from "../components/PieChart.js"

const Stack = createStackNavigator();

export default function AnalyticsScreen2({ navigation }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState(null);
  const [selectedFoodData, setSelectedFoodData] = useState([]);
  const [bloatingMetric, setBloatingMetric] = useState(0);
  const [worstFoodsData, setWorstFoodsData] = useState([]);
  const [infoPopupVisible, setInfoPopupVisible] = useState(false);

  const foodAverageSeverity = {
    "scrambled eggs": 8.2,
    "toast": 7.5,
    "grilled chicken": 7.5,
    "Fast Food": 7.5,
    "Cucumber": 7.0,
    "Bananas": 6.5,
    "Soda": 6.2,
    "Beers": 6.0,
    "Processed Snacks": 6.0,
    "Hummus": 6.0,
    "Ham": 5.8,
    "Eggplant": 5.2,
    "sushi rolls": 5.0,
    "coffee": 1.0,
  };

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

    WorstFoodsPodium();
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

  const handleInfoPress = () => {
    setInfoPopupVisible(true);
  };

  const handleInfoPopupClose = () => {
    setInfoPopupVisible(false);
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
      return (
        dDate.getDate() === day &&
        dDate.getMonth() === currentMonth &&
        dDate.getFullYear() === currentYear
      );
    });
    if (item) {
      const green = Math.max(0, Math.floor(178 - item.severity * 20))
        .toString(16)
        .padStart(2, '0');
      const blue = Math.max(0, Math.floor(40 - item.severity * 5))
        .toString(16)
        .padStart(2, '0');
      return `#E0${green}${blue}`;
    }
    return '#FFFFFF';
  };

  const WorstFoodsPodium = () => {
    // Define worstFoodsData here
    const worstFoodsData = [
      { name: 'Fast Food', severity: '7.5' },
      { name: 'Soda', severity: '6.2' },
      { name: 'Processed Snacks', severity: '6.0' },
    ];
    setWorstFoodsData(worstFoodsData);
  };

  const getPodiumImage = index => {
    switch (index) {
      case 0:
        return require('../assets/images/puke.png');
      case 1:
        return require('../assets/images/puke.png');
      case 2:
        return require('../assets/images/puke.png');
      default:
        return null;
    }
  };

  const handleDayClick = day => {
    setSelectedDay(day);
    const dayData = data.find(d => {
      const dDate = new Date(d.date);
      return (
        dDate.getDate() === day &&
        dDate.getMonth() === currentMonth &&
        dDate.getFullYear() === currentYear
      );
    });
    setSelectedDayData(dayData);
    const foodDayData = foodData.filter(d => {
      const dDate = new Date(d.date);
      return (
        dDate.getDate() === day &&
        dDate.getMonth() === currentMonth &&
        dDate.getFullYear() === currentYear
      );
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
          <Text key={index} style={styles.dayOfWeek}>
            {dayOfWeek}
          </Text>
        ))}
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.day,
              { backgroundColor: day ? getDayColor(day) : 'transparent' },
            ]}
            onPress={() => handleDayClick(day)}>
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
        <Text style={styles.podiumTitle}>Bloating Last 30 Days</Text>
        <Text style={styles.metricValue}>{`${bloatingMetric}/30`}</Text>
      </View>
      <View style={styles.podiumContainer}>
        <View style={styles.podiumTitleContainer}>
          <Text style={styles.podiumTitle}>Top 3 Worst Foods</Text>
          <TouchableOpacity onPress={handleInfoPress}>
            <Image
              source={require('../assets/images/info_icon.png')}
              style={styles.infoIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.podiumItemsContainer}>
          {worstFoodsData.map((food, index) => (
            <View key={index} style={styles.podiumItem}>
              <Image
                source={getPodiumImage(index)}
                style={styles.podiumImage}
              />
              <View style={styles.podiumTextContainer}>
                <Text style={styles.podiumName}>{food.name}</Text>
                <Text style={styles.podiumSeverity}>{`Average Severity: ${food.severity}`}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.podiumTitle}>All Foods and Average Severity</Text>
      <ScrollView horizontal={true} nestedScrollEnabled={true}>
      {/*
      <View>
        <SearchFoodSeverity foodAverageSeverity={foodAverageSeverity}/>
      </View>
      */}
            <Chart foodAverageSeverity={foodAverageSeverity} />
      </ScrollView>

      <View style={styles.metricContainer}>
      <Text style={styles.podiumTitle}>Symptoms Across All Time</Text>

        <PieChartComponent bloatingData={data}/>
      </View>
      
      {/* Information Popup */}
      {infoPopupVisible && (
        <View style={styles.infoPopupContainer}>
          <View style={styles.infoPopup}>
            <Text style={styles.infoText}>
              These select food items have been selected by an algorithm, based on their occurrences, severity and dispersion across different meals.
            </Text>
            <TouchableOpacity onPress={handleInfoPopupClose}>
              <Text style={styles.closeInfoPopupButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  brushChartContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  podiumContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center', 
  },
  podiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  podiumItemsContainer: {
    flexDirection: 'column', 
    alignItems: 'center', 
  },
  podiumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  podiumImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  podiumTextContainer: {
    flex: 1,
  },
  podiumName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  podiumSeverity: {
    color: 'red',
  },
  podiumTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  podiumTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoIcon: {
    width: 15,
    height: 15,
    marginBottom: 20, // Adjust the value as needed to lift the icon higher than the title
    marginLeft: 10,
  },
  infoPopupContainer: {
    position: 'absolute',
    top: '30%', 
    left: '18%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 999, // Ensure it appears on top of other content
  },
  infoPopup: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeInfoPopupButton: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginLeft: 'auto', // Pushes the button to the right
  },
});

import React, { useState, useEffect } from 'react';
import { ScrollView, View, TouchableOpacity, Text, StyleSheet, Modal, Button, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import Chart from '../components/BrushBarChart.js'; // Assuming the component is in a file called BarChart.js
import MonthChart from '../components/MonthChart';
import DayChart from '../components/DayChart';
import HourChart from '../components/HourChart';

import data from '../bloating_data.json';
import foodData from '../food_data.json';
import moment from 'moment';
import SearchFoodSeverity from "../components/SearchFood.js"
import PieChartComponent from "../components/PieChart.js"
import Colors from '../constants/Colors.js';

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
  const [filteredData, setFilteredData] = useState([]);
  const [chartType, setChartType] = useState('month');

  const foodAverageSeverity = {
      "French fries": 9.1,
      "Cake": 8.8,
      "Broccoli": 8.2,
      "Eggs": 8.0,
      "Toast": 7.5,
      "Chicken": 7.5,
      "Cucumber": 7.0,
      "Bananas": 6.5,
      "Beer": 6.0,
      "Hummus": 6.0,
      "Ham": 5.8,
      "Eggplant": 5.2,
      "Sushi": 5.0,
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

      const selectedMonth = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        const newFilteredData = data.filter(item => item.date.startsWith(selectedMonth));
        setFilteredData(newFilteredData);

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
          const red = Math.max(0, Math.floor(255 - item.severity * 8))
              .toString(16)
              .padStart(2, '0');
          const green = Math.max(0, Math.floor(220 - item.severity * 8))
              .toString(16)
              .padStart(2, '0');
          const blue = Math.max(0, Math.floor(100 - item.severity * 8))
              .toString(16)
              .padStart(2, '0');
          return `#${red}${green}${blue}`;
      }
      return '#FFFFFF';
  };

  const WorstFoodsPodium = () => {
      // Define worstFoodsData here
      const worstFoodsData = [
          { name: 'French fries', severity: '9.1' },
          { name: 'Cake', severity: '8.8' },
          { name: 'Broccoli', severity: '8.2' },
      ];
      setWorstFoodsData(worstFoodsData);
  };

  const getPodiumImage = index => {
      switch (index) {
          case 0:
              return require('../assets/images/french_fries.jpg');
          case 1:
              return require('../assets/images/cake.webp');
          case 2:
              return require('../assets/images/brocoli.webp');
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

  // Prepare an empty object for each chart
  const occurrencesPerMonth = {};
  const occurrencesPerDay = {};
  const occurrencesPerHour = {};

  // Process each item in the data
  data.forEach(item => {
      const date = new Date(item.date);
      const hour = parseInt(item.hour.split(':')[0]);

      // Update the occurrences per month
      const month = date.getMonth();
      occurrencesPerMonth[month] = (occurrencesPerMonth[month] || 0) + 1;

      // Update the occurrences per day of the week
      const day = date.getDay();
      occurrencesPerDay[day] = (occurrencesPerDay[day] || 0) + 1;

      // Update the occurrences per hour
      occurrencesPerHour[hour] = (occurrencesPerHour[hour] || 0) + 1;
  });

  console.log(occurrencesPerMonth);
  console.log(occurrencesPerDay);
  console.log(occurrencesPerHour);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonarrow} onPress={handlePrevMonth}>
          <Text style={styles.arrow}>&lt;</Text>
        </TouchableOpacity>
        <Icon name="calendar-o" size={20} color={Colors.primary} />
        <View style={{ width: 10 }} />
        <Text style={styles.yearText}>{`${new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long' })} ${currentYear}`}</Text>
        <TouchableOpacity style={styles.buttonarrow} onPress={handleNextMonth}>
          <Text style={styles.arrow}>&gt;</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendar}>
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((dayOfWeek, index) => (
          <Text key={index} style={styles.dayOfWeek}>
            {dayOfWeek}
          </Text>
        ))}
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.day,
              { backgroundColor: day ? getDayColor(day) : 'transparent', borderColor: '#f0f0f0', borderWidth: 0.5 },
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
              <Text style={styles.SectionTitle}>{`${selectedDayData.date}`}</Text>
              <Text>{`Bloating Severity: ${selectedDayData.severity}`}</Text>
              <Text>{`Hour: ${selectedDayData.hour}`}</Text>
              <Text>{`Symptoms: ${selectedDayData.symptoms}`}</Text>
            </View>
          )}

          {selectedFoodData.length > 0 && (
            <View style={styles.foodDataContainer}>
              <Text style={styles.SectionTitle}>Food Intake</Text>
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
        <Text style={styles.metricTitle}>Bloating in the last 30 days</Text>
        <Text style={styles.metricValue}>{`${bloatingMetric}/30`}</Text>
      </View>

      <View style={styles.podiumTitleContainer}>
        <Text style={styles.SectionTitle}>Top 3 Worst Foods</Text>
        <View style={{ width: 10 }} />
        <TouchableOpacity onPress={handleInfoPress}>
          <Icon name="info-circle" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
        
      <View style={styles.podiumItemsContainer}>
        {worstFoodsData.map((food, index) => (
          <View key={index} style={styles.podiumItemBox}>
            <View key={index} style={styles.podiumItem}>
              <Image
                source={getPodiumImage(index)}
                style={styles.podiumImage}
              />
              <View style={styles.podiumTextContainer}>
                <Text style={styles.podiumName}>{food.name}</Text>
                <Text style={styles.podiumSeverity}>{`Avg Severity`}</Text>
                <Text style={styles.podiumSeverity2}>{`${food.severity}`}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.SectionTitle}>All Foods and Average Severity</Text>
      <ScrollView horizontal={true} nestedScrollEnabled={true}>
      {/*
      <View>
        <SearchFoodSeverity foodAverageSeverity={foodAverageSeverity}/>
      </View>
      */}
        <Chart foodAverageSeverity={foodAverageSeverity} />
      </ScrollView>

      <Text style={styles.SectionTitle}>Symptoms in {new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long' })}</Text>
      <PieChartComponent bloatingData={filteredData}/>
      
      {/* Information Popup */}
      {infoPopupVisible && (
        <View style={styles.infoPopupContainer}>
          <View style={styles.infoPopup}>
            <Text style={styles.infoText}>
              These food items have been selected by an algorithm, based on their occurrences, severity and dispersion across different meals.
            </Text>
            <TouchableOpacity onPress={handleInfoPopupClose}>
              <Text style={styles.closeInfoPopupButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={styles.SectionTitle}>Occurrences</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 10 }}>
          <TouchableOpacity 
              style={chartType === 'month' ? styles.buttonActive : styles.button} 
              onPress={() => setChartType('month')}
          >
              <Text style={styles.buttonText}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity 
              style={chartType === 'day' ? styles.buttonActive : styles.button} 
              onPress={() => setChartType('day')}
          >
              <Text style={styles.buttonText}>Day</Text>
          </TouchableOpacity>
          <TouchableOpacity 
              style={chartType === 'hour' ? styles.buttonActive : styles.button} 
              onPress={() => setChartType('hour')}
          >
              <Text style={styles.buttonText}>Hour</Text>
          </TouchableOpacity>
      </View>

      {chartType === 'month' && <MonthChart data={occurrencesPerMonth} />}
      {chartType === 'day' && <DayChart data={occurrencesPerDay} />}
      {chartType === 'hour' && <HourChart data={occurrencesPerHour} />}
            
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    padding: 16,
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.primary,
    padding: 10,
    alignItems: 'center',
    width: '100%',
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  metricValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.white,
  },
  metricTitle: {
    fontSize: 16,
    color: Colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonarrow: {
    padding: 10,
  },
  arrow: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  yearText: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'left',
  },
  dayOfWeek: {
    width: '14%',
    textAlign: 'center',
    fontWeight: 'bold',
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
    right: 10,
    bottom: 10,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
    paddingLeft: 20, // Add more padding to the left
    paddingRight: 20, 
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  SectionTitle: {
    fontSize: 18,
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  podiumItemsContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  podiumItemBox: {
    flex: 1,
    backgroundColor: Colors.grayLight,
    borderRadius: 10,
    padding: 8,
    paddingBottom: 16,
    paddingTop: 16,
    margin: 3,
    marginBottom:20,
  },
  podiumItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  podiumImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 5,
  },
  podiumTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  podiumName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  podiumSeverity: {
    color: 'red',
  },
  podiumSeverity2: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  podiumTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    button: {
        padding: 10,
        backgroundColor: '#DDDDDD',
        borderRadius: 5,
    },
    buttonActive: {
        padding: 10,
        backgroundColor: '#AAAAAA',
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        color: '#000',
    },
});

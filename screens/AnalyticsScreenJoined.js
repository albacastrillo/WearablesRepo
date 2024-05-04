// AnalyticsScreenJoined.js

import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import data from '../bloating_data.json';
import mealsData from '../food_data.json';

const AnalyticsScreen = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [topFoods, setTopFoods] = useState([]);
  const [bottomFoods, setBottomFoods] = useState([]);

  useEffect(() => {
    const monthData = data.filter(item => {
      const date = new Date(item.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    // Process data to calculate top and bottom foods
    const { topFoods, bottomFoods } = processData(mealsData, data);

    // Set state with processed data
    setTopFoods(topFoods);
    setBottomFoods(bottomFoods);
  }, [currentMonth, currentYear]);

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

  const processData = (mealsData, symptomsData) => {
    // Calculate average severity for each food
    const foodSymptoms = {};
    symptomsData.forEach(symptom => {
      const date = new Date(symptom.date);
      const hour = symptom.hour;
      const severity = symptom.severity;
      mealsData.forEach(meal => {
        const mealDate = new Date(meal.date);
        if (mealDate.getDate() === date.getDate() && mealDate.getMonth() === date.getMonth() && mealDate.getFullYear() === date.getFullYear() && meal.hour <= hour) {
          const foods = meal.food.split(', ');
          foods.forEach(food => {
            const trimmedFood = food.trim();
            if (!foodSymptoms[trimmedFood]) {
              foodSymptoms[trimmedFood] = [];
            }
            foodSymptoms[trimmedFood].push(severity);
          });
        }
      });
    });

    const foodAvgSeverity = {};
    for (const food in foodSymptoms) {
      const severities = foodSymptoms[food];
      const avgSeverity = severities.length > 0 ? severities.reduce((sum, severity) => sum + severity, 0) / severities.length : 0;
      foodAvgSeverity[food] = avgSeverity;
    }

    const sortedFoods = Object.entries(foodAvgSeverity)
      .sort((a, b) => b[1] - a[1]);

    const topFoods = sortedFoods.slice(0, 5);
    const bottomFoods = sortedFoods.slice(-5).reverse();

    return { topFoods, bottomFoods };
  };

  return (
    <View style={styles.container}>
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
          <View key={index} style={[styles.day, { backgroundColor: day ? getDayColor(day) : 'transparent' }]}>
            {day && <Text style={styles.dayText}>{day}</Text>}
          </View>
        ))}
      </View>

      <Text style={styles.title}>Top 5 Foods Causing Most Bloating</Text>
      <FlatList
        data={topFoods}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item[0]}: {item[1]}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Text style={styles.title}>Top 5 Foods Causing Least Bloating</Text>
      <FlatList
        data={bottomFoods}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item[0]}: {item[1]}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
  },
});

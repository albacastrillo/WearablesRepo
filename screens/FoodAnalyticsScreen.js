// FoodAnalyticsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import mealsData from '../food_data.json';
import symptomsData from '../bloating_data.json';

import Colors from '../constants/Colors';

const YourComponent = () => {
  const [topFoods, setTopFoods] = useState([]);
  const [bottomFoods, setBottomFoods] = useState([]);

  useEffect(() => {
    // Process data to calculate top and bottom foods
    const { topFoods, bottomFoods } = processData(mealsData, symptomsData);

    // Set state with processed data
    setTopFoods(topFoods);
    setBottomFoods(bottomFoods);
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  // Function to process data and calculate top and bottom foods
  const processData = (mealsData, symptomsData) => {
    // Calculate average severity for each food
    const foodAvgSeverity = calculateAvgSeverity(symptomsData, mealsData);

    // Sort foods based on average severity
    const sortedFoods = sortFoods(foodAvgSeverity);

    // Select top 5 and bottom 5 foods based on severity
    const { topFoods, bottomFoods } = selectTopAndBottomFoods(sortedFoods, 5);

    return { topFoods, bottomFoods };
  };

  // Function to calculate average severity for each food
  const calculateAvgSeverity = (symptomsData, mealsData) => {
    const foodSymptoms = {};
    symptomsData.forEach(symptom => {
      const date = symptom.date;
      const hour = symptom.hour;
      const severity = symptom.severity;
      mealsData.forEach(meal => {
        if (meal.date === date && meal.hour <= hour) {
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
      //const avgSeverity = severities.reduce((sum, severity) => sum + severity, 0) / severities.length;
      foodAvgSeverity[food] = avgSeverity;
    }

    return foodAvgSeverity;
  };

  // Function to sort foods based on average severity
  const sortFoods = (foodAvgSeverity) => {
    return Object.entries(foodAvgSeverity)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  };

  // Function to select top N and bottom N foods based on severity
  const selectTopAndBottomFoods = (sortedFoods, n) => {
    const topFoods = Object.entries(sortedFoods).slice(0, n);
    const bottomFoods = Object.entries(sortedFoods).slice(-n).reverse();
    return { topFoods, bottomFoods };
  };

  // Extract food names and average severities for top foods
  const topFoodNames = topFoods.map(([food, avgSeverity]) => food);
  const topAvgSeverities = topFoods.map(([food, avgSeverity]) => avgSeverity);

  // Extract food names and average severities for bottom foods
  const bottomFoodNames = bottomFoods.map(([food, avgSeverity]) => food);
  const bottomAvgSeverities = bottomFoods.map(([food, avgSeverity]) => avgSeverity);

  return (
    <View style={styles.container}>
      <View style={styles.column}>
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
      </View>
  
      <View style={styles.column}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  column: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.primary,
  },
  item: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
  },
});

export default YourComponent;

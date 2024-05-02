import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Import your bloating data and food data
import bloatingData from '../bloating_data.json';
import foodData from '../food_data.json';

const BarChartExample = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Create a map to store food items and their cumulative severity scores and occurrences
    const foodMap = new Map();

    // Iterate over the bloating data
    bloatingData.forEach(({ date, hour, severity }) => {
      // Find the corresponding food item
      const foodItem = foodData.find((item) => item.date === date && item.hour < hour);

      // Update the food map
      if (foodItem) {
        const { food } = foodItem;
        if (!foodMap.has(food)) {
          foodMap.set(food, { totalSeverity: 0, occurrences: 0 });
        }
        const prevData = foodMap.get(food);
        foodMap.set(food, {
          totalSeverity: prevData.totalSeverity + severity,
          occurrences: prevData.occurrences + 1,
        });
      }
    });

    // Calculate the average severity score for each food item
    const averageData = Array.from(foodMap.entries()).map(([food, { totalSeverity, occurrences }]) => ({
      food,
      averageSeverity: totalSeverity / occurrences,
    }));

    // Sort the food items based on their average severity scores
    averageData.sort((a, b) => b.averageSeverity - a.averageSeverity);

    // Set the chart data
    setChartData(averageData);
  }, []);

  return (
    <View style={styles.container}>
      {chartData.map((item, index) => (
        <View key={index} style={[styles.barContainer, { width: item.averageSeverity * 20 }]}>
          <Text style={styles.barLabel}>{item.food}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  barContainer: {
    backgroundColor: 'skyblue',
    marginBottom: 5,
    padding: 5,
    borderRadius: 5,
  },
  barLabel: {
    color: 'white',
    fontSize: 14,
  },
});

export default BarChartExample;

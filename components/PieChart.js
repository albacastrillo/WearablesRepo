import React from 'react';
import { View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Colors from '../constants/Colors';

const PieChartComponent = ({ bloatingData }) => {
  // Extract symptoms and their occurrences from the data
  const symptoms = {};
  bloatingData.forEach(entry => {
    const symptomsList = entry.symptoms.split(', ');
    symptomsList.forEach(symptom => {
      if (symptoms[symptom]) {
        symptoms[symptom]++;
      } else {
        symptoms[symptom] = 1;
      }
    });
  });

  // Sort symptoms based on occurrences
  const sortedSymptoms = Object.keys(symptoms).sort((a, b) => symptoms[b] - symptoms[a]);

  // Define a custom color scheme


  const colorScheme = [
    Colors.primaryLight, Colors.primary, Colors.secondary, Colors.secondaryLight, '#DA6F82',
    Colors.primaryDark, Colors.secondaryDark,'#96689D'
  ];

  // Prepare data for the pie chart with sorted symptoms and assigned colors
  const data = sortedSymptoms.map((symptom, index) => ({
    name: symptom,
    count: symptoms[symptom],
    color: colorScheme[index % colorScheme.length] // Use modulo to repeat colors if needed
  }));

  return (
    <View>
      <PieChart
        data={data}
        width={300}
        height={200}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
};

export default PieChartComponent;

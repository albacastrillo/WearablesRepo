import React from 'react';
import { BarChart } from 'react-native-chart-kit';
import { View, Text } from 'react-native';

const Chart = ({ foodAverageSeverity }) => {
  // Extract food names and average severities
  const foodNames = Object.keys(foodAverageSeverity);
  const averageSeverities = Object.values(foodAverageSeverity);

  // Data for the bar chart
  const data = {
    labels: foodNames,
    datasets: [
      {
        data: averageSeverities
      }
    ]
  };

  return (
    <View>
      <BarChart
        data={data}
        width={foodNames.length * 100} // Adjust the width according to the number of items
        height={350}
        yAxisSuffix=""
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16
          },
          // Adjust paddingBottom to increase space underneath bars for x-axis labels
        }}
        style={{
          marginVertical: 8,
          borderRadius: 16
        }}
        // Rotation for x-axis labels
        verticalLabelRotation={20}
      />
    </View>
  );
};

export default Chart;

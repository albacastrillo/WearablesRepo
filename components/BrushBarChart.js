import React from 'react';
import { BarChart } from 'react-native-chart-kit';
import { View, Text } from 'react-native';

import Colors from '../constants/Colors';

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
        width={foodNames.length * 67} // Adjust the width according to the number of items
        height={230}
        fromZero={true}
        chartConfig={{
          backgroundColor: Colors.white,
          backgroundGradientFrom: Colors.white,
          backgroundGradientTo: Colors.white,
          fillShadowGradientFromOpacity: 0.7,
          fillShadowGradientToOpacity: 0.3,
          decimalPlaces: 0,
          color: (opacity = 0.1) => `rgba(243, 155,	119, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={{
          marginVertical: 16,
          borderRadius: 16
        }}
        // Rotation for x-axis labels
        verticalLabelRotation={15}
      />
    </View>
  );
};

export default Chart;

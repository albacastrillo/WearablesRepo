// MonthChart.js
import React from 'react';
import { BarChart } from 'react-native-chart-kit';
import Colors from '../constants/Colors';
import { View, Dimensions } from 'react-native';

export default function MonthChart({ data }) {
    const labels = Object.keys(data).map(month => new Date(2024, month).toLocaleString('en-US', { month: 'long' }));
    const dataset = Object.values(data);

    const chartData = {
        labels: labels,
        datasets: [{ data: dataset }]
    };

    const screenWidth = Dimensions.get('window').width;

    return (
        <View>
            <BarChart
                data={chartData}
                width={screenWidth} // Adjust the width according to the number of items
                height={230}
                fromZero={true}
                chartConfig={{
                    backgroundColor: Colors.white,
                    backgroundGradientFrom: Colors.white,
                    backgroundGradientTo: Colors.white,
                    fillShadowGradientFromOpacity: 0.7,
                    fillShadowGradientToOpacity: 0.3,
                    barPercentage: 0.5,
                    decimalPlaces: 0,
                    color: (opacity = 0.1) => `rgba(135, 153, 97, ${opacity})`,
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
}
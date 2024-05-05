// HourChart.js
import React from 'react';
import { BarChart } from 'react-native-chart-kit';
import Colors from '../constants/Colors';
import { View, Text } from 'react-native';

export default function HourChart({ data }) {
    const labels = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const dataset = labels.map((_, index) => data[index] || 0);

    const chartData = {
        labels: labels,
        datasets: [{ data: dataset }]
    };

    return (
        <View>
            <Text style={{ fontSize: 12, textAlign: 'center', margin: 10 }}>Occurrences by Hours</Text>
            <BarChart
                data={chartData}
                width={labels.length * 20} // Adjust the width according to the number of items
                height={230}
                fromZero={true}
                chartConfig={{
                    backgroundColor: Colors.white,
                    backgroundGradientFrom: Colors.white,
                    backgroundGradientTo: Colors.white,
                    fillShadowGradientFromOpacity: 0.7,
                    fillShadowGradientToOpacity: 0.3,
                    decimalPlaces: 0,
                    barPercentage: 0.3,
                    barSpacing: 0.1,
                    color: (opacity = 0.1) => `rgba(243, 155,	119, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                style={{
                    marginVertical: 20,
                    borderRadius: 0
                }}
                // Rotation for x-axis labels
                verticalLabelRotation={45}
                
            />
        </View>
    );
}
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

const SearchFoodSeverity = ({ foodAverageSeverity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [showFoodList, setShowFoodList] = useState(false);

  // Handle search input change
  const handleSearchChange = (text) => {
    setSearchTerm(text);
    setSelectedFood(null); // Clear selected food when search term changes
    setShowFoodList(text.trim().length > 0); // Show food list only when search term is not empty
  };

  // Handle food item selection
  const handleFoodSelect = (foodName) => {
    setSelectedFood(foodName);
    setShowFoodList(false); // Hide food list after selecting a food item
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingLeft: 10 }}
        placeholder="Search food..."
        value={searchTerm}
        onChangeText={handleSearchChange}
      />
      {showFoodList && (
        <FlatList
          data={Object.keys(foodAverageSeverity).filter(foodName =>
            foodName.toLowerCase().includes(searchTerm.toLowerCase())
          )}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleFoodSelect(item)}>
              <Text style={{ fontSize: 18, marginBottom: 5 }}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      {selectedFood && (
        <View style={{ marginTop: 20 }}>
          <Text>Average Severity: {foodAverageSeverity[selectedFood]}</Text>
        </View>
      )}
    </View>
  );
};

export default SearchFoodSeverity;

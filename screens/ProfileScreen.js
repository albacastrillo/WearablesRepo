// screens/ProfileScreen.js

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/Colors';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image
          style={styles.profileImage}
          source={require('../assets/images/profile_pic.png')}
        />
      </View>

      <View style={styles.nameBox}>
        <Text style={styles.name}>Laura Smith</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionBox} onPress={() => {}}>
          <View style={styles.optionTextContainer}>
            <Icon name="heart" size={20}color={Colors.primary} />
            <View style={{ width: 10 }} />
            <Text style={styles.Text}>Allergens</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBox} onPress={() => {}}>
          <View style={styles.optionTextContainer}>
            <Icon name="heart" size={20} color={Colors.primary} />
            <View style={{ width: 10 }} />
            <Text style={styles.Text}>Settings</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBox} onPress={() => {}}>
          <View style={styles.optionTextContainer}>
            <Icon name="heart" size={20} color={Colors.primary} />
            <View style={{ width: 10 }} />
            <Text style={styles.Text}>Edit Profile</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionBox} onPress={() => {}}>
          <View style={styles.optionTextContainer}>
            <Icon name="heart" size={20} color={Colors.primary} />
            <View style={{ width: 10 }} />
            <Text style={styles.Text}>Log out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  name: {
    fontSize: 20, 
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primary,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  optionBox: {
    width: '100%',
    height: 60,
    margin: 6,
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
  },
  optionTextContainer: {
    padding: 20, // adjust as needed
    flexDirection: 'row',
  },
  Text: {
    fontSize: 14,
  },
});

export default ProfileScreen;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CustomButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.buttonContainer, style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const InputPage = ({ navigation }) => {
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [patterns, setPatterns] = useState('');
  const [medications, setMedications] = useState('');

  const handleSubmit = () => {
    navigation.navigate('ChatPage', { 
      symptoms, 
      duration, 
      patterns, 
      medications 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Symptoms:</Text>
      <TextInput 
        style={styles.inputBox}
        multiline
        value={symptoms}
        onChangeText={setSymptoms}
        placeholder="Describe in detail the primary symptom that is concerning you."
      />

      <Text style={styles.label}>Duration:</Text>
      <TextInput 
        style={styles.inputBox}
        multiline
        value={duration}
        onChangeText={setDuration}
        placeholder="How long have you been experiencing this symptom?"
      />

      <Text style={styles.label}>Patterns:</Text>
      <TextInput 
        style={styles.inputBox}
        multiline
        value={patterns}
        onChangeText={setPatterns}
        placeholder="Have you noticed any patterns or triggers related to your symptoms?"
      />

      <Text style={styles.label}>Medications:</Text>
      <TextInput 
        style={styles.inputBox}
        multiline
        value={medications}
        onChangeText={setMedications}
        placeholder="Have you tried any treatments or taken any new medications recently, and if so, did they affect your symptom?"
      />

      <View style={styles.centeredContainer}>
        <CustomButton
          title="SUBMIT"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: screenHeight * 0.01,
    alignItems: 'center', // This centers the children horizontally
    justifyContent: 'center', // This centers the children vertically
  },
  centeredContainer: {
    width: '100%',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
  },
  inputBox: {
    width: '100%', // Ensure it takes the full width
    height: screenHeight * 0.10,
    backgroundColor: 'white',
    borderRadius: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.04,
    paddingVertical: screenHeight * 0.01,
    fontSize: screenWidth * 0.04,
    marginBottom: screenHeight * 0.01,
    shadowColor: 'black',
    shadowOffset: { 
      width: screenWidth * 0.002, 
      height: screenHeight * 0.002 
    },
    shadowOpacity: 0.2,
    shadowRadius: screenHeight * 0.002,
    elevation: screenHeight * 0.002,
  },
  buttonContainer: {
    backgroundColor: '#0984e3',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center', 
    justifyContent: 'center', 
    width: screenWidth * 0.5,
    borderRadius: screenHeight * 0.1
  },
  submitButton: {
    marginTop: 20,
    marginBottom:screenWidth * 0.05,  // Add some margin to separate from the above element
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'Helvetica',
    fontWeight: 'bold'
  },
});

export default InputPage;
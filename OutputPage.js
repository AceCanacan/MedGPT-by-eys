import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,  // <-- Add this
} from 'react-native';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Share from 'expo-sharing';


const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = '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';

export const saveSummaryToStorage = async (summaryObj) => {
  try {
    const existingSummaries = await AsyncStorage.getItem('summaries');

    if (existingSummaries !== null) {
      const updatedSummaries = JSON.parse(existingSummaries);
      updatedSummaries.push(summaryObj);
      await AsyncStorage.setItem('summaries', JSON.stringify(updatedSummaries));
    } else {
      await AsyncStorage.setItem('summaries', JSON.stringify([summaryObj]));
    }
  } catch (error) {
    console.error('Failed to save the summary:', error);
  }
};

const OutputPage = ({ route }) => {
  const { messages } = route.params;
  const [summary, setSummary] = React.useState({date: '', content: ''});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getSummary = async () => {
      try {
        setLoading(true); 

        // Filter out system messages
        const userMessages = messages.filter(message => message.role !== 'system');

        const response = await axios.post(API_URL, {
          model: 'gpt-3.5-turbo',
          messages: [...userMessages, {
            role: 'user',
            content: `You are an empathetic, AI-powered assistant, designed to provide support in a medical context. Your user is a patient who has already provided detailed information about their health concerns. Your task is to analyze this information from a medical perspective and provide a summary of the possible condition they might be experiencing, potential causes, and general advice on symptom management.

            For example, if the patient has described symptoms of diarrhea, you might suggest that they could be experiencing food poisoning, which can be caused by consuming contaminated food or water. You could then provide general advice such as staying hydrated and resting.

            Remember, your role is purely informational, and under no circumstances should you attempt to provide medical advice or diagnosis. Always take into account the context provided by the patient and ensure your responses are both medically accurate and understandable to a layperson.

            After providing the summary, remind the patient that this is an AI-generated response and it's crucial for them to consult with a healthcare professional who can provide advice based on a comprehensive understanding of their symptoms and medical history

            Do not show any signs of uncertainty such as "i cannot pinpoint the exact cause". The patient knows you are a bot, and knows that you have limitations. No need to tell them.

            Separate per part
            - Summary of Symptoms
            (explain what measures can they take to alleviaet their problem)
            - Possible Diagnosis
            (talk about the probable disease or condition they have)
            - Potentaial Causes
            (explain the potential cause of their condition)`,
          }],
        }, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        const fetchedSummary = {
          date: new Date().toISOString(),
          content: response.data.choices[0].message.content.trim()
        };
        setSummary(fetchedSummary);
        saveSummaryToStorage(fetchedSummary);
        route.params.summary = response.data.choices[0].message.content.trim();
        
        setLoading(false);
      } catch (error) {
        console.error("Error response from OpenAI:", error.response.data);
        setLoading(false);  // Stop the loading spinner if there's an error
      }
    };
    
    getSummary();
  }, [messages]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#1abc9c" />
      ) : (
        <ScrollView style={styles.outputBox}>
          <Text style={styles.summaryText}>{summary.content}</Text>
        </ScrollView>
      )}
    </View>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Changing to a pure white for a cleaner look
    padding: screenWidth * 0.05, // Dynamic padding based on screen width
    justifyContent: 'center',
    alignItems: 'center',
  },

  summaryText: {
    fontSize: screenWidth * 0.04, // Make font size dynamic
    color: '#333', // A dark gray for better legibility and aesthetics
  },
  image: {
    margin: screenWidth * 0.05,
    width: screenWidth * 0.7,
    height: screenWidth * 0.7,
    borderRadius: (screenWidth * 0.7) / 2, // Makes the image circular if the image is a square
  },
});


export default OutputPage;
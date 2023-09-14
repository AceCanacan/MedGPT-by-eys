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
            content: "Given the following information, please produce a journal entry by the author. It's vital that you don't omit any details. Please present your findings in a third person point of view. Despite the need for objectivity, ensure your write-up embodies compassion, as if it was composed for a personal journal entry. And be concise dont make it too long. Make sure it sounds similar to the input of the writer",
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
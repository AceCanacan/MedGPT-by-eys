import React, { useState, useRef,useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = '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';

const ChatPage = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = React.useState('');
  const scrollViewRef = useRef(null);

  const { symptoms, duration, patterns, medications } = route.params;


  const setParentMessages = route.params.setMessages;
  const [messages, setMessages] = useState(route.params.messages || []);

  
  const sendBotMessage = (content) => {
    const botMessage = { role: 'assistant', content: content };
    setMessages(prevMessages => [...prevMessages, botMessage]);
  };

  const sendMessage = async () => {
  setLoading(true);
  const userMessage = { role: 'user', content: userInput };
  const systemMessage = {
    role: 'assistant',
    content: `Symptoms: ${symptoms}. Duration of symptoms: ${duration} Patterns of symptoms: ${patterns} Symptoms: ${medications}}
    This is the context about the patient
    You are a highly empathetic, AI-powered assistant, providing support in a medical context.
    Your user is a patient who has answered the following questions about their health concerns:
    Your task is not to diagnose or analyze the patient's condition. Instead, you are to use the information provided to ask follow-up questions,
    aimed at gathering more details and understanding the patient's situation better. Probe into different areas of their lifestyle, such as diet,
    exercise, stress levels, and sleep patterns, which might be relevant to their symptoms. It's important to remain respectful, empathetic,
    and understanding in your tone throughout the conversation, making the patient feel heard and acknowledged.
    After a thorough conversation, when you think you have gathered enough information, you should inform the patient that
    you've completed your questions and the data will be reviewed by medical professionals for further analysis.
    Remember, your role is purely informational, and under no circumstances should you attempt to provide medical advice or diagnosis.
    Take into account the context provided by the patient
    ASK ONE QUESTION AT A TIME. DO NOT OVERWHELM THE PATIENT.
    `,
  };


  try {
    const response = await axios.post(API_URL, {
      model: 'gpt-3.5-turbo',
      messages: [...messages, systemMessage, userMessage],
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const botMessage = { role: 'system', content: response.data.choices[0].message.content.trim() };

    // Update messages only once after receiving the bot's response
    setMessages(prevMessages => {
      if (botMessage.role === "system") {
        return [...prevMessages, userMessage, botMessage];
      } else {
        return [...prevMessages, systemMessage, userMessage, botMessage];
      }
    });
    setParentMessages(prevMessages => [...prevMessages, systemMessage, userMessage, botMessage]); 
  } catch (error) {
    console.error("Error response from OpenAI:", error.response.data);
  }

  setUserInput('');
  setLoading(false);
};

useEffect(() => {
  sendBotMessage("Hello! How are you feeling today?");
}, []);

  const isSendDisabled = loading || !userInput.trim();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 100}
      >
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
          style={styles.chatBox}
          keyboardShouldPersistTaps="always"
        >
          {messages.map((message, index) => (
            <View
              key={index}
              style={message.role === 'user' ? styles.userMessageContainer : styles.botMessageContainer}
            >
              <Text style={message.role === 'user' ? styles.userMessageText : styles.botMessageText}>
                {message.content}
              </Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Type a message..."
            editable={!loading}
        />
        <TouchableOpacity disabled={isSendDisabled} onPress={sendMessage}>
            {loading ? (
                <ActivityIndicator size="small" color="#0984e3" />
            ) : (
                <Image 
                    source={require('./send_icon.png')} 
                    style={{ 
                      ...styles.sendButton, 
                      tintColor: isSendDisabled ? 'gray' : '#0984e3',
                      opacity: isSendDisabled ? 0.5 : 1 
                  }} 
                />
            )}
        </TouchableOpacity>
    </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatBox: {
    flex: 1,
    padding: screenWidth * 0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: screenWidth * 0.02,
    paddingBottom: screenHeight * 0.07,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: screenWidth * 0.2,
    padding: screenWidth * 0.02,
    marginRight: screenWidth * 0.02,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    marginBottom: screenHeight * 0.015,
    backgroundColor: '#e5e5e5',
    borderRadius: screenWidth * 0.04,
    overflow: 'hidden',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
    marginBottom: screenHeight * 0.015,
    backgroundColor: '#74b9ff',
    borderRadius: screenWidth * 0.04,
    overflow: 'hidden',
  },
  userMessageText: {
    textAlign: 'right',
    padding: screenWidth * 0.01,
    paddingVertical: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.025,
  },
  botMessageText: {
    textAlign: 'left',
    padding: screenWidth * 0.01,
    paddingVertical: screenHeight * 0.01,
    paddingHorizontal: screenWidth * 0.025,
  },
  header: {
    position: 'absolute',
    top: screenHeight * 0.015,
    right: screenWidth * 0.025,
    zIndex: 1,
  },
  sendButton: {
    width: screenWidth * 0.07,
    height: screenWidth * 0.07,
    resizeMode: 'contain',
  },
});

export default ChatPage;
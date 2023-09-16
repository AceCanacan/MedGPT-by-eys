import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, Image,} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

import InputPage from './screens/InputPage';
import chatpage from './chatpage';
import OutputPage, { saveSummaryToStorage } from './OutputPage';
import CatalogPage from './CatalogPage'; 
import SummaryDetailPage from './SummaryDetailPage';


const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const CatalogButton = ({ title, onPress, containerStyle, textStyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.sub_buttonContainer]}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const HomeScreen = ({ navigation }) => {
  return (
    <LinearGradient 
      colors={['#0984e3', '#74b9ff']}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.logoText}>MedChat</Text>
        <Text style={styles.logosubText}>Always On, Health Chatbot </Text>
        <Image
          source={require('./assets/logo.png')}
          style={styles.image}
        />
        <CustomButton
          title="START"
          onPress={() => navigation.navigate('InputPage')}
        />
          <CatalogButton
          title="RECORDS"
          onPress={() => navigation.navigate('CatalogPage')}
        />
      </View>
    </LinearGradient>
  );
};


const Stack = createStackNavigator();

const App = () => {
  const [messages, setMessages] = React.useState([]); 

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerBackground: () => (
            <LinearGradient
              colors={['#0984e3', '#0984e3']}
              style={{ flex: 1 }}
            />
          ),
          headerTintColor: 'white',
        }}
      >
          <Stack.Screen
    name="CatalogPage"
    component={CatalogPage}
    options={{
      title: 'Records',
      // You can set any specific options for this screen here
    }}
  />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
          })}
        />
        <Stack.Screen
          name="InputPage"
          component={InputPage}
          options={({ navigation }) => ({
            title: 'Preliminary Questions',
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Navigate back?',
                    'Are you sure you want to go back to the Home page? This will delete your input.',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Yes',
                        onPress: () => {
                          navigation.goBack();
                        },
                      }
                    ],
                    { cancelable: true }
                  );
                }}
              >
                <Text style={{ color: 'white', paddingHorizontal: 10, fontSize: 16, fontFamily: "Helvetica"}}>Back</Text>
              </TouchableOpacity>
            )
          })}
        />
        <Stack.Screen
          name="ChatPage"
          component={chatpage}
          initialParams={{ setMessages }} 
          options={({ navigation }) => ({
            title: 'Chat',
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'End Conversation',
                    'Do you want to end the conversation and view the summary?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Yes',
                        onPress: () => {
                          navigation.navigate('OutputPage', { messages: messages });
                        },
                      }
                    ],
                    { cancelable: true }
                  );
                }}
              >
                <Text style={{ color: 'white', paddingHorizontal: 10, fontSize: 16, fontFamily: "Helvetica"}}>Submit</Text>
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  Alert.alert(
                    'Navigate back?',
                    'Are you sure you want to go back to the Input Page? This will delete your chat.',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Yes',
                        onPress: () => {
                          navigation.goBack();
                        },
                      }
                    ],
                    { cancelable: true }
                  );
                }}
              >
                <Text style={{ color: 'white', paddingHorizontal: 10, fontSize: 16, fontFamily: "Helvetica"}}>Back</Text>
              </TouchableOpacity>
            )
          })}
        />
<Stack.Screen
  name="OutputPage"
  component={OutputPage}
  options={({ route, navigation }) => ({
    title: 'Summary',
    headerLeft: null,
    headerRight: () => (
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Navigate back?',
              'Are you sure you want to go back to the Home page?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () => {
                    navigation.navigate('Home');
                  },
                }
              ],
              { cancelable: true }
            );
          }}
        >
          <Text style={{ color: 'white', paddingHorizontal: 10, fontSize: 16, fontFamily: "Helvetica"}}>Save</Text>
        </TouchableOpacity>

      </View>
    )
  })}
/>


  <Stack.Screen
    name="SummaryDetail"
    component={SummaryDetailPage}
    options={{
      title: 'Summary Detail',
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          <TouchableOpacity 
            style={{ marginRight: 10 }}
            onPress={() => {
              // TODO: Call your delete function here
            }}>
            <Text>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              // TODO: Call your edit function here
            }}>
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
      ),
      // ... any other screen-specific options
    }}
  />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  logoText: {
    fontSize: screenWidth * 0.15,
    color: 'white',
    fontFamily: 'Helvetica', // Use the correct font family name for the bold variant
    fontWeight: 'bold', // Add fontWeight as a fallback for compatibility
  },
  logosubText: {
    fontSize: screenWidth * 0.05,
    color: 'white',
    fontFamily: 'Helvetica', // Use the correct font family name for the bold variant
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: 'white', // White background color
    borderRadius: screenHeight * 0.1, // 10% of the screen height for rounded corners
    paddingHorizontal: screenWidth * 0.2, // 20% of the screen width for horizontal padding
    paddingVertical: screenHeight * 0.005,
    marginBottom: screenHeight * 0.02 // 2% of the screen height for vertical padding
  },
  buttonText: {
    fontSize: screenWidth * 0.06, // 6% of the screen width for font size
    color: '#0984e3', // Black text color
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingVertical: screenHeight * 0.01, // 1% of the screen height for vertical padding
  },
  sub_buttonContainer: {
    backgroundColor: 'white', // White background color
    borderRadius: screenHeight * 0.1, // 10% of the screen height for rounded corners
    paddingHorizontal: screenWidth * 0.15, // 20% of the screen width for horizontal padding
    paddingVertical: screenHeight * 0.005,
    marginBottom: screenHeight * 0.06 // 2% of the screen height for vertical padding
  },
  sub_buttonText: {
    fontSize: screenWidth * 0.06, // 6% of the screen width for font size
    color: '#1abc9c', // Black text color
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    paddingVertical: screenHeight * 0.01, // 1% of the screen height for vertical padding
  },
  image: {
    margin: screenWidth * 0.05,
    width: screenWidth * 0.7, // Set the width to 10% of the screen width
    height: screenWidth * 0.7, // Set the height to 10% of the screen width

  },
  submitButton: {
    marginRight: 10,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  submitButtonText: {
    color: '#0984e3',
    fontWeight: 'bold',
  },
});

export default App;
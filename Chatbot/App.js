import React from 'react';
import Chatbot from './Chatbot';
import { SafeAreaView } from 'react-native';


const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Chatbot />
    </SafeAreaView>
  );
} 

export default App;
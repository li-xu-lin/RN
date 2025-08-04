import React from 'react';
import { PaperProvider } from 'react-native-paper';
import Router from './src/router';
export default function App() {
  return (
    <PaperProvider>
      <Router />
    </PaperProvider>
  );
} 
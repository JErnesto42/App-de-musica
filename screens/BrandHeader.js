import React from 'react';
import { Image, Text, View } from 'react-native';
import { styles } from './theme';

const logo = require('../assets/logo-sonora.png');

export default function BrandHeader() {
  return (
    <View style={styles.brandHeader}>
      <Image source={logo} style={styles.brandLogo} accessibilityLabel="Logo Sonora" />
      <Text style={styles.brandName}>Sonora</Text>
    </View>
  );
}

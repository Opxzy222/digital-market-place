import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';

export default function Homepage() {
  const navigation = useNavigation();

  // Mock carousel items (replace these with your actual images)
  const carouselItems = [
    { image: require('../../assets/images/property-icon.png') },
  ];

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={item.image} style={styles.carouselImage} />
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Welcome Message */}
      <View style={styles.welcomeMessage}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/icon1.png')} style={styles.logo} />
          <Text style={styles.heading}>Gogo Digital Marketplace</Text>
        </View>
        <Text style={styles.description}>
          Discover, connect, and grow. Set up your digital shop or explore our peer-to-peer market now.
        </Text>
      </View>

      {/* Billboard Carousel */}
      <View style={styles.carouselContainer}>
        <Carousel
          data={carouselItems}
          renderItem={renderCarouselItem}
          sliderWidth={300}
          itemWidth={300}
          autoplay={true}
          loop={true}
        />
      </View>

      {/* Market and Shop Links */}
      <View style={styles.linksContainer}>
        <TouchableOpacity
          style={styles.marketButton}
          onPress={() => navigation.navigate('MarketHomePage')}
        >
          <Text style={styles.buttonText}>Go to Market</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('ShopHomePage')}
        >
          <Text style={styles.buttonText}>Go to Shop</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  welcomeMessage: {
    backgroundColor: '#3498db',
    padding: 40,
    borderRadius: 15,
    marginBottom: 30,
    marginTop: 50, // Move down the welcome message
    alignItems: 'center',
    textAlign: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10, // For Android shadow
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Roboto',
    textAlign: 'center',
    marginTop: 20,
  },
  carouselContainer: {
    marginTop: 20,
  },
  carouselItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10, // For Android shadow
  },
  carouselImage: {
    width: 280,
    height: 150,
    borderRadius: 10,
  },
  linksContainer: {
    marginTop: 50, // Increase margin to give more space
    width: '100%',
    alignItems: 'center',
  },
  marketButton: {
    backgroundColor: '#0B60B0',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5, // For Android shadow
  },
  shopButton: {
    backgroundColor: '#87CEFA',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5, // For Android shadow
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

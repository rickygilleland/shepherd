import React from 'react';

import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import { Avatar, Text, Card, ListItem, Button, Icon, Divider, Header, ButtonGroup, Tooltip, Overlay } from 'react-native-elements';

class LocationRequiredScreen extends React.Component {
	
  static navigationOptions = {
    title: 'Location Required',
  };
  
  constructor() {
    super();
    
    this.state = {
      location: null,
      locationAllowed: false,
      refreshing: false,
    }
    
  }
  
   _requestPermission() {
	    
	    this.findCoordinates();
    }
 
  render() {
	  return (
		  <View style={{ paddingTop: 50 }}>
		  	<Text h4 style={{ fontFamily: 'Airbnb Cereal App', textAlign: 'center'}}>Please enable location sharing to continue.</Text>
		  	<Text style={{ fontFamily: 'Airbnb Cereal App', padding: 20, textAlign: 'center'}}>To enable, tap the button below.</Text>
		  	<Button title="Allow Location" buttonStyle={{ margin: 20, backgroundColor: '#94009E'}} onPress={() => {this._requestPermission()}}/>
		  	<Text style={{ fontFamily: 'Airbnb Cereal App', padding: 20}}>We need your location to show you posts around you. We&apos;ll only check your location while the app is open.</Text>
		  </View>
	  );
	  
  }
  
  findCoordinates = () => {

    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);
        
        this.setState({ location });
        this.setState({ locationAllowed: true });
        
        this.storeLastLocation();
        
        //send them to home
		this.props.navigation.navigate('App');
        
      },
      error => this.handleLocationError(),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };
  
  storeLastLocation = async () => {
	    await AsyncStorage.setItem('last_location', this.state.location);
  };

  
  handleLocationError = () => {
	  this.setState({ locationAllowed: false });
	  this.props.navigation.navigate('App');
  }

}



export default LocationRequiredScreen;

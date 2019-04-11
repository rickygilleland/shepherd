import React from 'react';

import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';

import { Avatar, Text, Card, ListItem, Button, Icon, Divider, Header, ButtonGroup, Tooltip, Overlay } from 'react-native-elements';

class LocationDeniedScreen extends React.Component {
	
  static navigationOptions = {
    title: 'Location Required',
  };
  
  constructor() {
    super();
    
    this.state = {
      location: null,
      locationAllowed: null,
      refreshing: false,
    }

  }

	_requestPermission() {
	    geolocation.requestAuthorization();
    }  
 
  render() {
	  return (
		  <View>
		  	<Text h5 style={{ fontFamily: 'Airbnb Cereal App'}}>Yo man enable</Text>
		  	<Button title="Allow Location" type="solid"
						  buttonStyle={{ backgroundColor: '#FF851B' }}
						  containerStyle={{ marginBottom: 10 }}
						  titleStyle={{ fontFamily: 'Airbnb Cereal App' }} onPress={() => {this._requestPermission()}}/>
		  </View>
	  );
	  
  }
  


}



export default LocationDeniedScreen;

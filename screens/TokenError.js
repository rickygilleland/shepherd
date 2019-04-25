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

class TokenErrorScreen extends React.Component {
	
  static navigationOptions = {
    title: 'Loading Error',
  };
  
  constructor() {
    super();
  }

  render() {
	  return (
		  <ScrollView style={{ paddingTop: 50 }}>
		  	<Text h4 style={{ fontFamily: 'Airbnb Cereal App', textAlign: 'center'}}>Oops! There was an issue.</Text>
		  	<Text style={{ fontFamily: 'Airbnb Cereal App', padding: 20, textAlign: 'center'}}>We had trouble authorizing your request with our server. This generally happens if you are running the app on more than one device at the same time.</Text>
		  	
		  	<Text style={{ fontFamily: 'Airbnb Cereal App', padding: 20, textAlign: 'center'}}> Shepherd can only be used on a single device at a time. Click the button below to log out and re-authorize the app.</Text>
		  	
		  	<View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 80}}>

		       		          
		    </View>
		  </ScrollView>
	  );
	  
  }
  
  _signOutAsync = async () => {
    var watchId = await AsyncStorage.getItem('watchId');
    
    if (watchId != null) {
	    navigator.geolocation.clearWatch(parseInt(watchId));
    }
    
	navigator.geolocation.stopObserving();
	
	await AsyncStorage.clear();
	this.props.navigation.navigate('Auth');
  };
  
 
}



export default TokenErrorScreen;

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

class ErrorLoadingScreen extends React.Component {
	
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
		  	<Text style={{ fontFamily: 'Airbnb Cereal App', padding: 20, textAlign: 'center'}}>We had trouble loading your request. Verify your network connection is working properly and then try restarting the app.</Text>
		  	
		  	<Text style={{ fontFamily: 'Airbnb Cereal App', padding: 20, textAlign: 'center'}}>If your network connection is working fine, you can try logging out with the button below and trying again.</Text>
		  	
		  	<Button
		        	onPress={() => this._signOutAsync()}
					titleStyle={{ fontFamily: 'Airbnb Cereal App', color: '#FFFFFF' }}
		        	title="Log Out"
		        />
		  	
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



export default ErrorLoadingScreen;
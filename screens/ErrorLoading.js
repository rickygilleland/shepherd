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

import { LoginButton, AccessToken } from 'react-native-fbsdk';

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
		  	
		  	<View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 80}}>

		        <LoginButton
		          readPermissions={["email"]}
		          onLoginFinished={
		            (error, result) => {
		              if (error) {
		                console.log("login has error: " + result.error);
		              } else if (result.isCancelled) {
		                console.log("login is cancelled.");
		              } else {
		                AccessToken.getCurrentAccessToken().then(
		                  (data) => {
			                  
			            	return fetch('https://api.getshepherd.app/api/token', {
							      method: 'POST',
							      headers: {
							        'Content-Type': 'application/json',
							      },
							      body: JSON.stringify({
							          'token': data.accessToken.toString()
							      })
							})
							    
							.then((response) => response.json())
							    .then((responseJson) => {
								    
								    _signInAsync = async () => {
									    await AsyncStorage.setItem('backend_token', responseJson.token);
									    this.props.navigation.navigate('App');
									};
									
									_signInAsync();
						  
							    })
							    .catch((error) => {
							      	alert('There was an error loading your request! Check your network connection.')
							    });
							});
		
		                  }
		            }
		          }
		          onLogoutFinished={() => this._signOutAsync() }/>
		          
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
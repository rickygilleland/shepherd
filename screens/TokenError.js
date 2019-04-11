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

import { LoginButton, AccessToken } from 'react-native-fbsdk';

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
							      	console.error(error);
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
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
  
 
}



export default TokenErrorScreen;

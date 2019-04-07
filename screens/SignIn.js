import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import { LoginButton, AccessToken } from 'react-native-fbsdk';

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View>
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
	                  
	            	return fetch('https://shepherd-app-backend-api.herokuapp.com/api/token', {
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
          onLogoutFinished={() => this._signOutAsync }/>
      </View>
    );
  }
  
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
 
}

export default SignInScreen;
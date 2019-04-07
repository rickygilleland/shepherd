import React from 'react';

import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { Avatar, Text } from 'react-native-elements';

import { LoginButton, AccessToken } from 'react-native-fbsdk';

class ProfileScreen extends React.Component {
	
  static navigationOptions = {
    title: 'Profile',
  };
  
  constructor() {
    super();
    
    this.state = {
      userLoaded: false,
      user: null,
    }
    
    this._getProfileInfo();
  }


  render() {
	  if ( this.state.userLoaded ) {
	  
	    return (
	     <View style={styles.view}>
	     
	     	<Text h2>{this.state.user.name}</Text>
	     
	     	<Avatar
			  rounded
			  size="xlarge"
			  source={{
			    uri:
			      this.state.user.avatar
			  }}
			/>
			
		
			
	     
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
	          onLogoutFinished={() => this._signOutAsync() }/>
	      </View>
	    );
	    
	  } else {
		  return null;
	  }
  }
  
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
  
  _getProfileInfo = async () => {
	  
	  const backend_token = await AsyncStorage.getItem('backend_token');
	  
	  return fetch('https://shepherd-app-backend-api.herokuapp.com/api/user', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		        'Authorization': 'Bearer ' + backend_token,
		      },
		      body: JSON.stringify({
		          'api_token': backend_token
		      })
		})
		    
		.then((response) => response.json())
		    .then((responseJson) => {
			    
			    
			    this.setState({
			        userLoaded: true,
			        user: responseJson
			    });
			    
	  
		    })
		    .catch((error) => {
		      	console.error(error);
		    });
	};
}


const styles = StyleSheet.create({
	view: {
		paddingTop: 40
	},
});
export default ProfileScreen;

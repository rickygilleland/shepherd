import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  WebView, 
  Linking
} from 'react-native';
import { createStackNavigator, createSwitchNavigator, createAppContainer } from 'react-navigation';

import { Text, Header, Button } from 'react-native-elements';

import { LoginButton, AccessToken } from 'react-native-fbsdk';

import AsyncStorage from '@react-native-community/async-storage';

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };
  
  constructor() {
    super();
    
    this.state = {
      showSpinner: false,
    }
    
  }


  render() {
    return (
	    
	  <ScrollView style={styles.view}>

	      <View>
	      
	      
	      
	      
	      	<Text h3 style={styles.contentText}>Sign In</Text>
	      
		  	<Text style={styles.contentText}>Click the login button below to continue to your local posts.</Text>
	      
		  	<View style={styles.loginButton}>
		        <LoginButton
		          readPermissions={["email"]}
		          onLoginFinished={
		            (error, result) => {
		              if (error) {
		                alert("login has error: " + result.error);
		              } else if (result.isCancelled) {
		                alert("Oh no! Please login to continue!");
		              } else {
		                AccessToken.getCurrentAccessToken().then(
			                
		                  (data) => {
			                  
			                this.props.navigation.navigate('SignInLoading');
			                  
			                this.setState({ showSpinner: true });
			                  
			            	return fetch('https://api.getshepherd.app/api/token', {
							      method: 'POST',
							      headers: {
							        'Content-Type': 'application/json',
							        'Accept': 'application/json',
							      },
							      body: JSON.stringify({
							          'token': data.accessToken.toString()
							      })
							})
							    
							.then((response) => response.json())
							    .then((responseJson) => {
								    
								    if (typeof responseJson.message !== 'undefined') {
										if (responseJson.message == 'Unauthenticated.') {
											return this.props.navigation.navigate('TokenError');
										}
									}
													    
								    _signInAsync = async () => {
									    await AsyncStorage.setItem('backend_token', responseJson.token);
									    return this.props.navigation.navigate('App');
									};
									
									_signInAsync();
						  
							    })
							    .catch((error) => {
							      	return this.props.navigation.navigate('ErrorLoading');
							    });
							});
		
		                  }
		            }
		          }
		          onLogoutFinished={() => this._signOutAsync }/>

	          
				</View>
				
				<Text style={{ fontFamily: 'Airbnb Cereal App', paddingLeft: 20, paddingRight: 20, paddingTop: 50, fontWeight: 'bold', textAlign: 'center', color: '#FFFFFF' }}>By click the Continue with Facebook button above, you agree to the Shepherd App Terms of Service and Privacy Policy.</Text>
		          <Button
		          	  type="outline"
			          title="View our Privacy Policy"
			          containerStyle={{ paddingLeft: 20, paddingRight: 20, paddingTop: 30}}
			          onPress={() => Linking.openURL("https://getshepherd.app/privacy")}
			          titleStyle={{ color: '#FFFFFF' }}
			          buttonStyle={{ borderColor: '#FFFFFF' }}
			        />
			        
			         <Button
			          type="outline"
			          title="View our Terms of Service"
			          containerStyle={{ paddingLeft: 20, paddingRight: 20, paddingTop: 10}}
			          onPress={() => Linking.openURL("https://getshepherd.app/terms")}
			          titleStyle={{ color: '#FFFFFF' }}
			          buttonStyle={{borderColor: '#FFFFFF'}}
			        />
	
	      </View>
	      
	      
		</ScrollView>
    );
    
  }
  
  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
 
}

const styles = StyleSheet.create({
	view: {
		paddingTop: 60,
		backgroundColor: '#94009E',
	},
	contentText: {
		fontFamily: 'Airbnb Cereal App',
		fontWeight: 'bold',
		marginTop: 10,
		marginBottom: 10,
		textAlign: 'center',
		color: '#FFFFFF'
	},
	loginButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 10,
	}
});


export default SignInScreen;
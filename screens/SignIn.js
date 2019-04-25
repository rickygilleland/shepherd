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

import AsyncStorage from '@react-native-community/async-storage';

import Auth0 from 'react-native-auth0';
const auth0 = new Auth0({ domain: 'shepherdapp.auth0.com', clientId: 'bzwQk9ghwRRDPkfGIxrktBcdeD_nLk2p' });

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
	      
		  	<View>
		  	

			                  
		  	
		  		<Button 
		  			type="solid"
			        containerStyle={{ paddingLeft: 20, paddingRight: 20, paddingTop: 30 }}
			        titleStyle={{ color: '#FFFFFF' }}
			        buttonStyle={{ borderColor: '#FFFFFF' }}
		  			onPress={ () => {
			  			auth0
						    .webAuth
						    .authorize({scope: 'openid profile email', audience: 'https://api.getshepherd.app'})
						    .then(credentials =>
						      this._authorizeUser(credentials.accessToken)
						      // Successfully authenticated
						      // Store the accessToken
						    )
						    .catch(error => console.log(error));
		  			}}
		  			
		  			title="Sign In"
		  	
		  		/>
		  	
		        	          
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
  
  
   _authorizeUser = async (accessToken) => {

	   	await AsyncStorage.setItem('backend_token', accessToken);
		return this.props.navigation.navigate('App');
		
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
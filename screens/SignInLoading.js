import React from 'react';

import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';

import { Avatar, Text, Input, Button, Header, Icon } from 'react-native-elements';

import {StackNavigator} from 'react-navigation';

class SignInLoadingScreen extends React.Component {

  
  render() {
	  
	    return (

		     <View style={styles.view}>
		     
		     	<Text h3 style={styles.text}>Logging you in...</Text>
		     
		     	<ActivityIndicator size="large" color="#94009E" />
	
		      </View>

	    );

  }
  
 
}


const styles = StyleSheet.create({
	view: {
		flex: 1,
		paddingTop: 60,
	},
	text: {
		marginTop: 20,
		marginBottom: 20,
		textAlign: 'center',
		fontFamily: 'Airbnb Cereal App',
		fontWeight: 'bold',
	},
});
export default SignInLoadingScreen;
import React from 'react';

import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import { Avatar, Text, Input, Button, Header, Icon } from 'react-native-elements';

import {StackNavigator} from 'react-navigation';

class CompleteProfileScreen extends React.Component {
	
  static navigationOptions = {
    title: 'Complete Profile',
  };
  
  constructor() {
    super();

	this.state = {
      firstName: null,
      lastName: null,
    }
  }
  
  
 	completeProfile = async () => {
	 	
	 	const backend_token = await AsyncStorage.getItem('backend_token');
	 	
	 	if (!this.state.firstName) {
		 	return alert('Please enter your First Name.');
	 	}
	 	
	 	if (!this.state.lastName) {
		 	return alert('Please enter your Last Name.');
	 	}

	  
		return fetch('https://api.getshepherd.app/api/1.1.0/user/complete', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		        'Authorization': 'Bearer ' + backend_token,
		      },
		      body: JSON.stringify({
		          'first_name': this.state.firstName,
		          'last_name': this.state.lastName,
		      })
		})
		    
		.then((response) => response.json())
		    .then((responseJson) => {
			    
			    if (responseJson.success) {
				    redirectToPosts = async () => {
					    await AsyncStorage.setItem('profile_complete', 'true');
						return this.props.navigation.navigate('App');
					};
									
					redirectToPosts();	
			    }
			    
			    alert('Please complete both fields.');  		    
	  
		    })
		    .catch((error) => {
		      	alert('Oops there was an error! Please try again.');
		    });	
	  
	};


  render() {
	  
	    return (
		    
		    <ScrollView>
		    
			    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				     <View style={styles.view}>
				     
				     	<Header
				     	  backgroundColor={'#FFFFFF'}
						  centerComponent={{ text: 'Complete Profile', style: { color: '#111111', fontFamily: 'Airbnb Cereal App' } }}
						/>
						
						<Text h4 style={{ fontFamily: 'Airbnb Cereal App', padding: 20 }}>Complete your profile.</Text>
						<Text style={{ fontFamily: 'Airbnb Cereal App', paddingLeft: 20, paddingRight: 20 }}>Let other Shepherd users know who you are. Only your first name will be displayed to other Shepherd users.</Text>
				     	
				     	<Input
						  placeholder="First Name"
						  onChangeText={(firstName) => this.setState({firstName})}
						  inputStyle={styles.input}
						/>
						
						<Input
						  placeholder="Last Name"
						  onChangeText={(lastName) => this.setState({lastName})}
						  inputStyle={styles.input}
						/>
	
						
						<Button
						  title="Complete Profile"
						  type="solid"
						  onPress={this.completeProfile}
						  buttonStyle={styles.button}
						  titleStyle={{ fontFamily: 'Airbnb Cereal App', color: '#FFFFFF' }}
						/>
						
						<Text style={{ fontFamily: 'Airbnb Cereal App', paddingLeft: 20, paddingRight: 20, paddingTop: 10, fontWeight: 'bold' }}>Note: We ask for your last name to help investigate instances of abuse and to ensure the overall safety of the platform. It will be kept private and is not shown to other users.</Text>
			
				      </View>
				</TouchableWithoutFeedback>
			</ScrollView>
	    );

  }
  
 
}


const styles = StyleSheet.create({
	view: {
		flex: 1,
	},
	input: {
		marginTop: 20,
		marginLeft: 20,
		marginRight: 20,
		fontFamily: 'Airbnb Cereal App',
	},
	button: {
		marginTop: 20,
		marginLeft: 20,
		marginRight: 20,
		borderColor: '#94009E',
		backgroundColor: '#94009E',
	}
});
export default CompleteProfileScreen;
import React from 'react';

import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  Keyboard,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import { Avatar, Text, Input, Button, Header, Icon } from 'react-native-elements';

import {StackNavigator} from 'react-navigation';

class DeletePostScreen extends React.Component {
	
  static navigationOptions = {
    title: 'Delete Post',
  };
  
  constructor() {
    super();
  }
  
  deletePost = async () => {
	  
	  const backend_token = await AsyncStorage.getItem('backend_token');
	  
	  return fetch('https://api.getshepherd.app/api/post/delete', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		        'Authorization': 'Bearer ' + backend_token,
		      },
		      body: JSON.stringify({
		          'post_id': this.props.navigation.state.params.post_id,
		      })
		})
		    
		.then((response) => response.json())
		    .then((responseJson) => {
			    
			    if (typeof responseJson.message !== 'undefined') {
					if (responseJson.message == 'Unauthenticated.') {
						return this.props.navigation.navigate('TokenError');
					}
				}
			    
				this.props.navigation.navigate('Posts');		    
	  
		    })
		    .catch((error) => {
		      	console.error(error);
		    });
	};


  render() {
	  
	    return (
		    
		     <View style={styles.view}>
		     
		     	<Header
		     	  backgroundColor={'#FF4136'}
				  leftComponent={
					  <Button
						  icon={
						    <Icon
						      name="chevron-left"
						      size={30}
						      color="white"
						    />
						  }
						  title="Posts"
						  titleStyle={{fontSize: 15, fontFamily: 'Airbnb Cereal App'}}
						  buttonStyle={{ backgroundColor: '#FF4136' }}
						  onPress={() => this.props.navigation.navigate('Posts')}
						/>
				  }
				  centerComponent={{ text: 'Delete Post', style: { color: '#fff', fontFamily: 'Airbnb Cereal App' } }}
				/>
				
				<Text h4 style={{ fontFamily: 'Airbnb Cereal App', padding: 20 }}>Are you sure?</Text>
				<Text style={{ fontFamily: 'Airbnb Cereal App', paddingLeft: 20, paddingRight: 20 }}>This action cannot be undone.</Text>
		
				<Button
				  title="Delete Post"
				  onPress={this.deletePost}
				  buttonStyle={styles.button}
				  titleStyle={{ fontFamily: 'Airbnb Cereal App' }}
				/>
	
		      </View>

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
		backgroundColor: '#FF4136',
	}
});
export default DeletePostScreen;
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

class CreatePostScreen extends React.Component {
	
  static navigationOptions = {
    title: 'Post',
  };
  
  constructor() {
    super();

	this.state = {
      text: null,
    }
  }
  
  findCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);
        
        this.setState({ location });
        
        this.storeLastLocation();
        
      },
      error => this.handleLocationError(),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };
  
  storeLastLocation = async () => {
	    await AsyncStorage.setItem('last_location', this.state.location);
  };

  
  handleLocationError = () => {
	  this.setState({ locationAllowed: false });
	  alert("Location is required for app to work!");
  }

  createPost = async () => {
	  
	  
	  var last_location = await AsyncStorage.getItem('last_location');
	  
	  last_location = JSON.parse(last_location);
	  
	  const backend_token = await AsyncStorage.getItem('backend_token');
	  
	  return fetch('https://api.getshepherd.app/api/post', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		        'Authorization': 'Bearer ' + backend_token,
		      },
		      body: JSON.stringify({
		          'content': this.state.text,
		          'location_lat': last_location.coords.latitude,
		          'location_long': last_location.coords.longitude
		      })
		})
		    
		.then((response) => response.json())
		    .then((responseJson) => {
			    
			     this.props.navigation.navigate('Posts');			    
	  
		    })
		    .catch((error) => {
		      	console.error(error);
		    });
	};


  render() {
	  
	    return (
		    
		    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
			     <View style={styles.view}>
			     
			     	<Header
			     	  backgroundColor={'#FFFFFF'}
					  leftComponent={
						  <Button
							  icon={
							    <Icon
							      name="chevron-left"
							      size={30}
							      color="#94009E"
							    />
							  }
							  title="Posts"
							  titleStyle={{fontSize: 15, fontFamily: 'Airbnb Cereal App', color: '#94009E'}}
							  buttonStyle={{ backgroundColor: '#FFFFFF' }}
							  onPress={() => this.props.navigation.navigate('Posts')}
							/>
					  }
					  centerComponent={{ text: 'Create Post', style: { color: '#111111', fontFamily: 'Airbnb Cereal App' } }}
					/>
					
					<Text h4 style={{ fontFamily: 'Airbnb Cereal App', padding: 20 }}>Write a post for your local flock.</Text>
					<Text style={{ fontFamily: 'Airbnb Cereal App', paddingLeft: 20, paddingRight: 20 }}>Only other Shepherd users within roughly a 5 mile radius will be able to see your post and it will disappear after 24 hours.</Text>
			     	
			     	<Input
					  placeholder="What's going on?"
					  onChangeText={(text) => this.setState({text})}
					  inputStyle={styles.input}
					/>
					
					<Button
					  title="Post"
					  type="solid"
					  onPress={this.createPost}
					  buttonStyle={styles.button}
					  titleStyle={{ fontFamily: 'Airbnb Cereal App', color: '#FFFFFF' }}
					/>
					
					<Text style={{ fontFamily: 'Airbnb Cereal App', paddingLeft: 20, paddingRight: 20, paddingTop: 10, fontWeight: 'bold' }}>Remember: Posting sensitive content, harassing others, or making threats can result in a permanent ban.</Text>
		
			      </View>
			</TouchableWithoutFeedback>
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
export default CreatePostScreen;
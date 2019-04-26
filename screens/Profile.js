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

import { Avatar, Text, Header, Card, Button } from 'react-native-elements';

class ProfileScreen extends React.Component {
	
  static navigationOptions = {
    title: 'Profile',
  };
  
  constructor() {
    super();
    
    this.state = {
      userLoaded: false,
      user: null,
      refreshing: false,
    }
    
    this._getProfileInfo();
  }
  
   _onRefresh = () => {
  	this._getProfileInfo();
  }
  
  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      
      //prevent this from firing twice when the screen is first loaded
      if ( this.state.postsLoaded == true ) {
      	this._getPosts();
	  }
      
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }



  render() {
	  if ( this.state.userLoaded ) {
	  
	    return (
		    
		    <React.Fragment>

		    
	    <ScrollView 
	     		style={styles.view}
		     	refreshControl={
		          <RefreshControl
		            refreshing={this.state.refreshing}
		            onRefresh={this._onRefresh}
		          />
		        }>
	     				
			<Card>
				<View style={{flexDirection: 'row'}}>
	        		<View>
	        		
	        			<Avatar
						  rounded
						  size="medium"
						  source={{
						    uri:
						      this.state.user.avatar
						  }}
						/>
	        		
	        		</View>
	        	
	        	
					<View style={{paddingLeft: 10, paddingTop: 8 }}>
	        		
	        			<Text h4 style={{fontFamily: 'Airbnb Cereal App' }}>{this.state.user.name}</Text>
	        		
	        		</View>
	        		
	        	</View>
	        	
	        </Card>
	        
	        <Card>

        	
				<View>
        		
        			<Text h4 style={{fontFamily: 'Airbnb Cereal App', textAlign: 'center' }}>ShepherdScore</Text>
        			
        			<Text h3 style={{fontFamily: 'Airbnb Cereal App', fontWeight: 'bold', textAlign: 'center', marginTop: 30, color: '#94009E' }}>{this.state.user.stats.score}</Text>
        			
        			<Text style={{fontFamily: 'Airbnb Cereal App', fontWeight: 'bold', textAlign: 'center', marginTop: 25, fontSize: 16 }}>{this.state.user.stats.post_count} Posts</Text>
        			
        			<Text style={{fontFamily: 'Airbnb Cereal App', fontWeight: 'bold', textAlign: 'center', marginTop: 10, fontSize: 16 }}>{this.state.user.stats.vote_score} Upvotes on Your Posts</Text>
        			
        			<Text style={{fontFamily: 'Airbnb Cereal App', fontWeight: 'bold', textAlign: 'center', marginTop: 10, fontSize: 16 }}>{this.state.user.stats.vote_count} Votes on Other Posts</Text>
        			
        			<Text style={{fontFamily: 'Airbnb Cereal App', fontWeight: 'bold', textAlign: 'center', marginTop: 10, fontSize: 16 }}>{this.state.user.stats.comment_count} Comments</Text>
        			<Text style={{fontFamily: 'Airbnb Cereal App', fontWeight: 'bold', textAlign: 'center', marginTop: 10, fontSize: 16 }}>{this.state.user.stats.daily_streak} Day Post Streak</Text>
        		
        		</View>
        		

	        	
	        </Card>

	        
	        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 80}}>

		        <Button
		        	onPress={() => this._signOutAsync()}
		        	buttonStyle={styles.button}
					titleStyle={{ fontFamily: 'Airbnb Cereal App', color: '#FFFFFF' }}
		        	title="Log Out"
		        />
		        		          
		    </View>

	      </ScrollView>
	      
	      </React.Fragment>
	    );
	    
	  } else {
		  return (
			  <View style={{ paddingTop: 60 }}>
				  
				  <Text h4 style={{ fontFamily: 'Airbnb Cereal App', textAlign: 'center'}}>Loading Profile...</Text>
				  <ActivityIndicator size="large" color="#94009E" style={{ marginTop: 10 }} />
  
				</View>
			);
	  }
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
  
  _getProfileInfo = async () => {
	  
	  const backend_token = await AsyncStorage.getItem('backend_token');
	  
	  return fetch('https://api.getshepherd.app/api/1.1.0/user', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		        'Authorization': 'Bearer ' + backend_token,
		        'Accept': 'application/json',
		      },
		      body: JSON.stringify({
		          'api_token': backend_token
		      })
		})
		.then((response) => {
			if (response.status == 401) {
				return this.props.navigation.navigate('Auth');
			}

		    if(!response.ok) throw new Error(response.status);
		    else return response;
		})
		    
		.then((response) => response.json())
		    .then((responseJson) => {
			    
			    this.setState({
			        userLoaded: true,
			        user: responseJson.user
			    });
			    
	  
		    })
		    .catch((error) => {
		      	return this.props.navigation.navigate('ErrorLoading');
		    });
	};
}


const styles = StyleSheet.create({
	view: {
		paddingTop: 40,
	},
	button: {
		marginTop: 20,
		marginLeft: 20,
		marginRight: 20,
		borderColor: '#94009E',
		backgroundColor: '#94009E',
	}
});
export default ProfileScreen;

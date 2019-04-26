import React from 'react';

import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';

import NetInfo from "@react-native-community/netinfo";

import AsyncStorage from '@react-native-community/async-storage';

import { Avatar, Text, Card, ListItem, Button, Icon, Divider, Header, ButtonGroup, Tooltip, Overlay, Image } from 'react-native-elements';

class HomeScreen extends React.Component {
	
  static navigationOptions = {
    title: 'Local',
  };
  
  constructor() {
    super();
    
    const profile_complete = this.checkProfile();
    
    this.state = {
      postsLoaded: false,
      posts: null,
      location: null,
      locationAllowed: true,
      refreshing: false,
      postModalIsVisible: false,
      postBeingViewModal: null,
      postedByCurrentUser: false,
      totalVotes: 0,
      profileComplete: false,
    }
  
    this.findCoordinates();
    
    if (this.state.profile_complete == 'false') {
		return this.props.navigation.navigate('CompleteProfile');
	}
 
  }
  
  checkProfile = async() => {
	  const profile_complete = await AsyncStorage.getItem('profile_complete');
	  
	  this.setState({profile_complete: profile_complete});
  };
  
  _onRefresh = () => {
  	this._getPosts();
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
	  if ( this.state.locationAllowed === false) {
		  return (
			  <View style={{ paddingTop: 50 }}>
				  
				  <Text h4 style={{ fontFamily: 'Airbnb Cereal App', textAlign: 'center'}}>Please enable location sharing in your phone&apos;s settings.</Text>
				  <Text style={{ fontFamily: 'Airbnb Cereal App', padding: 20}}>To enable, Open your phone&apos;s Settings App, Scroll down to Shepherd, Tap Location and Select While Using App. You may need to restart Shepherd after allowing location sharing.</Text>
				  <Text style={{ fontFamily: 'Airbnb Cereal App', padding: 20}}>We need your location to show you posts around you. We&apos;ll only check your location while the app is open.</Text>
  
				</View>
			);
			
	  } else if ( this.state.postsLoaded ) {
		  
		const menuButtons = ['Hot Posts', 'Most Recent'];
		const { selectedIndex } = this.state
	  
	    return (
		    
		    <React.Fragment>

			<Header
			  backgroundColor={'#FFFFFF'}
			  centerComponent={
			  	<ButtonGroup
			      onPress={i => {
				    this._getPostsFiltered(i);
		          }}
			      selectedIndex={selectedIndex}
			      buttons={menuButtons}
			      containerStyle={{height: 25}}
			      textStyle={{fontSize: 12, fontFamily: 'Airbnb Cereal App'}}
			    />
			  }
			  rightComponent={
				  <Button
				     buttonStyle={{ backgroundColor: '#FFFFFF' }}
					  icon={
					    <Icon
					      name="edit"
					      size={25}
					      color="#94009E"
					      type='font-awesome'   
					    />
					  }
					  onPress={() => this.props.navigation.navigate('CreatePost')}
					/>
			  }
			/>

	     	<ScrollView 
	     		style={styles.view}
		     	refreshControl={
		          <RefreshControl
		            refreshing={this.state.refreshing}
		            onRefresh={this._onRefresh}
		          />
		        }>


				{this.state.posts.length == 0 ? <Text h4 style={{ fontFamily: 'Airbnb Cereal App', padding: 20, textAlign: 'center' }}>No posts yet in your area!</Text>: null}
				
				{this.state.posts.length == 0 ? <Button title="Be the First" onPress={() => this.props.navigation.navigate('CreatePost')} buttonStyle={{ margin:20, backgroundColor: '#94009E' }}/>: null}
	     	
				  {
				    this.state.posts.map((p, i) => {
				      return (
				        <Card key={i} containerStyle={styles.noMargin}>
				        	<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}}>
				        		<View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-start'}}>
					        		<View>
					        		
					        			<Avatar
										  rounded
										  size="small"
										  source={{
										    uri:
										      p.user_avatar
										  }}
										/>
					        		
					        		</View>
					        	
					        	
									<View style={{paddingLeft: 10, paddingTop: 8 }}>
					        		
					        			<Text style={{fontFamily: 'Airbnb Cereal App' }}>{p.user_name}</Text>
					        		
					        		</View>
					        		
					        		<View style={{paddingLeft: 10, marginTop: 14 }}>
					        		
					        			<Icon
										  size={5}
										  name='circle'
										  type='font-awesome'
										  color={'#94009E'}
										/>
					        		
					        		</View>
					        		
					        		<View style={{paddingLeft: 10, paddingTop: 8 }}>
					        		
					        			<Text style={{fontFamily: 'Airbnb Cereal App' }}>
	
					        				{p.display_posted_time}
					        			
					        			</Text>
					        		
					        		</View>
				        		
				        		</View>
				        		
				        		<View>
				        		
				        			<Button
										  title=""
										  type="clear"
										  
										  icon={
										    <Icon
										      name="ellipsis-h"
										      size={22}
										      type='font-awesome'
										      color={'#94009E'}
										    />
										  }
										  onPress={() => {
											  this.setState({ postModalIsVisible: true, postBeingViewModal: p, postedByCurrentUser: p.posted_by_current_user })
											}}
										/>
				        							        		
				        		</View>

				        	</View>				        	
				    		<Text style={styles.contentText}>{p.content}</Text>
				    		
				    		<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}}>

								<View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-start'}}>
								
									<View>
				        		
					        			<Button
										  title=""
										  type="clear"
										  icon={
										    <Icon
										      name="arrow-up"
										      size={16}
										      type='font-awesome'
										      color={[p.voted_up_by_current_user ? '#94009E' : '#AAAAAA']}
										      onPress={async () => {
											      
											      var clonedPosts = JSON.parse(JSON.stringify(this.state.posts));
										      
												  clonedPosts[i].voted_down_by_current_user = false;
												  clonedPosts[i].voted_up_by_current_user = true;
												  
												  this.setState({ posts: clonedPosts });
											      
											      const backend_token = await AsyncStorage.getItem('backend_token');
		  
												  return fetch('https://api.getshepherd.app/api/1.1.0/vote', {
													      method: 'POST',
													      headers: {
													        'Content-Type': 'application/json',
													        'Authorization': 'Bearer ' + backend_token,
													        'Accept': 'application/json',
													      },
													      body: JSON.stringify({
													          'post_id': p.id,
													          'vote_type': 'vote_up'
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

														    clonedPosts[i].votes = responseJson.total_votes;
														    
															this.setState({ posts: clonedPosts });
													    })
													    .catch((error) => {
													      	console.error(error);
													    });
	
										      }}
										    />
										  }
										/>
													        		
				        		</View>
				        		
				        		
				        		<View style={{paddingTop: 8 }}>
				        		
				        			<Text style={{fontFamily: 'Airbnb Cereal App' }}>
	
										{p.votes}

				        			</Text>
				        		
				        		</View>
				        		
				        		<View>
				        		
				        			<Button
									  title=""
									  type="clear"
									  icon={
									    <Icon
									      name="arrow-down"
									      size={16}
									      type='font-awesome'
									      color={[p.voted_down_by_current_user ? '#94009E' : '#AAAAAA']} 
									      onPress={async () => {
										      
										      var clonedPosts = JSON.parse(JSON.stringify(this.state.posts));
										      
										      clonedPosts[i].voted_down_by_current_user = true;
										      clonedPosts[i].voted_up_by_current_user = false;
													    
											  this.setState({ posts: clonedPosts });
										      
										      const backend_token = await AsyncStorage.getItem('backend_token');
										      	  
											  return fetch('https://api.getshepherd.app/api/1.1.0/vote', {
												      method: 'POST',
												      headers: {
												        'Content-Type': 'application/json',
												        'Authorization': 'Bearer ' + backend_token,
												        'Accept': 'application/json',
												      },
												      body: JSON.stringify({
												          'post_id': p.id,
												          'vote_type': 'vote_down'
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
													    
													    clonedPosts[i].votes = responseJson.total_votes;
													    
														this.setState({ posts: clonedPosts });
												    })
												    .catch((error) => {
												      	console.error(error);
												    });

									      }}
									    />
									  }
									/>
													        		
				        		</View>
				        		</View>
				        		
				        		<View>
				        		
				        			<Button
									  title={p.comments}
									  type="clear"
									  icon={
									    <Icon
									      color={'#94009E'}
									      name="comment"
									      size={15}
									      type='font-awesome' 
										/>
									}
									onPress={() => this.props.navigation.navigate('ViewPost', {post_id: p.id})}
									containerStyle={{ paddingLeft: 60 }}
									titleStyle={{ color: '#484848', fontSize: 14, paddingLeft: 5 }}
									/>
													        		
				        		</View>

				        		
				        	</View>

				    	</Card>
				      );
				    })
				  }
	     	
	     	</ScrollView>
	     	
	     	
	     	 <Overlay isVisible={this.state.postModalIsVisible}
	     	 	onBackdropPress={() => this.setState({ postModalIsVisible: false})}
	     	 	height={120}
	     	 >
				  <Button
					  title="Report"
					  type="solid"
					  buttonStyle={{ backgroundColor: '#FF851B' }}
					  containerStyle={{ marginBottom: 10 }}
					  titleStyle={{ fontFamily: 'Airbnb Cereal App' }}
					  
					  icon={
					    <Icon
					      containerStyle={{ marginRight: 8 }}
					      name="flag"
					      size={20}
					      type='font-awesome'
					      color={"#FFFFFF"}
					    />
					  }
					  onPress={() => {
						  this.setState({ postModalIsVisible: false });
						  this.props.navigation.navigate('ReportPost', {post_id: this.state.postBeingViewModal.id});
						  }
						}
					/>
					
					{this.state.postedByCurrentUser ? <Button title="Delete Post" type="solid" buttonStyle={{ backgroundColor: '#FF4136' }} titleStyle={{ fontFamily: 'Airbnb Cereal App' }} onPress={() => { this.setState({ postModalIsVisible: false }); this.props.navigation.navigate('DeletePost', {post_id: this.state.postBeingViewModal.id}) }}/> : null }

					

			 </Overlay>
	     	

			</React.Fragment>

	    );
	    
	  } else {
		  return (
			  <View style={{ paddingTop: 60 }}>
				  
				  <Text h4 style={{ fontFamily: 'Airbnb Cereal App', textAlign: 'center'}}>Loading Posts...</Text>
				  <ActivityIndicator size="large" color="#94009E" style={{ marginTop: 10 }} />
  
				</View>
			);
			
	  }
  }
  


  findCoordinates = () => {

    navigator.geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);
        
        this.setState({ location });
        
        this.storeLastLocation();
        
        this._getPosts();
        
        //watch the location and report changes
		watchId = navigator.geolocation.watchPosition(
		      position => {
		        const location = JSON.stringify(position);
		        
		        this.setState({ location });
		        
		        this.storeLastLocation();
		        
		        this._getPosts();		        
		      },
		      error => this.handleLocationError(),
		      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		    );
		    
		this.setState({ watchId: watchId });    
		this.storeWatchId();
        
      },
      error => this.handleLocationError(),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };
  
  storeLastLocation = async () => {
	    await AsyncStorage.setItem('last_location', this.state.location);
  };
  
  storeWatchId = async() => {
	  await AsyncStorage.setItem('watchId', this.state.watchId.toString());
  };

  
  handleLocationError = () => {
	  this.setState({ locationAllowed: false });
  }
  
  _getPosts = async () => {
	  
	  this.setState({refreshing: true});
	  
	  var last_location = await AsyncStorage.getItem('last_location');
	  
	  last_location = JSON.parse(last_location);
	  
	  const backend_token = await AsyncStorage.getItem('backend_token');
	  
	  return fetch('https://api.getshepherd.app/api/1.1.0/posts', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		        'Authorization': 'Bearer ' + backend_token,
		        'Accept': 'application/json',
		      },
		      body: JSON.stringify({
		          'location_lat': last_location.coords.latitude,
		          'location_long': last_location.coords.longitude
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
			        postsLoaded: true,
			        posts: responseJson.posts,
			        refreshing: false
			    });
			    
	  
		    })
		    .catch((error) => {
		      	return this.props.navigation.navigate('ErrorLoading');
		    });
	};
	
	_getPostsFiltered = async (i) => {
		
	  this.setState({refreshing: true});

	  if (i == 0) {
		  //hot
		  var sort = 'hot';
	  } else {
		  //recent
		  var sort = 'recent';
	  }
	  
	  var last_location = await AsyncStorage.getItem('last_location');
	  
	  last_location = JSON.parse(last_location);
	  
	  const backend_token = await AsyncStorage.getItem('backend_token');
	  
	  return fetch('https://api.getshepherd.app/api/1.1.0/posts', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		        'Authorization': 'Bearer ' + backend_token,
		        'Accept': 'application/json',
		      },
		      body: JSON.stringify({
		          'location_lat': last_location.coords.latitude,
		          'location_long': last_location.coords.longitude,
		          'sort': sort
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
			        postsLoaded: true,
			        posts: responseJson.posts,
			        refreshing: false
			    });
			    
	  
		    })
		    .catch((error) => {
		      	return this.props.navigation.navigate('ErrorLoading');
		    });
	};

}


const styles = StyleSheet.create({
	view: {
		paddingTop: 0,
	},
	contentText: {
		fontFamily: 'Airbnb Cereal App',
		fontWeight: 'bold',
		marginTop: 10,
	},
	noMargin: {
		marginLeft: 0, 
		marginRight: 0,
		marginBottom: 0,
		marginTop: 0,
	},
});
export default HomeScreen;

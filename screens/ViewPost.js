import React from 'react';

import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';

import { Avatar, Text, Input, Button, Header, Icon, Card, Overlay } from 'react-native-elements';

import {StackNavigator} from 'react-navigation';

class ViewPostScreen extends React.Component {
	
  static navigationOptions = {
    title: 'Post',
  };
  
  constructor() {
    super();

	this.state = {
      text: null,
      postLoaded: false,
      commentsLoaded: false,
      postModalIsVisible: false,
      commentModalIsVisible: false,
      
    }
    
    this._getPost();
   
  }
  
  _onRefresh = () => {
  	this._getPost();
  }
  
  _onRefreshComments = () => {
  	this._getComments();
  }
  
  componentDidMount() {
    const { navigation } = this.props;
    
    this.focusListener = navigation.addListener("didFocus", () => {
      
      //prevent this from firing twice when the screen is first loaded
      if ( this.state.postsLoaded == true ) {
      	this.getpost();
	  }
      
    });
  }

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  }
  
  _getPost = async () => {
	  
	  this.setState({refreshing: true});
	  
	  var last_location = await AsyncStorage.getItem('last_location');
	  
	  last_location = JSON.parse(last_location);
	  
	  const backend_token = await AsyncStorage.getItem('backend_token');
	  
	  return fetch('https://api.getshepherd.app/api/post/get', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		        'Authorization': 'Bearer ' + backend_token,
		        'Accept': 'application/json',
		      },
		      body: JSON.stringify({
		          'post_id': this.props.navigation.state.params.post_id
		      })
		})
		    
		.then((response) => response.json())
		    .then((responseJson) => {
			    
			    if (typeof responseJson.message !== 'undefined') {
					if (responseJson.message == 'Unauthenticated.') {
						return this.props.navigation.navigate('TokenError');
					}
				}
			    
			    this.setState({
			        postLoaded: true,
			        post: responseJson.post,
			        refreshing: false
			    });
			    
			    this._getComments(); 
	  
		    })
		    .catch((error) => {
		      	console.error(error);
		    });
	};
	
	_getComments = async () => {
	  
	  this.setState({refreshingComments: true});
	  
	  var last_location = await AsyncStorage.getItem('last_location');
	  
	  last_location = JSON.parse(last_location);
	  
	  const backend_token = await AsyncStorage.getItem('backend_token');
	  
	  return fetch('https://api.getshepherd.app/api/post/comments', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		        'Authorization': 'Bearer ' + backend_token,
		        'Accept': 'application/json',
		      },
		      body: JSON.stringify({
		          'post_id': this.props.navigation.state.params.post_id
		      })
		})
		    
		.then((response) => response.json())
		    .then((responseJson) => {
			    
			    if (typeof responseJson.message !== 'undefined') {
					if (responseJson.message == 'Unauthenticated.') {
						return this.props.navigation.navigate('TokenError');
					}
				}
			    
			    this.setState({
			        commentsLoaded: true,
			        comments: responseJson.comments,
			        refreshingComments: false
			    });
			    
	  
		    })
		    .catch((error) => {
		      	console.error(error);
		    });
	};

	createComment = async () => {
	  
	  const backend_token = await AsyncStorage.getItem('backend_token');
	  
	  return fetch('https://api.getshepherd.app/api/comment', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		        'Authorization': 'Bearer ' + backend_token,
		        'Accept': 'application/json',
		      },
		      body: JSON.stringify({
		          'content': this.state.text,
		          'post_id': this.state.post.id
		      })
		})
		    
		.then((response) => response.json())
		    .then((responseJson) => {
			    
			    if (typeof responseJson.message !== 'undefined') {
					if (responseJson.message == 'Unauthenticated.') {
						return this.props.navigation.navigate('TokenError');
					}
				}
			    
			    this._getComments(); 		    
	  
		    })
		    .catch((error) => {
		      	console.error(error);
		    });
	};



  render() {
	  
	  if ( this.state.postLoaded && this.state.commentsLoaded ) {
	  
	    return (
		    
		    <React.Fragment>

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
				  centerComponent={{ text: 'View Post', style: { color: '#111111', fontFamily: 'Airbnb Cereal App' } }}
				/>
	
	
				<View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
			    
			    	{/* post view */}
			    	<ScrollView style={{ flex: 1}}>

				    
				    	<Card>
							<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'}}>
								<View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-start'}}>
						    		<View>
						    		
						    			<Avatar
										  rounded
										  size="small"
										  source={{
										    uri:
										      this.state.post.user_avatar
										  }}
										/>
						    		
						    		</View>
						    	
						    	
									<View style={{paddingLeft: 10, paddingTop: 8 }}>
						    		
						    			<Text style={{fontFamily: 'Airbnb Cereal App' }}>{this.state.post.user_name}</Text>
						    		
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
						
						    				{this.state.post.display_posted_time}
						    			
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
											  this.setState({ postModalIsVisible: true, postBeingViewModal: this.state.post, postedByCurrentUser: this.state.post.posted_by_current_user })
											}}
										/>
													        		
								</View>
						
							</View>
							
							<Text style={styles.contentText}>{this.state.post.content}</Text>
							
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
										      color={[this.state.post.voted_up_by_current_user ? '#94009E' : '#AAAAAA']}
										      onPress={async () => {
											      
											      var clonedPosts = JSON.parse(JSON.stringify(this.state.post));
										      
												  clonedPosts.voted_down_by_current_user = false;
												  clonedPosts.voted_up_by_current_user = true;
												  
												  this.setState({ post: clonedPosts });
											      
											      const backend_token = await AsyncStorage.getItem('backend_token');
						
												  return fetch('https://api.getshepherd.app/api/vote', {
													      method: 'POST',
													      headers: {
													        'Content-Type': 'application/json',
													        'Authorization': 'Bearer ' + backend_token,
													        'Accept': 'application/json',
													      },
													      body: JSON.stringify({
													          'post_id': this.state.post.id,
													          'vote_type': 'vote_up'
													      })
													})
													    
													.then((response) => response.json())
													    .then((responseJson) => {
														    
														    if (typeof responseJson.message !== 'undefined') {
																if (responseJson.message == 'Unauthenticated.') {
																	return this.props.navigation.navigate('TokenError');
																}
															}
						
														    clonedPosts.votes = responseJson.total_votes;
														    
															this.setState({ post: clonedPosts });
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
						
										{this.state.post.votes}
						
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
									      color={[this.state.post.voted_down_by_current_user ? '#94009E' : '#AAAAAA']} 
									      onPress={async () => {
										      
										      var clonedPosts = JSON.parse(JSON.stringify(this.state.post));
										      
										      clonedPosts.voted_down_by_current_user = true;
										      clonedPosts.voted_up_by_current_user = false;
													    
											  this.setState({ post: clonedPosts });
										      
										      const backend_token = await AsyncStorage.getItem('backend_token');
										      	  
											  return fetch('https://api.getshepherd.app/api/vote', {
												      method: 'POST',
												      headers: {
												        'Content-Type': 'application/json',
												        'Authorization': 'Bearer ' + backend_token,
												        'Accept': 'application/json',
												      },
												      body: JSON.stringify({
												          'post_id': this.state.post.id,
												          'vote_type': 'vote_down'
												      })
												})
												    
												.then((response) => response.json())
												    .then((responseJson) => {
													    
													    if (typeof responseJson.message !== 'undefined') {
															if (responseJson.message == 'Unauthenticated.') {
																return this.props.navigation.navigate('TokenError');
															}
														}
													    
													    clonedPosts.votes = responseJson.total_votes;
													    
														this.setState({ post: clonedPosts });
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
						
								
							</View>
						
						</Card>
						
						<View style={{ flex: 1, flexDirection: 'row', paddingLeft: 20, paddingRight: 20, paddingTop: 8}}>
				        	<View style={{ flex: 2, paddingRight: 6}}>
					        	<Input
								  placeholder='Comment on this post.'
								  onChangeText={(text) => this.setState({text})}
								  ref={input => { this.input = input }}
								/>
								
							</View>
							<View>
							
								<Button
								  icon={
								    <Icon
								      name="comment"
								      size={15}
									  type="font-awesome"
									  color={'#FFFFFF'}
								    />
								  }
								  buttonStyle={{ backgroundColor: '#94009E', marginTop: 4 }}
								  title=""
								  onPress={() => { this.input.clear(); this.createComment(); }}
								/>
							
							</View>
						</View>

					
						<Text style={{ fontFamily: 'Airbnb Cereal App', marginLeft: 20, marginTop: 10, fontWeight: 'bold', fontSize: 16}}>Comments</Text>
		
						
						 {
							//comments
						    this.state.comments.map((p, i) => {
						      return (
						        <Card>
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
													  this.setState({ commentModalIsVisible: true, commentBeingViewModal: p, postedByCurrentUser: p.posted_by_current_user })
													}}
												/>
															        		
										</View>
								
									</View>						        	
						    		<Text style={styles.contentText}>{p.content}</Text>
						    		
						    								
						    	</Card>
						      );
						    })
							  
						
						}

							    
		
				        
			        {/* end comments and post ScrollView */}
			        </ScrollView>
						
						

	
				</View>
				
				
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
			 
			 <Overlay isVisible={this.state.commentModalIsVisible}
		     	 	onBackdropPress={() => this.setState({ commentModalIsVisible: false})}
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
							  this.setState({ commentModalIsVisible: false });
							  this.props.navigation.navigate('ReportComment', {comment_id: this.state.commentBeingViewModal.id});
							  }
							}
						/>
						
						{this.state.postedByCurrentUser ? <Button title="Delete Comment" type="solid" buttonStyle={{ backgroundColor: '#FF4136' }} titleStyle={{ fontFamily: 'Airbnb Cereal App' }} onPress={() => { this.setState({ commentModalIsVisible: false }); this.props.navigation.navigate('DeleteComment', {comment_id: this.state.commentBeingViewModal.id}) }}/> : null }
	
						

			 </Overlay>



	     	

			</React.Fragment>
	    );
	    
	  } {
		   return (
			  <View style={{ paddingTop: 60 }}>
				  
				  <Text h4 style={{ fontFamily: 'Airbnb Cereal App', textAlign: 'center'}}>Loading Post...</Text>
				  <ActivityIndicator size="large" color="#94009E" style={{ marginTop: 10 }} />
  
				</View>
			);
	  }

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
	}
});
export default ViewPostScreen;
import React from 'react';

import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Keyboard,
  Picker,
} from 'react-native';

import { Avatar, Text, Input, Button, Header, Icon, Overlay } from 'react-native-elements';

import {StackNavigator} from 'react-navigation';

class ReportCommentScreen extends React.Component {
	
  static navigationOptions = {
    title: 'Report Comment',
  };
  
  constructor() {
    super();

	this.state = {
      reportReason: 'harassment',
      modalIsVisible: false,
    }
  }
  
  reportComment = async () => {
	  
	  
	  var last_location = await AsyncStorage.getItem('last_location');
	  
	  last_location = JSON.parse(last_location);
	  
	  const backend_token = await AsyncStorage.getItem('backend_token');
	  
	  return fetch('https://api.getshepherd.app/api/comment/report', {
		      method: 'POST',
		      headers: {
		        'Content-Type': 'application/json',
		        'Authorization': 'Bearer ' + backend_token,
		      },
		      body: JSON.stringify({
		          'comment_id': this.props.navigation.state.params.comment_id,
				  'report_reason': this.state.reportReason,
		      })
		})
		    
		.then((response) => response.json())
		    .then((responseJson) => {
			    
			    if (typeof responseJson.message !== 'undefined') {
					if (responseJson.message == 'Unauthenticated.') {
						return this.props.navigation.navigate('TokenError');
					}
				}
			    
				this.setState({ modalIsVisible: true })			    
	  
		    })
		    .catch((error) => {
		      	console.error(error);
		    });
	};


  render() {
	  
	    return (
		    
			<React.Fragment>
			     <View style={styles.view}>
			     
			     	<Header
			     	  backgroundColor={'#FF851B'}
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
							  buttonStyle={{ backgroundColor: '#FF851B' }}
							  onPress={() => this.props.navigation.navigate('Posts')}
							/>
					  }
					  centerComponent={{ text: 'Report Comment', style: { color: '#fff', fontFamily: 'Airbnb Cereal App' } }}
					/>
					
					<Text h4 style={{ fontFamily: 'Airbnb Cereal App', padding: 20 }}>Report a comment</Text>
					<Text style={{ fontFamily: 'Airbnb Cereal App', paddingLeft: 20, paddingRight: 20 }}>Tell us why you would like to report this comment.</Text>
					
					<Picker
					  selectedValue={this.state.reportReason}
					  onValueChange={(itemValue, itemIndex) =>
					    this.setState({reportReason: itemValue})
					  }>
					  <Picker.Item label="Harassment" value="harassment" />
					  <Picker.Item label="Violence" value="violence" />
					  <Picker.Item label="Suicide or Self-Injury" value="suicide-self-injury" />
					  <Picker.Item label="Spam" value="spam" />
					  <Picker.Item label="Unauthorized Sales" value="unauthorized-sales" />
					  <Picker.Item label="Hate Speech" value="hate-speech" />
					  <Picker.Item label="Terrorism" value="terrorism" />
					</Picker>
	
					
					<Button
					  title="Report Comment"
					  onPress={this.reportComment}
					  buttonStyle={styles.button}
					  titleStyle={{ fontFamily: 'Airbnb Cereal App' }}
					/>
					
					<Text style={{ fontFamily: 'Airbnb Cereal App', paddingLeft: 20, paddingRight: 20, paddingTop: 10, fontWeight: 'bold' }}>If you believe someone is in immediate danger, call emergency services now. Don&apos;t wait.</Text>
		
			      </View>
			      
			      <Overlay isVisible={this.state.modalIsVisible}
		     	 	onBackdropPress={() => this.setState({ modalIsVisible: false})}
		     	 	height={160}
		     	 >
					  
					  <Text h5 style={{ fontFamily: 'Airbnb Cereal App', padding: 20, textAlign: 'center' }}>Thank you. We&apos;ve received your report.</Text>
					  
					  <Button
						  title="Back to Posts"
						  type="solid"
						  buttonStyle={{ backgroundColor: '#FF851B' }}
						  containerStyle={{ marginBottom: 10 }}
						  titleStyle={{ fontFamily: 'Airbnb Cereal App' }}
						  
						  onPress={() => {
							  this.setState({ modalIsVisible: false });
							  this.props.navigation.navigate('Posts');
							  }
							}
						/>
						
				 </Overlay>
			 
			 </React.Fragment>

	
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
		marginTop: 10,
		marginLeft: 20,
		marginRight: 20,
		backgroundColor: '#FF851B',
	}
});
export default ReportCommentScreen;
import React, {Component} from 'react';

import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { createStackNavigator, createSwitchNavigator, createAppContainer, createBottomTabNavigator } from 'react-navigation';

import { Icon } from 'react-native-elements';

import HomeScreen from './screens/Home';
import SignInScreen from './screens/SignIn';
import SignInLoadingScreen from './screens/SignInLoading';
import ProfileScreen from './screens/Profile';
import CreatePostScreen from './screens/CreatePost';
import ViewPostScreen from './screens/ViewPost';
import ReportPostScreen from './screens/ReportPost';
import DeletePostScreen from './screens/DeletePost';
import LocationRequiredScreen from './screens/LocationRequired';
import LocationDeniedScreen from './screens/LocationDenied';
import ReportCommentScreen from './screens/ReportComment';
import DeleteCommentScreen from './screens/DeleteComment';
import TokenErrorScreen from './screens/TokenError';

import { Sentry } from 'react-native-sentry';

Sentry.config('https://6eb053cc2f9249448eadad39862b03dd@sentry.io/1437098').install();


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const backend_token = await AsyncStorage.getItem('backend_token');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(backend_token ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}


const PostStack = createStackNavigator(
	{
		Posts: {
			screen: HomeScreen
		},
		CreatePost: {
			screen: CreatePostScreen
		},
		ViewPost: {
			screen: ViewPostScreen
		},
		ReportPost: {
			screen: ReportPostScreen
		},
		DeletePost: {
			screen: DeletePostScreen
		},
		DeleteComment: {
			screen: DeleteCommentScreen
		},
		ReportComment: {
			screen: ReportCommentScreen
		},
	},
	{
	  headerMode: 'none',
	  navigationOptions: {
	    headerVisible: false,
	  }
	 }

);


const AuthStack = createSwitchNavigator({ SignIn: SignInScreen, SignInLoading: SignInLoadingScreen });

const LocationStack = createSwitchNavigator({ LocationRequired: LocationRequiredScreen, LocationDenied: LocationDeniedScreen });


const AppStack = createBottomTabNavigator(
  {
    Posts: PostStack,
    Profile: ProfileScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Posts') {
          iconName = `comments`;
          // Sometimes we want to add badges to some icons. 
          // You can check the implementation below.
          //IconComponent = HomeIconWithBadge; 
        } else if (routeName === 'Profile') {
          iconName = `user-circle`;
        }

        // You can return any component that you like here!
        return <Icon name={iconName} type="font-awesome" size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#94009E',
      inactiveTintColor: 'gray',
    },
  }
);


export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
    Location: LocationStack,
    TokenError: TokenErrorScreen,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

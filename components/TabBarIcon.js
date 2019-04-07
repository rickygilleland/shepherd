import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Platform } from 'react-native';

export default class TabBarIcon extends React.Component {
  render() {
    return (
      <Icon.Ionicons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
      />
    );
  }
}
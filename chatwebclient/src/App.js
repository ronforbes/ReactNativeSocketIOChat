import React from 'react';
import SocketIOClient from 'socket.io-client';
import { StyleSheet, Text, TextInput, View, Button, ScrollView } from 'react-native';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      text: '',
    };

    this.onUserConnected = this.onUserConnected.bind(this);
    this.onChatMessage = this.onChatMessage.bind(this);
    this.onName = this.onName.bind(this);
    this.onUserDisconnected = this.onUserDisconnected.bind(this);
    this.nextKey = 0;

    this.socket = SocketIOClient('http://localhost:3000');
    this.socket.on('user connected', this.onUserConnected);
    this.socket.on('chat message', this.onChatMessage);
    this.socket.on('name', this.onName);
    this.socket.on('user disconnected', this.onUserDisconnected);
  }

  onUserConnected(message) {
    var newMessage = {
      key: (this.nextKey++).toString(),
      name: 'System',
      message: message.name + ' connected'
    }
    this.setState(previousState => ({ messages: [...previousState.messages, newMessage] }));
  }

  onChatMessage(message) {
    var newMessage = {
      key: (this.nextKey++).toString(),
      name: message.name,
      message: message.message
    }
    this.setState(previousState => ({ messages: [...previousState.messages, newMessage] }));
  }

  onName(message) {
    var newMessage = {
      key: (this.nextKey++).toString(),
      name: 'System',
      message: message.oldName + ' became ' + message.newName
    }
    this.setState(previousState => ({ messages: [...previousState.messages, newMessage] }));
  }

  onUserDisconnected(message) {
    var newMessage = {
      key: (this.nextKey++).toString(),
      name: 'System',
      message: message.name + ' disconnected'
    }
    this.setState(previousState => ({ messages: [...previousState.messages, newMessage] }));
  }

  onPressSubmit = () => {
    var message = this.state.text;

    if(message.startsWith('name=')) {
      var name = message.slice(message.indexOf('=') + 1);
      this.socket.emit('name', name);
      this.setState({text: ""});
      return;
    }

    this.socket.emit('chat message', message);
    this.setState({text: ""});
    return;
  };

  handleText = (text) => {
    this.setState({text: text});
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.messages} contentContainerStyle={styles.messagesContent}>
          {
            this.state.messages.map((message) => (
              <Text key={message.key}><Text style={{ fontWeight: 'bold' }}>{message.name}</Text>: {message.message}</Text>
            ))
          }
        </ScrollView>
        <View style={styles.input}>
          <TextInput onChangeText={this.handleText} value={this.state.text} style={styles.textInput}/>
          <Button title="Submit" onPress={this.onPressSubmit} style={styles.submitButton}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messages: {
    flex: 1,
    height: 600,
  },
  messagesContent: {
    flex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: '#000',
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 30,
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1
  },
  submitButton: {
    flex: 1
  }
});

import React from 'react';
import SocketIOClient from 'socket.io-client';
import { StyleSheet, Text, TextInput, View, Button, KeyboardAvoidingView, FlatList } from 'react-native';

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

    this.socket = SocketIOClient('http://172.20.10.2:3000');
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
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
        <FlatList data={this.state.messages} renderItem={({item}) => <Text style={styles.messageItem}><Text style={{fontWeight: 'bold'}}>{item.name}</Text>: {item.message}</Text>} style={styles.messages}/>
        <View style={styles.input}>
          <TextInput onChangeText={this.handleText} value={this.state.text} style={styles.textInput}/>
          <Button title="Submit" onPress={this.onPressSubmit} style={styles.submitButton}/>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 50,
    backgroundColor: '#fff',
  },
  messages: {
    paddingHorizontal: 25,
  },
  input: {
    backgroundColor: '#000',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 9,
    height: 40,
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1
  },
  submitButton: {
    flex: 1
  }
});

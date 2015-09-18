'use strict';

var React = require('react-native');
var {
    ActivityIndicatorIOS, Text, TouchableHighlight, StyleSheet, TextInput, View,
} = React;

var DictionaryInput = React.createClass({
  getInitialState : function() { return {text : ''}; },
  onSubmit : function() {
    var word = this.state.text.trim();
    if (word) {
      this.props.cb(word);
    }
  },
  render : function() {
      var button = (
          <TouchableHighlight
              style = { styles.button }
              underlayColor =
              "#eee"
              onPress = {this.onSubmit}>
              <Text style = {styles.buttonText}>
                  Define
              </ Text>
          </TouchableHighlight>
      );
      if (this.props.loading) {
        button = (
          <ActivityIndicatorIOS
            animating = { true }
            style = { styles.button }
            size = "small" />
        );
      }
      return (
          <View style = {styles.container}>
              <TextInput
                  ref = "field"
                  style = { styles.input }
                  clearButtonMode = 'always'
                  returnKeyType = 'go'
                  enablesReturnKeyAutomatically = { true }
                  onChangeText = { (text) => { this.setState({text : text}); } }
                  onSubmitEditing = { (event) => { this.onSubmit(); } } />
              {button}
          </View>
      );
  },
});

var styles = StyleSheet.create({
  container : {
    marginTop : 24,
    flex : 1,
    flexDirection : 'row',
  },
  input : {
    height : 40,
    paddingLeft : 20,
    borderColor : 'gray',
    borderWidth : 1,
    borderRadius : 20,
    flex : 80,
  },
  button : {
    height : 40,
    justifyContent : 'center',
    alignItems : 'center',
    flex : 20,
    borderRadius : 20,
    marginLeft : 12,
  },
  buttonText : {fontSize : 16}
});

module.exports = DictionaryInput;

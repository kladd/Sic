/**
* WordsAPI api key here.
*/
var API_KEY = '';

var React = require('react-native');
var ScrollView = React.ScrollView;
var View = React.View;
var Text = React.Text;
var StyleSheet = React.StyleSheet;

var cache = {};
var mock = require('./mock');
var DictionaryInput = require('./DictionaryInput');

var Dictionary = React.createClass({
  getInitialState : function() {
    return {
      def : mock,
      loading : false,
      error : null,
    };
  },
  onWord : function(word) {
    this.setState({
      loading : true,
      error : null,
    });
    fetch(
        'https://wordsapiv1.p.mashape.com/words/' + word,
        {
          method : 'GET',
          headers : {'X-Mashape-Key' : API_KEY, 'Accept' : 'application/json'}
        })
        .then(function(response) {
          if (response.status == 200) {
            return response.json();
          }

          throw response;
        })
        .then(function(body) {
          this.setState({def : body, loading : false})
        }.bind(this))
        .catch(function(error) {
          this.setState({loading : false, error : error.status});
        }.bind(this));
  },
  render : function() {
    var definition = [];

    if (!this.state.error) {
      definition = this.getDefinition();
    } else {
      var message = 'Unknown error';
      switch (this.state.error) {
      case 404:
        message = "Can't find that word!";
        break;
      case 429:
        message = "Too many words.";
        break;
      case 500:
        message = "The sky is falling.";
        break;
      }
      definition = (
        <View style = {styles.error}>
          <Text>{message}</ Text>
        </View>
      );
    }

    return (
      <ScrollView style = {styles.container}>
        <DictionaryInput
          loading = { this.state.loading }
          cb = { this.onWord } />
        {definition}
      </ScrollView>
    );
  },
  getDefinition : function() {
    var definition = [];

    definition.push(
      <View style = {styles.one}>
        <Text style = {styles.word}>
          { this.state.def.word}
        </ Text>
        <Text style = {styles.pronunciation}>| {this.state.def.pronunciation.all} | </ Text>
      </View>
    );

    var parts = [];
    this.state.def.results.forEach(function(result) {
      if (!parts[result.partOfSpeech]) {
        parts[result.partOfSpeech] = [];
      }
      parts[result.partOfSpeech].push(result);
    });

    Object.keys(parts).forEach(function(part) {
      var indexStyle = styles.definitionIndex;
      if (parts[part].length < 2) {
        indexStyle = styles.hidden;
      }

      var idx = 0;
      var partDefs = [];
      parts[part].forEach(function(result) {
        idx++;
        partDefs.push(
          <View style = {styles.definition}>
            <Text style = {styles.definitionText}>
              {result.definition}
            </ Text>
          </View>
        );
      });
      definition.push(
        <View style = {{marginBottom : 24}}>
          <Text style = {styles.partOfSpeech}>
            {part}
          </ Text>
          {partDefs}
        </ View>
      );
    });

    return definition;
  }
});

var styles = StyleSheet.create({
  container : {padding : 20},
  one : {
    flex : 1,
    flexDirection : 'row',
    marginTop : 24,
  },
  word : {
    fontSize : 24,
    marginRight : 12,
  },
  pronunciation : {
    fontSize : 18,
    color : '#66667D',
    lineHeight : 24,
  },
  partOfSpeech : {fontSize : 18},
  definitionText : {
    paddingLeft : 24,
  },
  definition : {
    marginTop : 16,
    borderLeftWidth : 5,
    borderColor : '#eee',
  },
  hidden : {
    opacity : 0,
  },
  error : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
    marginTop : 24,
  },
});

module.exports = Dictionary;

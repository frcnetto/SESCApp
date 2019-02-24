import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated
} from 'react-native';

export default class App extends Component {
  state = {
    saldo: 0,
    matricula: '00115811582',
    action: 'Consultar'
  };

  componentWillMount() {
    this.animatedValue = new Animated.Value(0);
    this.value = 0;
    this.animatedValue.addListener(({ value }) => {
      this.value = value;
    });
    this.frontInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg']
    });
    this.backInterpolate = this.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg']
    });
  }

  flipCard = () => {
    if (this.value <= 90) 
      this.loadBalance();
    else 
      this.returnToFront();
  };

  returnToFront = () => {
    this.setState({
      action: 'Consultar'
    });
    Animated.timing(this.animatedValue, {
      toValue: 0,
      duration: 800
    }).start();
  };

  loadBalance = () => {
    var details = {
      matricula: this.state.matricula
    };

    var formBody = [];

    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('http://sistemaswe.sesc-ce.com.br/consultasaldo/consultarsaldo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    })
      .then(response => {
        Animated.timing(this.animatedValue, {
          toValue: 180,
          duration: 800
        }).start();
        this.setState({
          saldo: response._bodyText.match(/R\$ 44,67/i),
          action: 'Voltar'
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    const frontAnimatedStyle = {
      transform: [
        {
          rotateY: this.frontInterpolate
        }
      ]
    };
    const backAnimatedStyle = {
      transform: [
        {
          rotateY: this.backInterpolate
        }
      ]
    };
    return (
      <View style={styles.container}>
        <Animated.View
          style={[backAnimatedStyle, styles.card, styles.cardBack]}>
          <View style={styles.saldo}>
            <Text style={styles.cardImputLabel}>Saldo</Text>
            <Text style={styles.saldoValue}>{this.state.saldo}</Text>
          </View>
        </Animated.View>
        <Animated.View style={[styles.card, frontAnimatedStyle]}>
          <View style={styles.cardImput}>
            <Text style={styles.cardImputLabel}>Número do Cartão</Text>
            <TextInput
              style={styles.cardImputNumber}
              maxLength={11}
              keyboardType={'numeric'}
              onChangeText={matricula => this.setState({ matricula })}
              value={this.state.matricula}
            />
          </View>
        </Animated.View>
          <TouchableOpacity style={styles.action} onPress={this.flipCard}>
            <Text>{this.state.action} </Text>
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  card: {
    width: 350,
    height: 550,
    justifyContent: 'center',
    borderRadius: 8,
    padding: 20,
    backgroundColor: '#AAA',
    backfaceVisibility: 'hidden',
  },
  cardImputLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10
  },
  cardImputNumber: {
    fontSize: 20,
    backgroundColor: '#FFF',
    padding: 10
  },
  cardImput: {
    paddingBottom: 10
  },
  cardBack: {
    position: 'absolute',
    backgroundColor: '#DDD'
  },
  saldo: {
    alignItems: 'center'
  },
  saldoValue: {
    fontSize: 60,
    padding: 10
  },
  action: {
    width: 150,
    height: 50,
    margin: 10,
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'blue'
  }
});

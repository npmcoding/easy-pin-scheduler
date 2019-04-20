import React, { Component } from 'react';
import Home from './Main/Home';
import AuthService from './AuthService/AuthService';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      isAuthenticated: false
    };

    this.successfulAuth = this.successfulAuth.bind(this);
  }

componentDidMount() {
  //check local storage for user data
  const currentUser = localStorage.getItem('EPS_User');

  if(currentUser) {
    this.setState({
      user:currentUser,
      isAuthenticated: true
    })
  }
}

  successfulAuth(user) {
    // write user data to local storage, then set state
    this.setState({
      user,
      isAuthenticated: true,
    })
  }

  render() {
    // maybe check cookies here? If cookies exist, populate user. 
    // maybe this should be in the mounting phase
    if (this.state.isAuthenticated) {
      return (
        <Home user={this.state.user} />
      );
    }
    else {
      return (
        <AuthService successfulAuth={this.successfulAuth} />
      )
    }
  }
}

export default App;

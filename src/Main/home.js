import React, { Component } from 'react';

class Home extends Component {
/*   constructor(props) {
  super(props);
} */

  render() {
    return (
      <div className="Home">
        <p>{this.props.data}</p>
      </div>
    );
  }
}

export default Home;
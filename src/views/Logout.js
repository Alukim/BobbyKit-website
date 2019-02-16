import React from 'react';

let interval = null;

class Login extends React.Component {
  componentDidMount() {
    fetch(`${BASE_API_URL}/accounts/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    }).then(() => localStorage.removeItem('token'))
    .then(() => {
      interval = setInterval(() => {
        this.setState({time: --this.state.time});
      }, 1000);
      setTimeout(() => {
        location.replace('/');
        clearInterval(interval);
      }, 2000)
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      time: 2
    };
  }

  render() {
    return (
      <div style={{padding: '14px'}}>
        Zostałeś wylogowany, przekierowanie na stronę główną za {this.state.time > 0 ? this.state.time : 0}s.
      </div>
    );
  }
}

export default Login;

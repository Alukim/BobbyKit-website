import React from 'react';
import Cookies from 'react-cookies'
import axios from 'axios'
import { Segment, Button,Form, Checkbox, Image, Header, Divider, Input, Message, Icon } from 'semantic-ui-react';
import '../styles/Login.scss';

const bgColors = {
  Blue: '#0079DB',
  Yellow: '#FFC100',
  Red: '#E9573F'
};
const url = `${BASE_API_URL}/accounts`;

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmationPassword: '',
        visible: false,
        error: false,
        errorList: []
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange (e, { name, value }) { this.setState({[name]: value}); }

  handleError(response) {
    let errors = new Array();

    errors.push(response.message)

    this.setState({errorList: errors});
  }

  handleSubmit(e) {
    e.preventDefault()
    this.setState({visible: false})
    let options = {
      details: {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email
      },
      password: this.state.password,
      confirmPassword: this.state.confirmationPassword
    }
    axios({
      url: `${url}/register`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache': 'no-cache'
      },
      data: options
    })
      .then(response => {
        this.setState({visible: true, error: false})
        localStorage.setItem('token', response.data.access_token);
        setTimeout(() => {
          window.location.replace('/');}, 1000);
      })
      .catch(error => {
        this.handleError(error.response.data);
        this.setState({visible: true, error: true})
      });
  }

  render() {
        let MessageBox = null;
        if(this.state.visible)
        {
            if(this.state.error === false)
                MessageBox = <Message positive header="Rejestracja zakończona pomyślnie" content="Za chwilę zostaniesz przeniesiony do strony głównej." />
            else
                MessageBox = <Message negative header="Wykryto problem" list={this.state.errorList} />
        }
    return (
      <div>
        <div style={{textAlign: 'center', marginTop: '15%'}} >
          <Image as = 'a' href = '/' src="/images/builder1.svg" style={{width: '80px', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.35))', display: 'inline-block'}}/>
          <Header as="h1" 
            style={{margin: '0', marginLeft: '14px', color: '#fff', fontSize: '3rem', display: 'inline-block', verticalAlign: 'middle'}}
          >
            Zarejestruj się
          </Header>
        </div>
        <Segment>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <Form.Field name = "firstName" control={Input} label="Imię*" onChange={this.onChange} placeholder="Imię"/>
            <Form.Field name = "lastName" control={Input} label="Nazwisko*" onChange={this.onChange} placeholder="Nazwisko" />
            <Form.Field name = "email" control={Input} label="E-mail*" onChange={this.onChange} placeholder="E-mail"/>
            <Form.Field name = "password" control={Input} label="Hasło*" onChange={this.onChange} placeholder="Hasło" type='password'/>
            <Form.Field name = "confirmationPassword" control={Input} label="Potwierdź hasło*" onChange={this.onChange} placeholder="Potwierdź hasło" type='password'/>
            <Button fluid style={{background: bgColors.Yellow, color: '#fff'}} loading={this.state.loginLoading} type='submit'>Zarejestruj się</Button>
          </Form>
          <Message>
          <Icon name='help' />
            Masz już konto ?&nbsp;<a href='login'>Zaloguj się</a>&nbsp;.
          </Message>
          {MessageBox}
        </Segment>
      </div>
    );
  }
}

export default Register;

import React from 'react';
import { Container, Sidebar, Menu, Segment, Icon, Header,Dimmer, Button } from 'semantic-ui-react';
import ToolsList from '../components/ToolsList';
import Navbar from '../components/Navbar';
import axios from 'axios'

import '../styles/Home.scss';

const url = `${BASE_API_URL}/offer/user`

function getGETStringFormObject(obj) {
  return Object.keys(obj).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
}
let timeout = null;
class UserOffers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false,
      tools: [],
      search: '',
      lastSearch: false
    };
    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  toggleSidebar() {
    this.setState({sidebarOpen: !this.state.sidebarOpen})
  }

  componentWillMount() {
    axios({
      url: url,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache': 'no-cache',
        'Authorization': `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(response => {
        this.setState({ tools: response.data });  
      })
      .catch(error => {
        location.replace('/login');
      });
  }
  render() {
    return (
      <div>
        <Navbar onSearchChange={this.onSearchChange} fixed="top" view="home" toggleSidebar={this.toggleSidebar} sidebarOpen={this.state.sidebarOpen}/>        
        <Sidebar.Pushable as={Segment} style={{height: '100vh', background: '#eee'}}>
          <Sidebar as={Menu} animation='overlay' width='thin' visible={this.state.sidebarOpen} icon='labeled' style={{paddingTop: '32px'}} vertical>
            <Menu.Item name='add' href={localStorage.getItem('token') === null ? '/login' : '/add'}>
              <Icon name='add square' />
              Dodaj ofertę
            </Menu.Item>
            <Menu.Item name='star'>
              <Icon name='star' />
              Obserwowane
            </Menu.Item>
            <Menu.Item name='user-offers' href={localStorage.getItem('token') === null ? '/login' : '/user'}>
              <Icon name='browser' />
              Twoje oferty
            </Menu.Item>
            <div style={{width: '100%', position: 'absolute', bottom: '70px'}}>
            {
              localStorage.getItem('token') !== null
                ? <Button label="Wyloguj się" onClick={() => location.replace('/logout')} href="/logout" icon="sign out"/>
                : <Button label="Zaloguj się" onClick={() => location.replace('/login')} href="/login" icon="sign in"/>
            }
            </div>
            <div style={{width: '100%', position: 'absolute', bottom: '21px'}}>
            {
              <Button label="Rejestracja" onClick={() => location.replace('/register')} href="/register" icon="add user"/>
            }
            </div>
          </Sidebar>
          <Sidebar.Pusher style={{maxHeight: '100vh', overflowY: 'auto'}}>
            <Segment basic style={{padding: '7px 0'}}>
              <Dimmer style={{height: '110%', minHeight: '100vh'}} active={this.state.sidebarOpen} onClickOutside={this.toggleSidebar} />
              <Container style={{paddingTop: '34px'}}>
                <ToolsList tools={this.state.tools} update = {true}/>
              </Container>  
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>             
      </div>
    );
  }
}

UserOffers.defaultProps = {
};

export default UserOffers;

import React from 'react';
import { Menu, Input, Icon, Popup, Label, Image } from 'semantic-ui-react';
import SortOptions from '../components/SortOptions';

import '../styles/Navbar.scss';

let blue = '#0079DB';
let yellow = '#FFC100';

export default class Navbar extends React.Component {

  render() {
    const { view, fixed, title, toggleSidebar, sidebarOpen, onSearchChange } = this.props;
    let tool;
    let filters;
    filters = tool = (
      <Menu style={{background: yellow, borderRadius: '0', margin: 0}} fixed={fixed}  fluid borderless>
        <Menu.Item name='sidebar' onClick={() => history.back()}>
          <Icon name='arrow left'/>
        </Menu.Item>
        <Menu.Item>
          <b>{ title }</b>
        </Menu.Item>
      </Menu>
    )
    switch (view) {
      case "home": {
        return (
          <Menu style={{background: yellow, borderRadius: '0'}} fixed={fixed} fluid borderless>
            <Menu.Item name='sidebar' onClick={toggleSidebar}>
              <Icon name={sidebarOpen ? 'close' : 'content'}/>
            </Menu.Item>
            <Menu.Item name='logo' href="/">
              <Image src="/images/builder1.svg" style={{width: '25px', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.35))', display: 'inline-block'}}/>
            </Menu.Item>
            <Menu.Menu>
              <Menu.Item>
                <Input className="searchbar" icon='search' onChange={onSearchChange} placeholder='Szukaj...' />
              </Menu.Item>
            </Menu.Menu>
            <Menu.Menu position="right">
              {/* <Menu.Item name='sort'>
                <Popup
                  trigger={<Icon name='sort content ascending'/>}
                  content={<SortOptions/>}
                  position="bottom center"
                />
                
              </Menu.Item> */}
              <Menu.Item name='filter' href="/filters">
                <Icon name='filter'/>
              </Menu.Item>
            </Menu.Menu>          
          </Menu>       
        );
      }
      case "add": {
        return (
          <Menu style={{background: yellow, borderRadius: '0'}} fixed={fixed}  fluid borderless>
            <Menu.Item name='sidebar' onClick={() => location.replace('/')}>
              <Icon name='arrow left'/>
            </Menu.Item>
            <Menu.Item>
              <b>Dodaj ofertę</b>
            </Menu.Item>
          </Menu>       
        );
      }
      case "tool": {
        return tool;
      }
      case "filters": {
        return filters;
      }
    }
    
  }
}
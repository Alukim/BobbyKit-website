import React from 'react';
import { Step, Icon, Button, Image } from 'semantic-ui-react';

class Tutorial extends React.Component {
  componentDidMount() {
    
  }

  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);
  }

  nextPage() {
    this.setState({page: ++this.state.page});
  }

  prevPage() {
    this.setState({page: --this.state.page});
  }

  render() {
    switch(this.state.page) {
      case 1: {
        return (
          <div style={{
            background: 'url("/images/page-1.png")',
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#1674BD',
            height: '100vh'
          }}>
            <div style={{textAlign: 'center', fontSize: '1.25rem', width:'100%', padding: '28px', color: '#fff', position: 'absolute', bottom: '28px'}}>
              <img style={{width: '80px', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,.35))'}} src="/images/builder1.png" />
              <h2 style={{textAlign: 'center'}}>Bobby wita!</h2>
              <p>Jeden remont, mnóstwo narzędzi? A może szukasz frezarki, lecz nie chcesz wydawać mnóstwa pieniędzy?</p><br/>
              <Button style={{marginTop: '30px'}} content='Dalej' icon='right arrow' labelPosition='right' onClick={this.nextPage}/>
            </div>
          </div>
        );
      }
      case 2: {
        return (
          <div style={{ height: '100vh', background: '#d6a811'}}>
            <img src="/images/agreement.svg" style={{width: '80%', display: 'block', paddingTop: '28px', margin:'0 auto'}}/>
            <div style={{textAlign: 'center', fontSize: '1.25rem', width:'100%',padding: '28px', color: '#fff', position: 'absolute', bottom: '28px'}}>
              <h2 style={{textAlign: 'center', textShadow:'0px 0px 2px rgba(0,0,0,0.4)'}}>Narzędzia na każdą kieszeń</h2>
              <p style={{textAlign: 'center', textShadow:'0px 0px 2px rgba(0,0,0,0.4)'}}>
                BobbyKit to aplikacja umożliwiająca wynajem lub dzierżawę kurzących się w piwnicy narzędzi, w bardzo przystępnej cenie.<br/>
                To użytkownicy tworzą rynek, tym samym pozwalając nieużywanym narzędziom zarabiać na siebie.
              </p>
              <Button style={{marginTop: '40px'}} content='Wstecz' icon='left arrow' labelPosition='left' onClick={this.prevPage}/>              
              <Button content='Dalej' icon='right arrow' labelPosition='right' onClick={this.nextPage}/>
            </div>
          </div>
        );
      }
      case 3: {
        return (
          <div style={{
            backgroundColor: '#e8563f',
            height: '100vh'
          }}>
            <div style={{textAlign: 'center', fontSize: '1.25rem', width:'100%', padding: '28px', color: '#fff', position: 'absolute', bottom: '28px'}}>
              <img src="/images/map.svg" style={{width: '80%', display: 'block', paddingTop: '28px', margin:'0 auto', marginBottom: '100px'}}/>
              <h2 style={{textAlign: 'center', textShadow:'0px 0px 2px rgba(0,0,0,0.4)'}}>Zarejestruj się już dziś!</h2>              
              <p style={{textAlign: 'center', textShadow:'0px 0px 2px rgba(0,0,0,0.4)'}}>
                Potrzebujesz wiertarkę, a może chesz wynająć betoniarkę? Sprawdź z Bobbiem jakie oferty znajdziesz w swojej okolicy!
              </p>
              <Button style={{marginTop: '60px'}} content='Wstecz' icon='left arrow' labelPosition='left' onClick={this.prevPage}/>                
              <Button content='Zaczynamy!' icon='thumbs up' labelPosition='right' 
                onClick={()=>{
                  localStorage.setItem('tutorialRead', true);
                  location.replace('/')
                }}
              />              
            </div>
          </div>
        );
      }
    }
  }
}

export default Tutorial;

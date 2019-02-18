import React from 'react';
import { Image } from 'semantic-ui-react';
import { Container, Header, Input, Icon, Grid, Label, Segment, Rating, Button, Modal, Link } from 'semantic-ui-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"

let headerStyles = {
  color: 'white',
  textShadow: '0px 4px 3px rgba(0,0,0,0.4), 0px 8px 13px rgba(0,0,0,0.1), 0px 18px 23px rgba(0,0,0,0.1)'
}
let blue = '#0079DB';
let yellow = '#FFC100';

let url = `${BASE_API_URL}`;

class Tool extends React.Component {

  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      toolId: this.props.match.params.id,
      map: null,
      category: '',
      name: '',
      pricePerDay: '--',
      bail: '---',
      description: 'Loading...',
      parameters: [],
      imageId: null,
      availability: null,
      availabilityOn: 0,
      range: null,
      addReservationIsLoading: false,
      visible: false,
      modelHeader: '',
      errorList: [],
      error: false,
      statusError: null,
      firstName: null,
      lastName: null,
      userImageId: null,
      email: null
    };
    this.onChange = this.onChange.bind(this);
    this.datePickHandler = this.datePickHandler.bind(this);
    this.reservationHandler = this.reservationHandler.bind(this);
    this.closeHandler = this.closeHandler.bind(this)
  }

  onChange (e, { name, value }) { this.setState({ [name]: value }); }

  handleError(response, status) {
    let errors = new Array();

    errors.push(response.message)

    this.setState({errorList: errors, statusError: status});
  }

  componentDidMount() {
    var center = {lat: 50.6847882, lng: 17.8707963};
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
					center.lat = position.coords.latitude;
					center.lng = position.coords.longitude;
				});
    } 
		this.initMap(center);
  }

  componentWillMount() {
    console.log(this.state.toolId);
    axios({
      url: `${url}/offer/${this.state.toolId}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Cache': 'no-cache'
      }
    })
    .then(response => {
      console.log(response.data)
      this.setState({
        name: response.data.name,
        pricePerDay: response.data.pricePerDay,
        bail: response.data.bail,
        description: response.data.description,
        parameters: response.data.parameters,
        imageId: response.data.imageId,
        availability: response.data.availability,
        availabilityOn: response.data.availabilityOn,
        isMarkerShow: true,
        lat: response.data.latitude,
        lng: response.data.longitude,
        firstName: response.data.user.firstName,
        lastName: response.data.user.lastName,
        userImageId: response.data.user.imageId,
        email: response.data.user.email
      })
      this.initMap({lat: response.data.latitude, lng: response.data.longitude})
    })
    .catch(error => {
      console.log(error.response)
      this.handleError(error.response.data, error.response.status);
      this.setState({visible: true, error: true})
    });
  }

  initMap(center) {
		this.setState({map: new google.maps.Map(document.getElementById('map'), {
			zoom: 11,
			styles: [{"featureType":"landscape","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":19.68627450980391},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC100"},{"saturation":0.4149377593360697},{"lightness":-33.10980392156863},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FFC200"},{"saturation":4.263256414560601e-14},{"lightness":-14.682352941176461},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":0.2352941176470722},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#00AEFF"},{"saturation":95.14170040485831},{"lightness":-51.13725490196078},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00AFFF"},{"saturation":82.60869565217394},{"lightness":-20.156862745098053},{"gamma":1}]}],
			center
		})});

		var marker = new google.maps.Marker({
			position: center,
			map: this.state.map
		});
	}
  datePickHandler(range) {
    this.setState({range});
  }
  reservationHandler() {
    console.log('Rezerwacja!');
    console.log(this.state.range);
    this.setState({addReservationIsLoading: true});
    let body = {
      bookedFor: this.state.range
    };
    console.log(body);
    axios({
      url: `${url}/offer/${this.state.toolId}/bookTool`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      data: body
    })
    .then(response => {
      console.log(response.data)
      this.setState({addReservationIsLoading: false});
      this.setState({visible: true, modelHeader: 'Zarezerwowane narzędzie!!!', error: false})
    })
    .catch(error => {
      console.log(error.response)
      this.handleError(error.response.data, error.response.status);
      this.setState({addReservationIsLoading: false});
      this.setState({visible: true, modelHeader: 'Występił błąd w czasie rezerwacji!', error: true});
    });
  }

  closeHandler() { 
    console.log('Rezerwacja!');
    console.log(this.state.range);
    console.log(this.state.statusError)
    this.setState({visible: false, errorList: null});
    if(this.state.statusError === 404) {
      this.setState({statusError: null});
      location.replace('/')
    } else if(this.state.statusError === 401) {
      this.setState({statusError: null});
      location.replace('/login')
    } else {
      this.setState({statusError: null});
    }
  }

  render() {
    let ReservationBox = null;
    if(this.state.availability != null && this.state.availability.isBooked == true)
      ReservationBox = <Input type='text' placeholder='Zarezerwowane!' disabled/>
    else
      ReservationBox = <Input name="range" value={this.state.range} type='text' placeholder='Na ile dni wypożyczas ?' onChange={this.onChange} />

    let ButtonBox = null;
    if(this.state.error === false)
      ButtonBox = <Button onClick={this.closeHandler} negative> Ok </Button>
    else
      ButtonBox = <Button onClick={this.closeHandler} positive> Ok </Button>
  

    let labels = this.state.parameters.map((parameter, i) =>
      <Label key={i} size="large" style={{ background: 'white', fontSize: '1.1rem', boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.3)' }}>
        <span style={{ fontWeight: 'normal' }}>{parameter.key}: </span>{parameter.value}
      </Label>
    );
    let imageSrc = this.state.imageId === null ? '/images/tools.jpg' : `${url}/image/${this.state.imageId}`;
    let userImageSrc = this.state.userImageId === null ? '/images/user.svg' : `${url}/image/${this.state.userImageId}`
    let mailHref = `mailto:${this.state.email}?subject=Oferta ${this.state.name} na BobbyKit;body=Co chcesz napisać do użytkownika` 
    return (
      <div>
      <Modal
        open={this.state.visible}
        closeOnEscape={true}
        closeOnDimmerClick={false}
        onClose={this.closeHandler}
      >
        <Modal.Header>{this.state.modelHeader}</Modal.Header>
        <Modal.Content>
          {this.state.errorList}
        </Modal.Content>
        <Modal.Actions>
          {ButtonBox}
        </Modal.Actions>
      </Modal>

      <div style={{ fontSize: '1.2rem' }}>
        <Navbar view="tool" title={this.state.name} />
        <div>
            <Image src={imageSrc} width='100%' />
        </div>
        <div>
          <Segment style={{ borderLeft: 0, borderRight: 0, borderRadius: 0 }}>
            <Container>
              <Grid columns={3}>
                  <Grid.Row>
                    <Grid.Column>
                      <p style={{ marginBottom: '0px', fontSize: '1.7rem', fontWeight: 'bold' }}>
                        {this.state.pricePerDay}zł / dzień
                      </p>
                      <p style={{ marginBottom: '0px', fontSize: '1.0rem', fontWeight: 'normal' }}>
                        {this.state.bail}zł kaucji
                      </p>
                    </Grid.Column>
                    <Grid.Column>
                    <p style={{ marginBottom: '0px', fontSize: '1.7rem', fontWeight: 'bold' }}>
                        Możliwa rejestracja na {this.state.availabilityOn} dni
                      </p>
                    </Grid.Column>
                    <Grid.Column style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                      <Icon name="empty star" size="big" />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Container>
            </Segment>
            <Container>
              <div style={{ fontSize: '3rem' }}>
                { labels }
              </div>
            </Container>
          <Segment style={{ borderLeft: 0, borderRight: 0, borderRadius: 0, marginBottom: 0 }}>
            <Container>
              <p style={{ fontSize: '1.2rem' }}>
                { this.state.description }
              </p>
            </Container>
          </Segment>
          <div id="map" style={{  height: '200px'}}></div>
          <Segment style={{ marginTop: 0, marginBottom: '0px' }}>
            <Container>
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', textAlign: 'center'}}>
                  <div><Image style={{ height: '60px', marginRight: '10px' }} src={userImageSrc}/></div>
                  <div style={{ height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{this.state.firstName} {this.state.lastName}</span>
                    </div>
                    <div><Rating defaultRating={3} maxRating={5} disabled /></div>
                    <div><a href={mailHref}>Kontakt</a></div>
                  </div>
              </div>
            </Container>
          </Segment>
          
          <Container style={{ textAlign: 'center', marginTop: '20px', marginBottom: '10px' }}>
            <Header>Rezerwacja narzędzia</Header>
          </Container >
          <Container style={{ textAlign: 'center', marginTop: '20px', marginBottom: '10px' }}>
            {ReservationBox}
          </Container>
          <Segment style={{ textAlign: 'center' }}>
            <Container>
              <Button onClick={this.reservationHandler} loading={this.state.addReservationIsLoading} disabled={this.state.availability != null && this.state.availability.isBooked == true} size="large" style={{background: yellow, color: 'white'}}>Rezerwuj</Button>
            </Container>
          </Segment>
        </div>
      </div>
      </div>
    );
  }

}

Tool.defaultProps = {
};

export default Tool;

import React from 'react';
import places from 'places.js';
import { 
  Container, Grid, Form, Icon, Button, Header, Divider, Input, 
  Segment, Select, TextArea, Modal, Label, Popup
} from 'semantic-ui-react';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/OfferForm.scss';
import axios from 'axios';

const blue = '#0079DB';
const yellow = '#FFC100';

const url = `${BASE_API_URL}`;

export default class OfferForm extends React.Component {

  componentWillMount() {
    fetch(`${url}/toolCategory`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ 
          categories: data.categories.map((cat,i) => ({
            key: i,
            value: i,
            text: cat
          }))
        });    
      });

    this.state.parameterTypes = [{
      key:'0',
      value:'0',
      text:'Moc'
    },{
      key:'1',
      value:'1',
      text:'Waga'
    },{
      key:'2',
      value:'2',
      text:'Nacisk'
    },{
      key:'3',
      value:'3',
      text:'Data produkcji'
    },{
      key:'4',
      value:'4',
      text:'Pojemność'
    }];
  }

  handleError(response, status) {
    let errors = new Array();

    errors.push(response.message)

    this.setState({errorList: errors, statusError: status});
  }

  componentDidMount() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          let center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.state.center = center;
		      this.initMap(center);
				});
    } 

    let placesAutocomplete = places({
      container: document.querySelector('#address-input')
    });
    placesAutocomplete.on('change', (event) => {
      this.setState({city: event.suggestion.name});
      this.setState({center: event.suggestion.latlng});
      this.initMap(event.suggestion.latlng);
    });
  }

  initMap(center) {
		this.setState({map: new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			styles: [{"featureType":"landscape","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":19.68627450980391},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#FFC100"},{"saturation":0.4149377593360697},{"lightness":-33.10980392156863},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#FFC200"},{"saturation":4.263256414560601e-14},{"lightness":-14.682352941176461},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FF0300"},{"saturation":-100},{"lightness":0.2352941176470722},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#00AEFF"},{"saturation":95.14170040485831},{"lightness":-51.13725490196078},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#00AFFF"},{"saturation":82.60869565217394},{"lightness":-20.156862745098053},{"gamma":1}]}],
			center
		})});

		var marker = new google.maps.Marker({
			position: center,
			map: this.state.map
		});
	}

  constructor(props) {
    super(props);

    this.reader  = new FileReader();
    this.reader.addEventListener("load", () => {
      this.setState({image: this.reader.result});
    }, false);

    this.state = {
      categories : [],
      parameters: [],
      parameterTypes: [],
      image: '',
      name: '',
      category: '',
      bail: 0,
      description: '',
      pricePerDay: 0,
      parameterType: '',
      parameterValue: '',
      map: null,
      center: {lat: 50.6847882, lng: 17.8707963},
      range: {from: null, to: null},
      city: 'Gliwice',
      time: 2,
      availabilityOn: 0,
      visible: false,
      modelHeader: '',
      errorList: [],
      error: false,
      statusError: null,
      offerId: null,
    };   

    this.onChange = this.onChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addParameter = this.addParameter.bind(this);
    this.removeParameter = this.removeParameter.bind(this);
    this.closeHandler = this.closeHandler.bind(this);
  }

  onChange (e, { name, value }) { this.setState({ [name]: value }); }

  handleChange(event) {    
    this.reader.readAsDataURL(event.target.files[0]);
  }

  addParameter(event) {    
    let parameters = this.state.parameters;
    parameters.push({
      type: this.state.parameterType,
      value: this.state.parameterValue
    });
    this.setState({ parameters });
  }
  
  removeParameter(i) {    
    let parameters = this.state.parameters;
    parameters.splice(i, 1);
    this.setState({ parameters });
  }
  
  addressChange(e) {
    if(e.target.value === '') {
      this.setState({locationLatLng: null});
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    var formData = new FormData();
    var file = document.forms['offerForm']['tool-image'].files[0];
    var toolImageId;
    if(file != null) {
      formData.append('image', document.forms['offerForm']['tool-image'].files[0]);
      let respone = await fetch(`${url}/image`, {
        method: 'POST',
        body: formData
      });
      let json = await respone.json();
      toolImageId = json.message;
    };
    
    console.log(toolImageId)

    let offerBody = {
        offer: {
          imageId:      toolImageId,
          category:     this.state.category,
          name:         this.state.name,
          pricePerDay:  this.state.pricePerDay,
          bail:         this.state.bail,
          description:  this.state.description,
          parameters:   this.state.parameters.map((p, i) => ({ key: this.state.parameterTypes[i].text, value: p.value })),
          city:         this.state.city,
          longitude:    this.state.center.lng,
          latitude:     this.state.center.lat,
          availabilityOn: this.state.availabilityOn
        }
      };
      console.log(offerBody);
      axios({
        url: `${url}/offer`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: offerBody
      })
      .then(response => {
        console.log(response.data)
        this.setState({offerId: response.data.id});
        this.setState({visible: true, modelHeader: 'Dodano ofertę', error: true})
      })
      .catch(error => {
        this.handleError(error.response.data, error.response.status);
        this.setState({addReservationIsLoading: false});
        this.setState({visible: true, modelHeader: 'Występił błąd w czasie dodawania oferty!', error: false})
      });    
  }

  closeHandler() { 
    console.log('Offerta!');
    this.setState({visible: false, errorList: null});
    if(this.state.statusError === 200) {
      location.replace(`tool/${this.state.offerId}`)
      this.setState({statusError: null});
    } else if(this.state.statusError === 401) {
      location.replace(`/login`)      
      this.setState({statusError: null});
    } else {
      this.setState({statusError: null});
    }
  }

  render() {
    const { tool } = this.props;
    let inputBoxStyles = this.state.image 
      ? { background: `url(${this.state.image})`, backgroundSize: 'cover' }
      : { }
    
    let ButtonBox = null;
    if(this.state.error === false)
      ButtonBox = <Button onClick={this.closeHandler} negative> Ok </Button>
    else
      ButtonBox = <Button onClick={this.closeHandler} positive> Ok </Button>
      return(
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
        <Form name="offerForm" onSubmit={event => event.preventDefault()}>        
        <Header as="h3" textAlign="center">Opis narzędzia</Header>
        <Segment>
          <div className="description">
            <label className="img-upload">
              <div className="img-box" style={inputBoxStyles}>
                {!this.state.image && <Icon className="img-icon" name="photo" size="big" />}
              </div>
              <input name="tool-image" type="file" accept="image/*" style={{display: 'none'}} onChange={this.handleChange}/>
            </label>
            </div>
            <Form.Group>
              <Form.Field width={16} name="name" control={Input} label='Nazwa' onChange={this.onChange} placeholder='Nazwa narzędzia' style={{marginBottom: '14px'}}/>
              <Form.Field width={16} name="category" control={Select} label='Kategoria' onChange={this.onChange} options={this.state.categories} placeholder='Kategoria' style={{marginBottom: '14px'}}/>
            </Form.Group>
          <Form.Group>
            <Form.Field width={16} autoHeight name="description" onChange={this.onChange} control={TextArea} label='Krótki opis' placeholder='Krótki opis narzędzia' style={{marginBottom: '14px'}}/>
          </Form.Group>          
        </Segment>
        
        <Header as="h3" textAlign="center" style={{marginTop: '14px'}}>Parametry</Header>
        <Segment>
          <Form.Field width={16}>
            <Input name="parameterValue" value={this.state.parameterValue} type='text' placeholder='Wartość' onChange={this.onChange}>
              <Select name="parameterType" value={this.state.parameterType} style={{width: '120px'}} compact options={this.state.parameterTypes} onChange={this.onChange.bind(this)}/>
              <input />
              <Button 
                className="add-parameter-btn" type='submit' content='Dodaj' icon='plus' labelPosition='right' 
                onClick={this.addParameter}
              />
            </Input>  
            <div style={{ fontSize: '3rem' }}>
            {
              this.state.parameters.map((param, i) => (
                <Label key={`param-${i}`} size="large" style={{ background: blue, color: '#fff', marginTop: '14px', fontSize: '1.1rem', boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.3)' }}>
                  <span style={{ fontWeight: 'normal' }}>{this.state.parameterTypes[param.type].text}:</span>&nbsp;{param.value}
                  <Icon name='delete' onClick={e => this.removeParameter(i)}/>
                </Label>
              ))
            }
            </div>  
          </Form.Field>  
        </Segment>       

        <Header as="h3" textAlign="center" style={{marginTop: '14px'}}>Cena</Header>
        <Segment>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Form.Field style={{paddingRight: '7px'}} width={8}>
              <label>Kwota</label>
              <Form.Input labelPosition='right' name="pricePerDay" onChange={this.onChange} type='text' placeholder='Kwota'>
                <input />
                <Label>zł / dzień</Label>
              </Form.Input>
            </Form.Field>  
            <Form.Field style={{paddingLeft: '7px'}}width={8}>
              <Popup
                trigger={<label style={{display: 'inline-block'}}>Kaucja<Icon name='question circle' /></label>}
                content='Koszty do których pociągany jest wynajmujący w przypadku zniszczenia narzędzia.'
                position="top center"
              />
              <Form.Input labelPosition='right' type='text' placeholder='Kaucja' name="bail" onChange={this.onChange} >
                <input />
                <Label>zł</Label>
              </Form.Input>
            </Form.Field>
          </div>  
        </Segment>

        <Header as="h3" textAlign="center" style={{marginTop: '14px'}}>Dostępność</Header>
        <Segment>
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Form.Field style={{paddingRight: '7px'}} width={16}>
              <label>Na ile można wypożyczyć narzędzie</label>
              <Form.Input labelPosition='right' name="availabilityOn" onChange={this.onChange} type='text' placeholder='Dostępność'>
                <input />
                <Label>dni</Label>
              </Form.Input>
            </Form.Field>
          </div>  
        </Segment>

        <Header as="h3" textAlign="center" style={{marginTop: '14px'}}>Lokalizacja</Header>
        <Segment style={{marginBottom: '0'}}>
          <div className="field">
            <label>Adres</label>  
            <input id="address-input" type="search" onChange={this.addressChange} placeholder='Miasto, ulica...' style={{ width: '100%' }} size="large" />
          </div>            
        </Segment>     
        <div id="map" style={{  height: '400px'}}></div>      
        <div style={{textAlign: 'center', position: 'absolute', bottom: '21px', width: '100%'}}> 
          <Button onClick={this.handleSubmit} size="large" style={{background: yellow, boxShadow: '0 4px 20px rgba(0,0,0,.6)'}}>Dodaj ofertę</Button>  
        </div>
      </Form>
      </div>
      )}
  }
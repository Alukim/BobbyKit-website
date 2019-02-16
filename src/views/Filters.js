import React from 'react';
import { Container, Form, Input, Icon, Grid, Dropdown, Button } from 'semantic-ui-react';
import ToolsList from '../components/ToolsList';
import Navbar from '../components/Navbar';
import places from 'places.js';

let categories = [
  { value: 'wszystkie', text: 'Wszystkie' },
  { value: 'Wiertarki', text: 'Wiertarki' },
  { value: 'Młotek', text: `Młotek` },
  { value: 'Odkurzacze', text: 'Odkurzacze' },
];
let blue = '#0079DB';
let yellow = '#FFC100';

class Filters extends React.Component {

  constructor(props) {
    super(props)
    let filters = localStorage.filters ? JSON.parse(localStorage.filters) : {};
    let mappedFilters = {};
    if(filters.Category) {
      mappedFilters.category = filters.Category;
    }
    if(filters.MinimumPrice) {
      mappedFilters.rangeFrom = filters.MinimumPrice;
    }
    if(filters.MaximumPrice) {
      mappedFilters.rangeTo = filters.MaximumPrice;
    }
    console.log(mappedFilters);

    this.state = Object.assign({
      locationLatLng: null,
      category: 'wszystkie',
      rangeFrom: '',
      rangeTo: ''
    }, mappedFilters);

    this.addressChange = this.addressChange.bind(this);
    this.distanceChange = this.distanceChange.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
    this.rangeFromChange = this.rangeFromChange.bind(this);
    this.rangeToChange = this.rangeToChange.bind(this);
    this.searchOffers = this.searchOffers.bind(this);
  }

  componentDidMount() {
    let placesAutocomplete = places({
      container: document.querySelector('#address-input')
    });
    placesAutocomplete.on('change', (event) => {
      this.setState({locationLatLng: event.suggestion.latlng});
      console.log(event.suggestion);
    });
  }

  addressChange(e) {
    if(e.target.value === '') {
      this.setState({locationLatLng: null});
    }
  }
  distanceChange(e) {
    this.setState({distance: e.target.value});
  }
  categoryChange(e, data) {
    console.log(data.value);
    this.setState({category: data.value});
  }
  rangeFromChange(e) {
    this.setState({rangeFrom: e.target.value});
  }
  rangeToChange(e) {
    this.setState({rangeTo: e.target.value});
  }

  searchOffers(e) {
    e.preventDefault();
    let filters = {};
    if(this.state.category !== 'wszystkie') {
      filters.category = this.state.category;
    }
    if(this.state.rangeFrom !== '') {
      filters.minimumPrice = this.state.rangeFrom;
    }
    if(this.state.rangeTo !== '') {
      filters.maximumPrice = this.state.rangeTo;
    }
    console.log(filters);
    localStorage.setItem('filters', JSON.stringify(filters));
    this.props.history.push('/');
  }

  render() {

    const getStateIcon = (inUse) => inUse ?  <Icon name="checkmark" color="green" /> : <Icon name="radio" />;

    return (
      <div>
        <Navbar fixed="top" view="filters" title="Filtry" />
        <Container style={{paddingTop: '57px', fontSize: '1.3rem'}}>
          <Form widths="equal">


            <Grid>
              <Grid.Row style={{ paddingBottom: 0 }}>
                <Grid.Column width="1"></Grid.Column>
                <Grid.Column  width="14">
                  Lokalizacja:
                </Grid.Column>
              </Grid.Row>
              <Grid.Row style={{ paddingTop: 0 }}>
                <Grid.Column width="1" style={{ lineHeight: '40px' }}>
                  { getStateIcon(this.state.locationLatLng !== null) }
                </Grid.Column>
                <Grid.Column  width="13">
                  <Input id="address-input" onChange={this.addressChange} placeholder='Wprowadź lokalizację' style={{ width: '300px' }} size="large" />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row style={{ paddingBottom: 0 }}>
                <Grid.Column width="1"></Grid.Column>
                <Grid.Column  width="14">
                  Maksymalna odległość:
                </Grid.Column>
              </Grid.Row>
              <Grid.Row style={{ paddingTop: 0 }}>
                <Grid.Column width="1" style={{ lineHeight: '40px' }}>
                  { getStateIcon(this.state.distance !== '') }
                </Grid.Column>
                <Grid.Column  width="13">
                  <Input defaultValue="10" onChange={this.distanceChange} placeholder="Wprowadź odległość" style={{ width: '300px' }} size="large" type="number" step="0.01" />
                </Grid.Column>
                <Grid.Column width="1" style={{ lineHeight: '40px', paddingLeft: '0px' }}>
                  km
                </Grid.Column>
              </Grid.Row>


              <Grid.Row style={{ paddingBottom: 0 }}>
                <Grid.Column width="1"></Grid.Column>
                <Grid.Column  width="14">
                  Kategoria:
                </Grid.Column>
              </Grid.Row>
              <Grid.Row style={{ paddingTop: 0 }}>
                <Grid.Column width="1" style={{ lineHeight: '40px' }}>
                  { getStateIcon(this.state.category !== 'wszystkie') }
                </Grid.Column>
                <Grid.Column  width="13">
                  <Dropdown placeholder='Wybierz kategorię' defaultValue={this.state.category} onChange={this.categoryChange} multiple={false} selection options={categories} size="large" style={{ width: '300px' }} />
                </Grid.Column>
              </Grid.Row>


              <Grid.Row style={{ paddingBottom: 0 }}>
                <Grid.Column width="1"></Grid.Column>
                <Grid.Column  width="14">
                  Zakres cen:
                </Grid.Column>
              </Grid.Row>
              <Grid.Row style={{ paddingTop: 0 }}>
                <Grid.Column width="1" style={{ lineHeight: '40px' }}>
                  { getStateIcon(this.state.rangeFrom !== '' || this.state.rangeTo !== '' ) }
                </Grid.Column>
                <Grid.Column width="13">
                  <Input placeholder="od" defaultValue={this.state.rangeFrom} onChange={this.rangeFromChange} type="number" step="0.01" size="large" style={{ width: '145px', textAlign: 'center' }} /> - { ' ' }
                  <Input placeholder="do" defaultValue={this.state.rangeTo} onChange={this.rangeToChange} type="number" step="0.01" size="large" style={{ width: '145px', textAlign: 'center' }} />
                </Grid.Column>
                <Grid.Column width="1" style={{ lineHeight: '40px', paddingLeft: '0px' }}>
                  zł
                </Grid.Column>
              </Grid.Row>


            </Grid>
            <div style={{textAlign: 'center', marginTop: '30px'}}>
            <Button size="large" style={{background: blue, color: 'white'}} onClick={this.searchOffers}>Wyszukaj</Button>
            </div>
          </Form>
        </Container>        
      </div>
    );
  }
}

Filters.defaultProps = {
};

export default Filters;

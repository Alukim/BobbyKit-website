import React from 'react';

import Navbar from '../components/Navbar';
import OfferForm from '../components/OfferForm';

export default class Add extends React.Component {

  render() {
    return (
      <div>
        <Navbar view="add" />    
        <OfferForm />        
      </div>
    );
  }
}
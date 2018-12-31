import React, { Component } from 'react';
import '../css/App.css';
import ListView from './ListView.js';
import Map from './Map.js';

const fsCreds = {
  clientID: '52KV2DXKOJ0CPBVX5NFRJGPDNP5IBYS1PTGWJNX5AYN0WBPK',
  clientSecret: 'ZDB102P2AIYN3522CBVHXR2U4LJ3ETZUV13LWE4MEGPL0U0Z',
  query: 'Cinema',
  near: 'Leeds'
};

class App extends Component {
  state = {
    cinemas: []
  }

  componentDidMount() {
    this.getCinemas()
    this.loadMapUI()
  }

  getCinemas = () => {    
    return fetch(`https://api.foursquare.com/v2/venues/search?ll=53.812677,-1.563673
                  &query=cinema
                  &client_id=${fsCreds.clientID}
                  &client_secret=${fsCreds.clientSecret}
                  &v=20300101`)
    .then(response => response.json())
    .then(data => {
      this.setState({ cinemas: data.response.venues });
      console.log(this.state.cinemas);
    })
  }

  loadMapUI = () => {
    loadMapSrc('https://maps.googleapis.com/maps/api/js?key=AIzaSyDyM-LmAbfx7QdOvtt2QON2RiyRDYdn5Cs&v=3&callback=initMap')
    window.initMap = this.initMap
  }

  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 53.812677, lng: -1.563673 },
      zoom: 12
    })
  }

  render() {
    return (
      <div className="App">
        <ListView />
        <Map />
      </div>
    );
  }
}

function loadMapSrc(url) {
  const inx = window.document.getElementsByTagName('script')[0],
        elem = window.document.createElement('script');
  elem.src = url;
  elem.async = true;
  elem.defer = true;
  inx.parentNode.insertBefore(elem, inx)
}

export default App;

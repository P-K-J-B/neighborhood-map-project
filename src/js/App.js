import React, { Component } from 'react';
import '../css/App.css';
import ListView from './ListView.js';
import MapView from './MapView.js';

const fsCreds = {
  clientID: '52KV2DXKOJ0CPBVX5NFRJGPDNP5IBYS1PTGWJNX5AYN0WBPK',
  clientSecret: 'ZDB102P2AIYN3522CBVHXR2U4LJ3ETZUV13LWE4MEGPL0U0Z'
};

class App extends Component {
  state = {
    theatres: [],
    filtered: null
  }

  componentDidMount = () => {
    this.getTheatres();
  }

  updateQuery = (query) => {
    this.setState({
      ...this.state,
      filtered: this.applyFilter(this.state.theatres, query)
    })
  }

  applyFilter = (theatres, query) => {
    return theatres.filter(theatre => theatre.name.toLowerCase().includes(query.toLowerCase()));
  }

  getTheatres = () => {    
    return fetch(`https://api.foursquare.com/v2/venues/search?ll=53.800,-1.540
                  &radius=6000
                  &categoryId=4bf58dd8d48988d17f941735
                  &client_id=${fsCreds.clientID}
                  &client_secret=${fsCreds.clientSecret}
                  &v=20300101`)
    .then(response => response.json())
    .then(data => {
      this.setState({ theatres: data.response.venues, filtered: this.applyFilter(data.response.venues, '') });
    });
  };

  render() {
    return (
      <div className="App">
        <ListView
          theatres={this.state.filtered}
          applyFilter={this.updateQuery}
        />
        <div id='map'>
          <MapView
            theatres={this.state.filtered}
          />
        </div>
      </div>
    );
  }
}

export default App;
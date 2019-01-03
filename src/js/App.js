import React, { Component } from 'react';
import '../css/App.css';
import ListView from './ListView.js';
import MapView from './MapView.js';

// store foursquare credentials
const fsCreds = {
  clientID: '52KV2DXKOJ0CPBVX5NFRJGPDNP5IBYS1PTGWJNX5AYN0WBPK',
  clientSecret: 'ZDB102P2AIYN3522CBVHXR2U4LJ3ETZUV13LWE4MEGPL0U0Z'
};

class App extends Component {
  state = {
    theatres: [], // an aray to house the venue details received from the Foursquare api
    filtered: null, // a version of the theatres array with a filter applied
    itemInx: null // a property that represents the index of the most recently clicked item in the ListView sidebar
  }

  componentDidMount = () => {
    this.getTheatres();
  }

// recieves a query string from the ListView component based on user input, invokes the "applyFilter" funciton and populates the "filtered" property in this.state with the returned value  
  updateQuery = (query) => {
    this.setState({
      ...this.state,
      filtered: this.applyFilter(this.state.theatres, query)
    })
  }

// a query string is passed in which filters out any non-matching results from the "theatres" array in this.state and returns a new array with matching results
  applyFilter = (theatres, query) => {
    return theatres.filter(theatre => theatre.name.toLowerCase().includes(query.toLowerCase()));
  }

// retrieve venue details from foursquare api and populate the "theatres" & "filtered" properies in this.state with response data
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
    }).catch((err) => { console.log('Fetching Foursquare data failed' + err); });
  };

// populates the "itemInx" property in this.state with the index of a particular item (in the ListView sidebar) that was just clicked and sets focus on the corresponding info window
  itemClickHandler = (inx) => {
    this.setState({ itemInx: inx });
    setTimeout(() => {
      document.getElementById('venue-info').focus();
    }, 1);
  };

// handles the showing / hiding of the ListView sidebar when the burger icon is clicked
  toggleMenu = () => {
    var menu = document.querySelector('#menu');
    var menuButton = document.querySelector('#menu > button');
    document.querySelector('.list-view').classList.toggle('menu-hidden');
    menu.classList.toggle('active');
    if (menu.classList.contains('active')) {
      menuButton.setAttribute('aria-label', 'hide filter menu');
    } else if (!menu.classList.contains('active')) {
      menuButton.setAttribute('aria-label', 'show filter menu');
    }
  };

// render the main page content - both ListView & MapView are passed the "filtered" array in this.state 
// ListView will make use of the "updateQuery" function when a user enteres a query string and the "itemClickHandler" when a user clicks on a list item in the ListView sidebar
// MapView will need the "itemInx" from this.state to indicate which marker should be treated as "clicked" when it's counterpart (in the ListView sidebar) has been selected 
  render() {
    return (
      <div className='App'>
        <ListView
          theatres={this.state.filtered}
          applyFilter={this.updateQuery}
          itemClickHandler={this.itemClickHandler}
        />
        <div id='menu' className='active'><button aria-label='hide filter menu' onClick={evt => document.querySelector('#menu') ? this.toggleMenu() : null}><span></span></button></div>
        <div id='map'>
          <MapView
            theatres={this.state.filtered}
            itemInx={this.state.itemInx}
          />
        </div>
      </div>
    );
  }
}

export default App;
import React, { Component } from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';
import LoadError from './LoadError.js'

class MapView extends Component {
  state = {
    map: null, // store the map object for google-maps-react
    markers: [], // array that contains a series of new "marker objects" that will be created using the Foursquare data
    markerProps: [], // a seperate array that stores the properties of each marker in the "markers" array (for populating the info window)
    currentMarker: null, // a property that represents the currently selected marker
    currentMarkerProps: null, // a property that stores the details of the currently selected marker 
    infoWindowVisible: false // a boolean that indicates whether the info window is visible to the user
  }

// when the "MapView" component receives props from "App.js", close the info window, reset the markers array with the new filtered data and reset the currently selected marker to "none"
  componentWillReceiveProps(nextProps) {
    if (this.state.markers.length !== nextProps.theatres.length) {
      this.closeInfoWindow()
      this.setMarkers(nextProps.theatres)
      this.setState({ currentMarker: null })
      return;
    }

// if the "itemInx" prop passed in from "App.js" does not match the "currentMarker" in this.state: close the info window 
    if (!nextProps.itemInx || (this.state.currentMarker && (this.state.markers[nextProps.itemInx] !== this.state.currentMarker))) {
      this.closeInfoWindow();
    }

// if the "itemInx" prop passed in from "App.js" is not a number: end this funciton here
    if (nextProps.itemInx === null || typeof(nextProps.itemInx) === 'undefined') {
      return;
    }

// if the "itemInx" prop is passed in as expected: simulate a click event on the corresponding marker in the "markers" array in this.state 
    this.onMarkerClick(this.state.markerProps[nextProps.itemInx], this.state.markers[nextProps.itemInx]);
  }

// runs when the map data has been succesfully retrieved via "google-maps-react": populate the "map" property in this.state with the map data and set run the "setMarkers" function using the filtered prop data passed in from "App.js"
  mapLoaded = (x, map) => {
    this.setState({ map });
    this.setMarkers(this.props.theatres);
  }

// funciton that resets the "currentMarker" and removes the info window from view
  closeInfoWindow = () => {
    this.state.currentMarker && this.state.currentMarker.setAnimation(null);
    this.setState({ infoWindowVisible: false, currentMarker: null, currentMarkerProps: null })
  }

// when a marker is clicked, run closeInfoWindow to remove the info window from any other markers, set the newly clicked marker as the "currentMarker" and show a new info window with the new "currentMarkerProps"
  onMarkerClick = (props, marker, evt) => {
    this.closeInfoWindow();
    this.setState({ infoWindowVisible: true, currentMarker: marker, currentMarkerProps: props })
    marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
    setTimeout(() => {marker.setAnimation(null)}, 1000)
  }

// function to loop through the filtered data passed in by "App.js", populate the "markers" & "markerProps" array in this.state and add the resulting markers to the map   
  setMarkers = (venues) => {

// if no valid array data has been passed to the venues parameter: end the function here
    if (!venues) {
      return;
    }

    this.state.markers.forEach(marker => marker.setMap(null));

    var markerProps = []; // array to house location details of each individual marker

    // loops through each result passed in through the venues parameter
    var markers = venues.map((venue, index) => {
      // create a baisc "props object" to contain the specific properties of this marker
      var mDetails = {
        key: index,
        index,
        position: {lat: venue.location.lat, lng: venue.location.lng},
        name: venue.name,
        address: venue.location.formattedAddress
      }
      
      // add this markers "props object" to the "markerProps" array
      markerProps.push(mDetails);
      
      var animation = this.props.google.maps.Animation.DROP; // tell this marker to use the DROP animation

      // create a marker object for this marker and add it to the map instance
      var marker = new this.props.google.maps.Marker({
        position: { lat: venue.location.lat, lng: venue.location.lng },
        map: this.state.map,
        title: venue.name,
        animation: animation
      });

      // add an event listener to this marker that will run the "onMarkerClick" function
      marker.addListener('click', () => {
        this.onMarkerClick(mDetails, marker, null);
      });

      // add an event listener to the map instance that will close the info window when a user clicks elswhere on the map
      window.google.maps.event.addListener(this.state.map, "click", () => {
        this.closeInfoWindow();
      });

      // return this marker and run back through the loop until all venues have been processed
      return marker;

    });
    
    // once the loop has finished, update the "markers" and "markerProps" arrays in this.state with the newly created markers
    this.setState({ markers, markerProps });
  };

// renders the "Map" and "InfoWindow" components from google-maps-react
// the details of the "currentMarker" & "currentMarkerProps" properties in this.state are fed into the "InfoWindow" component every time the render function is run
  render() {
    var mapStyle = {
      width: '100%',
      height: '100vh'
    }
    var centre = {
      lat: '53.800',
      lng: '-1.540'
    }
    var cmProps = this.state.currentMarkerProps;
    return (
        <Map
          role='application'
          aria-label='map'
          onReady={this.mapLoaded}
          google={this.props.google}
          zoom={13}
          style={mapStyle}
          initialCenter={centre}>
            <InfoWindow
              marker={this.state.currentMarker}
              visible={this.state.infoWindowVisible}
              onClose={this.closeInfoWindow}>
              <div id='venue-info' tabIndex='0'>
                <h3>{cmProps && cmProps.name}</h3>
                {cmProps && cmProps.address[0] && <p>{cmProps.address[0]}</p>}
                {cmProps && cmProps.address[1] && <p>{cmProps.address[1]}</p>}
                {cmProps && cmProps.address[2] && <p>{cmProps.address[2]}</p>}
                {cmProps && cmProps.address[3] && <p>{cmProps.address[3]}</p>}
                <div className='credit'><i>Data courtesy of <a href='https://developer.foursquare.com/'>Foursquare</a></i></div>
              </div>
            </InfoWindow>
        </Map>    
    );
  }
}

// "GoogleApiWrapper" is part of google-maps-react - it is passed the api key and exports the enclosed component
// "GoogleApiWrapper" also has a "LoadingContainer" property which points to a seperate component (LoadError) that will render when the map has either failed to load or is currently loading
export default GoogleApiWrapper({apiKey: 'AIzaSyDyM-LmAbfx7QdOvtt2QON2RiyRDYdn5Cs', LoadingContainer: LoadError})(MapView);
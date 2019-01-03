import React, { Component } from 'react';
import {Map, InfoWindow, GoogleApiWrapper} from 'google-maps-react';

class MapView extends Component {
  state = {
    map: null,
    markers: [],
    markerProps: [],
    currentMarker: null,
    currentMarkerProps: null,
    infoWindowVisible: false
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.markers.length !== nextProps.theatres.length) {
      this.closeInfoWindow()
      this.setMarkers(nextProps.theatres)
      this.setState({ currentMarker: null })
      return;
    }

    if (!nextProps.itemInx || (this.state.currentMarker && (this.state.markers[nextProps.itemInx] !== this.state.currentMarker))) {
      this.closeInfoWindow();
    }

    if (nextProps.itemInx === null || typeof(nextProps.itemInx) === 'undefined') {
      return;
    }

    this.onMarkerClick(this.state.markerProps[nextProps.itemInx], this.state.markers[nextProps.itemInx]);

  }

  mapLoaded = (x, map) => {
    this.setState({ map });
    this.setMarkers(this.props.theatres);
  }

  closeInfoWindow = () => {
    this.state.currentMarker && this.state.currentMarker.setAnimation(null);
    this.setState({ infoWindowVisible: false, currentMarker: null, currentMarkerProps: null })
  }

  onMarkerClick = (props, marker, evt) => {
    this.closeInfoWindow();
    this.setState({ infoWindowVisible: true, currentMarker: marker, currentMarkerProps: props })
    marker.setAnimation(this.props.google.maps.Animation.BOUNCE);
    setTimeout(() => {marker.setAnimation(null)}, 1000)
  }

  setMarkers = (venues) => {

    if (!venues) {
      return;
    }

    this.state.markers.forEach(marker => marker.setMap(null));

    var markerProps = [];
    var markers = venues.map((venue, index) => {
      var mDetails = {
        key: index,
        index,
        position: {lat: venue.location.lat, lng: venue.location.lng},
        name: venue.name,
        address: venue.location.formattedAddress
      }
     
      markerProps.push(mDetails);
      
      var animation = this.props.google.maps.Animation.DROP;
      var marker = new this.props.google.maps.Marker({
        position: { lat: venue.location.lat, lng: venue.location.lng },
        map: this.state.map,
        title: venue.name,
        animation: animation
      });

      marker.addListener('click', () => {
        this.onMarkerClick(mDetails, marker, null);
      });

      window.google.maps.event.addListener(this.state.map, "click", () => {
        this.closeInfoWindow();
      });

      return marker;

    });

    this.setState({ markers, markerProps });
  };
    
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

export default GoogleApiWrapper({apiKey: 'AIzaSyDyM-LmAbfx7QdOvtt2QON2RiyRDYdn5Cs'})(MapView);
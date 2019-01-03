import React, { Component } from 'react';

class LoadError extends Component {
    state = {
        showError: false, // boolean that dictates whether the UI should render either a "loading" or "error" message
        time: null // a timer that will be used to check whether the map data is going to be received
    }

// when the component mounts, this sets a timeout funciton that will run the "showErrorMsg" function if the timer is allowed to exceed one second 
    componentDidMount = () => {
        var time = window.setTimeout(this.showErrorMsg, 1000);
        this.setState({ time });
    }

// if the map data is received (and the component then unmounts) then the timer is cleared
    componentWillUnmount = () => {
        window.clearTimeout(this.state.time);
    }

// if the timer exceeds one second then the "showError" property is set to true and an error message will be rendered on the page
    showErrorMsg = () => {
        this.setState({ showError: true });
    }

// a simple ternary operator checks to see whether "showError" is true or false and renders the UI accordingly
    render() {
        return (
            <div className='error-page'>
                {this.state.showError ? (
                    <div>
                        <h1>Could not retrieve map data</h1>
                        <p>Check your connection and try again</p>
                    </div>)
                : (
                    <div>
                        <h1>Loading...</h1>
                    </div>
                )}
            </div>
        )
    }
}

export default LoadError
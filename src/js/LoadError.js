import React, { Component } from 'react';

class LoadError extends Component {
    state = {
        showError: false,
        time: null
    }

    componentDidMount = () => {
        var time = window.setTimeout(this.showErrorMsg, 1000);
        this.setState({ time });
    }

    componentWillUnmount = () => {
        window.clearTimeout(this.state.time);
    }

    showErrorMsg = () => {
        this.setState({ showError: true });
    }

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
import React, { Component } from 'react';

class ListView extends Component {
    render() {
      return (
        <div className="list-view">
            <header><h1>Places</h1></header>
            <div className='search'>
                <input
                    type="text"
                    placeholder="Filter Places"
                    // value={this.state.query}
                    // onChange={(queryText) => this.updateQuery(queryText.target.value)}
                />
            </div>
        </div>
      );
    }
  }
  
  export default ListView;
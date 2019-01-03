import React, { Component } from 'react';

class ListView extends Component {
    state = {
        query: ''
    }

    updateQuery = (newQuery) => {
        this.setState({ query: newQuery });
        this.props.applyFilter(newQuery); 
    }

    render() {
      return (
        <div className="list-view">
            <header><h1>Places</h1></header>
            <div className='search'>
                <input
                    type="text"
                    placeholder="Filter Places"
                    value={this.state.query}
                    onChange={(queryText) => {this.updateQuery(queryText.target.value)}}
                />
            </div>
            <div className='list-container'>
                {this.props.theatres && (
                    <ol className='list'>
                        {this.props.theatres.map((t, inx) =>
                            <li
                                key={inx}
                            ><p>{t.name}</p>
                            </li>
                        )}
                    </ol>
                )}
            </div>
        </div>
      );
    }
  }
  
  export default ListView;
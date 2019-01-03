import React, { Component } from 'react';

class ListView extends Component {
    state = {
        query: '' // a query string to be sent through to "App.js" for the purpose of filtering
    }

// runs every time a character is typed into the "Filter Theatres" input field: populates the "query" property in this.state and runs the "applyFilter" funciton with the user's input
    updateQuery = (newQuery) => {
        this.setState({ query: newQuery });
        this.props.applyFilter(newQuery); 
    }

// renders the ListView sidebar on screen
// every time the user types into the "search" input field, it's "onChange" event runs the "updateQuery" function which updates the "query" property in this.state with the user's entry, character by character
// the "list-container" is rendered with a number of list items - the list items represent the filtered data passed in by "App.js" and will update in real time when the "query" property is altered
    render() {
      return (
        <div className="list-view">
            <header><h1>Theatres in Leeds</h1></header>
            <div className='search'>
                <input
                    type='text'
                    placeholder='Search Theatres'
                    value={this.state.query}
                    onChange={(queryText) => {this.updateQuery(queryText.target.value)}}
                />
            </div>
            <nav className='list-container'>
                {this.props.theatres && (
                    <section className='list' role='list'>
                        {this.props.theatres.map((t, inx) =>
                            <button key={inx} role='listitem' onClick={evt => this.props.itemClickHandler(inx)}>{t.name}</button>
                        )}
                    </section>
                )}
            </nav>
        </div>
      );
    }
  }
  
  export default ListView;
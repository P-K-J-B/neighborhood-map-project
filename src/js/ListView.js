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
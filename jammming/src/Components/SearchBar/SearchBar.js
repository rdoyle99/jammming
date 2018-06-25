import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {query:''};
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);

  }

  render() {
    return (
      <div className="SearchBar">
        <input onChange= {this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );
  }

  search () {
    this.props.onSearch(this.state.query);
  }

  handleTermChange(event) {
    this.setState({query: event.target.value});
  }
}

export default SearchBar;

import React from 'react';
import './Tracklist.css';
import Track from '../Track/Track.js';

class TrackList extends React.Component {
  render () {
     const tracks = this.props.tracks.map(track => {
       return <Track
                key={track.id}
                track={track}
                onRemove={this.props.onRemove}
                isRemoval={this.props.isRemoval}
                onAdd={this.props.onAdd} />;
    });

    return (
      <div className="TrackList">
        {tracks}
      </div>
    );
  }
}
export default TrackList;

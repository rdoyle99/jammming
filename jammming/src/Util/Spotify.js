import 'whatwg-fetch';
const clientId = '38d2a0a26f7e4c709e09c57cf3136eb6';
const urlRedirect = "ryanjam.surge.sh";
let accessToken = "";
let spotifyUrl = "https://accounts.spotify.com/authorize";

const Spotify = {
  getAccessToken(){
    if(accessToken){
      return accessToken;
    };

      let isAccessToken = window.location.href.match(/access_token=([^&]*)/);
      let isExpiresIn =  window.location.href.match(/expires_in=([^&]*)/);

    if(isAccessToken && isExpiresIn){
      accessToken = isAccessToken[1];
      const expiresIn = Number(isExpiresIn[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    }
    else{
      spotifyUrl=`${spotifyUrl}?client_id=${clientId}&response_type=token&scope=playlist-modify-public&&redirect_uri=${urlRedirect}`;
      window.location = spotifyUrl;
      return accessToken;
    }
  },
  search(searchTerm){
    const accessToken = this.getAccessToken();
    const searchTermUrl = 'https://api.spotify.com/v1/search?type=track';
    const header = {
      headers: {
        Authorization: `Bearer ${accessToken}`}
      };
    return fetch(`${searchTermUrl}&q=${searchTerm}`, header).then(response => {
        return response.json();
    }).then(jsonResponse => {
      if(!jsonResponse.tracks){
        return [];
      }
      return jsonResponse.tracks.items.map(track => {
        return {
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      };
    });
    });
  },

  savePlaylist(playlistName, uriTrack){
    if (playlistName && uriTrack.length){
      let accessToken= Spotify.getAccessToken();
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
      //console.log(headers);
      return fetch('https://api.spotify.com/v1/me',{
        headers: headers
        // convert the response to json
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        // Set the userId to the returned Id
              //  console.log(jsonResponse);
          let userId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
            method: 'POST',
            headers: headers,
            body: JSON.stringify({name: playlistName})
            // convert the response to json
          }).then(response => {
              return response.json();
          }).then(jsonResponse => {
            // Set playlistId to the returned playlist Id
            let playlistId= jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,{
              method: 'POST',
              headers: headers,
              body:JSON.stringify({uris: uriTrack})
            });
          });
      });
    }
    else {
      //if playlist is empty just return
      return;
    }
  }
};

export default Spotify;

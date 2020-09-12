import React from 'react';
import { 
  Container
} from 'react-bootstrap';
import { connect, createLocalTracks } from 'twilio-video';


class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      tracks: []
    }
    this.participantJoined = this.participantJoined.bind(this);

    this.mainVideo = React.createRef();
  }

  componentDidMount() {
    fetch('/api/token')
      .then(res => res.json())
      .then(res => {
        this.setState({ token: res.jwt }, this.connectRoom);
      });
  }

  participantJoined(participant) {
    console.log(`A remote Participant connected: ${participant}`);
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        const track = publication.track;
        // document.getElementById('remote-media-div').appendChild(track.attach());
      }
    });
  
    participant.on('trackSubscribed', track => {
      // document.getElementById('remote-media-div').appendChild(track.attach());
    });
  }

  connectRoom() {
    connect(this.state.token, {
      audio: 'true',
      name: 'LectureOne',
      video: { width: 1080 }
    }).then(room => {
      console.log(`Successfully joined a Room: ${room}`);
      room.on('participantConnected', this.participantJoined);
      
      const localParticipant = room.localParticipant;
      console.log(`Connected to the Room as LocalParticipant "${localParticipant.identity}"`);

      localParticipant.videoTracks.forEach(publication => {
        console.log(publication)
        publication.track.attach(this.mainVideo.current);
      });
    }, error => {
      console.error(`Unable to connect to Room: ${error.message}`);
    });
  }

  render() {
    return (
      <div>
        <video ref={this.mainVideo} style={{ width: '100%', height: '100vh', backgroundColor: '#111' }}/>
      </div>
    );
  }

}

export default User;




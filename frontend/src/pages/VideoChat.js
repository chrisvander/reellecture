import React from 'react';
import { 
    Container,
    ButtonGroup,
    Button
} from 'react-bootstrap';

import Nav from './nav';
import { connect, createLocalTracks } from 'twilio-video';
import ws from 'ws';
import { ImageCapture } from 'image-capture';


class VideoChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      userInfo: {
        username: '',
        name: '',
        role: ''
      },
      videoPanes: [],
      tracks: [],
      videoTracks: [],
      participants: [],
      room: null,
      mainTrack: null,
      mainTrackDisplay: null,
      sound: 'Mute',
      video: 'Turn Off Video',
      screen: 'Share Screen',
      shareStream: null,
      analytics: null
    }
    this.createTracks = this.createTracks.bind(this);
    this.mainVideo = React.createRef();
    this.takePhoto = this.takePhoto.bind(this);
    this.toggleScreen = this.toggleScreen.bind(this);
    this.toggleAudio = this.toggleAudio.bind(this);
  }

  componentDidMount() {
    fetch('/api/token/' + this.props.match.params.roomID)
      .then(res => res.json())
      .then(res => {
        this.setState({ token: res.jwt }, this.connectRoom);
      });
    fetch('/api/user')
      .then(res => res.json())
      .then(res => {
        this.setState({ userInfo: { username: res.username, name: res.name, role: res.role } });
        if (res.role === 'instructor') {
          setInterval(() => {
            fetch("/api/analytics")
              .then(res => res.json())
              .then(data => { 
                this.setState({ analytics: data }) 
              });
          }, 1000);
        }
      });

    window.addEventListener('beforeunload', this.handleLeavePage.bind(this));
    
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handleLeavePage);
  }

  handleLeavePage(e) {
    this.state.room.disconnect();
    return undefined;
  }
  createTracks() {
    let { room, mainTrack, mainTrackDisplay } = this.state;
    let tracks = []
    let participants = []
    mainTrack = null;
    mainTrackDisplay = null;

    room.localParticipant.tracks.forEach(publication => {
      tracks.push(publication.track);
      participants.push(room.localParticipant);

      room.localParticipant.on('trackSubscribed', this.createTracks);
      room.localParticipant.on('disconnected', this.createTracks);
      room.localParticipant.on('unsubscribed', this.createTracks);
    });

    room.participants.forEach(participant => {
      const addTrack = (publication) => {
        if (publication.isSubscribed) {
          tracks.push(publication.track);
          participants.push(participant);
        }
      }
      participant.tracks.forEach( track => {
        addTrack(track)
      });

      participant.on('trackSubscribed', this.createTracks);
      participant.on('disconnected', this.createTracks);
      participant.on('unsubscribed', this.createTracks);
    });

    tracks.forEach((el, i) => {
      if (el.name === 'screenshare') {
        mainTrackDisplay = <video ref={r => el.attach(r)} style={{ width: '100%', height: '100vh', backgroundColor: '#111' }} />;
        mainTrack = el;
        tracks.splice(i, 1);
      }
    })

    let videoTracks = []
    tracks.forEach(el => {
      let vid = <video style={{ width: '100%', transform: 'scaleX(-1)', display: el.kind === 'video' ? 'initial' : 'none' }} ref={r => el.attach(r)} />;
      videoTracks.push(vid);
    });

    this.setState({ mainTrack, mainTrackDisplay, tracks, videoTracks, participants });
  }

  connectRoom() {
    connect(this.state.token, {
      audio: 'true',
      name: this.props.match.params.roomID,
      video: { width: 1080 }
    }).then(room => this.setState({ room: room }, () => {
        room.on('participantConnected', this.createTracks);
        room.on('participantDisconnected', this.createTracks);
        this.createTracks();
        room.on('disconnected', room => {
          // Detach the local media elements
          room.localParticipant.tracks.forEach(publication => {
            const attachedElements = publication.track.detach();
            attachedElements.forEach(element => element.remove());
          });
        });
      }), error => {
      console.error(`Unable to connect to Room: ${error.message}`);
    });
    setInterval(() => {
      if (this.state.room) {
        let { tracks } = this.state.room.localParticipant;
        tracks.forEach(el => {
          if (el.kind === 'video' && el.name !== 'screenshare') {
            this.takePhoto(new ImageCapture(el.track.mediaStreamTrack))
          }
        })
      }
    }, 4000);
  }

  takePhoto(imageCapture) {
    if (this.state.userInfo.role !== 'instructor')
      imageCapture.takePhoto().then(function(blob) {
        var fd = new FormData();
        fd.append('photo', blob);

        fetch('/api/photo', {
          method: 'POST',
          credentials: 'include',
          body: fd
        })
        .then(res => res.json())
        .then(res => {
          // YOUR COOL FACE OUTPUT
          console.log(res)
        });

        // img.classList.remove('hidden');
        // img.src = URL.createObjectURL(blob);
      }).catch(function(error) {
        console.log('takePhoto() error: ', error);
      });
  }

  async toggleScreen() {
    if (this.state.shareStream === null) {
      let stream = await navigator.mediaDevices.getDisplayMedia();
      this.setState({ screen: 'Stop Sharing', shareStream: stream });
      await this.state.room.localParticipant.publishTrack(stream.getTracks()[0], { name: 'screenshare' });
      stream.getTracks()[0].onended = this.toggleScreen;
      this.state.room.localParticipant.videoTracks.forEach(publication => {
        this.setState({ mainTrack: publication.track })
      });
    } else {
      await this.state.room.localParticipant.unpublishTrack(this.state.shareStream.getTracks()[0]);
      this.state.shareStream.getTracks().forEach(track => {
        track.stop();
      });
      this.setState({ screen: 'Start Sharing', shareStream: null });
      this.state.room.localParticipant.videoTracks.forEach(publication => {
        if (publication.track.name === 'screenshare') {
          publication.track.detach();
        }
      });
    }

    this.createTracks();
  }

  toggleAudio() {
    console.log("Method executed");
    if(this.state.sound === 'Mute')
    {
      console.log("Got to mute");
      this.setState({sound: 'Unmute'});
      this.state.room.localParticipant.audioTracks.forEach(publication => {
        publication.track.disable();
      });
    }
    else
    {
      console.log("Got to unmute");
      this.setState({sound: 'Mute'});
      this.state.room.localParticipant.audioTracks.forEach(publication => {
        publication.track.enable();
      });
    }
  }

  toggleVideo() {
    
  }

  render() {
    let { name, role, username } = this.state.userInfo;
    let { tracks, analytics, videoTracks, mainTrackDisplay } = this.state;
    return (
      <div>
        <Nav wide />
        <div style={{ backgroundColor: '#111', height: '100vh' }}>
          {mainTrackDisplay}
        </div>
        {role === 'instructor' && 
          <div style={{ position: 'absolute', backgroundColor: 'rgba(255,255,255,0.8)', top: 56, right: 0, width: '300px', height: '100vh', padding: 20 }}>
            <h1>Analytics</h1>
            {JSON.stringify(analytics)}<br />
            <Button onClick={this.toggleScreen}>{this.state.screen}</Button>
          </div>
        }
        <div style={{ 
          position: 'absolute',
          maxWidth: 320,
          top: 70,
          left: 20
        }}>
          {videoTracks}
        </div>
        {name !== '' && <div style={{ 
          position: 'absolute', 
          bottom: 20, 
          left: 20, 
          backgroundColor: 'white', 
          borderRadius: 25, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          padding: '10px 40px'
        }}>
          {name}, {role}
        </div>}

        {name !== '' && <div style={{ 
          position: 'absolute', 
          bottom: 20,
          right: 20, 
          backgroundColor: 'white', 
          borderRadius: 30, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          padding: '10px 40px'
        }}>
          <ButtonGroup aria-label="Basic example">
            <Button variant="secondary">Toggle Video</Button>
            <Button variant="secondary" onClick={this.toggleAudio}>{this.state.sound}</Button>
          </ButtonGroup>
        </div>}

      </div>
    );
  }
}
  
export default VideoChat;



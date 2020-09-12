import React from 'react';
import { 
    Container,
    Button
} from 'react-bootstrap';
  
class Home extends React.Component {
  state = {
    web: '<div />'
  }
  componentDidMount() {
    fetch('/home.html')
      .then(res => res.text())
      .then(body => this.setState({ web: body }))
  }
  render() {
    return (
      <div dangerouslySetInnerHTML={{__html: this.state.web}} />
    );
  }
}
  
export default Home;
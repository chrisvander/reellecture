import React from 'react';
import { 
    Container, 
    Alert,
    Button,
    Form
} from 'react-bootstrap';
  
class Login extends React.Component {
  state = {
    showDialog: false,
    username: '',
    password: ''
  }
  
  componentDidMount() {
    console.log(this.props)
    if (this.props.location.state)
      this.setState({ showDialog: this.props.location.state.redirectFromUnauthorized });
  }

  render() {
    console.log(this.props.match)
    return (
      <Container>
        <br />
        {this.state.showDialog && (
          <Alert variant='danger'>
            You must be logged in to access that page.
          </Alert>
        )}
        <Form method="post" action="/api/login">
          <Form.Group controlId="formBasicEmail">
            <Form.Control name="username" type="text" placeholder="Username" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control name="password" type="password" placeholder="Password" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Container>
    );
  }
}
  
  export default Login;
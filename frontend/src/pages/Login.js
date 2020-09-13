import React from 'react';
import { 
    Container, 
    Alert,
    Button,
    Form
} from 'react-bootstrap';
import Nav from './nav';
  
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
      <React.Fragment>
        <Nav />
        <Container>
          <br />
          {this.state.showDialog && (
            <Alert variant='danger'>
              You must be logged in to access that page.
            </Alert>
          )}
          <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
              <legend className="f2 fw6 ph0 mh0">Login </legend>
              <Form method="post" action="/api/login">
                <Form.Group controlId="formBasicEmail">
                  <Form.Control name="username" type="email" placeholder="Email" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Control name="password" type="password" placeholder="Password" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </main>
          </article>
        </Container>
      </React.Fragment>
    );
  }
}
  
  export default Login;
import React from 'react';
import LoadingPage from './LoadingPage';
import { Redirect } from 'react-router';
  
class Logout extends React.Component {
    state = { redirect: false }
    
    componentDidMount() {
        fetch('/api/logout')
            .then(() => this.setState({ redirect: true }), 2000);
    }

    render() {
        if (this.state.redirect) 
            return <Redirect to="/login" />;
        return <LoadingPage />;
    }
}
  
export default Logout;
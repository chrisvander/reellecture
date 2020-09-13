import React from 'react';
import { Route, Redirect, BrowserRouter as Router } from 'react-router-dom'
import LoadingPage from '../pages/LoadingPage';

class PrivateRoute extends React.Component {
    state = {
        authorized: false,
        waiting: true
    }
    componentDidMount() {
        fetch('/api')
            .then(res => res.json())
            .then(res => {
                this.setState({ authorized: res.loggedIn, waiting: false })
            })
            .catch(err => this.setState({ authorized: false, waiting: false }));
    }

    render() {
        let { component: Component, ...rest} = this.props;
        let { authorized, waiting } = this.state;

        if (waiting)
            return <Route {...rest} render={() => <LoadingPage />} />;

        return (
            <Route
            {...rest}
            render={(props) => authorized === true
                ? <Component {...props} />
                : <Redirect to={{ pathname: '/login', state: { 
                    from: props.location, 
                    redirectFromUnauthorized: true 
                }}} />}
            />
        );
    }
}

export default PrivateRoute;
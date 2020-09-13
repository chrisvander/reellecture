import React from 'react';
import { 
    Container
} from 'react-bootstrap';
import AnalysisComponent from '../component/analysis';
import Nav from './nav';

class AnalysisPage extends React.Component {
    state = {
        analytics: null
    }
    
    componentDidMount() {
        fetch("/api/analytics")
            .then(res => res.json())
            .then(data => { 
                this.setState({ analytics: data }) 
            })
    }

    render() {
        return (
            <React.Fragment>
                <Nav />
                <Container>
                    <AnalysisComponent data={this.state.analytics}/>
                </Container>
            </React.Fragment>
        );
    }
}
  
export default AnalysisPage;
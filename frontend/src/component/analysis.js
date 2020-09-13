import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { PieChart } from 'react-minimal-pie-chart';
import Nav from '../pages/nav';
import LoadingPage from '../pages/LoadingPage';

class Analysis extends React.Component {
    render() {
        let { data } = this.props; 
        if (data === null) return <LoadingPage />

        let emotions = Object.keys(data);
    
        return (
            <ListGroup>
                {emotions.map(el => {
                    if (Object.keys(data[el]).length !== 0)
                        return <ListGroup.Item>{el} <Badge variant="light" style={{ float: 'right' }}>{Object.values(data[el]).reduce((a,b) => a+b)}</Badge></ListGroup.Item>
                })}
            </ListGroup>
        );
    }
}

export default Analysis;
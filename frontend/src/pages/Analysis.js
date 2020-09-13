import React from 'react'; 
import { PieChart } from 'react-minimal-pie-chart';
import LoadingPage from './LoadingPage';

class Analysis extends React.Component {
    state = {
        analytics: null,
        redirect: false
    }

    componentDidMount() {
        fetch("/api/analytics")
            .then(res => res.json())
            .then(data => { 
                this.setState({ analytics: data }) 
            })
            .catch(err => this.setState({ redirect: true }));
    }

    render() {
        let { analytics } = this.state; 
        if (analytics === null) return <LoadingPage />
        return (
            <div>
                <div>
                    <p>{JSON.stringify(analytics)}</p>
                    <p> {analytics.eyesClosed} </p>
                    <p> {JSON.stringify(analytics).happy} : </p>
                    <div>
                        {/* analytics.forEach(element => {
                            
                        }) */}
                    </div>
                    {/* <p> By Emotion */}
                    <PieChart data={[
                        { title: 'One', value: 10, color: '#E38627' },
                        { title: 'Two', value: 15, color: '#C13C37' },
                        { title: 'Three', value: 20, color: '#6A2135' },
                    ]} radius="10" />
                </div>
                <div>
                    <p> Over Time </p>
                </div>
            </div>
        )
    }
}

export default Analysis;
import React from 'react';
import { Navbar, Button, Nav, Container } from 'react-bootstrap';

function Navigation({ wide }) {
    return (
        <Navbar bg="dark" variant="dark">
            <Container fluid={wide}>
                <Navbar.Brand href="/">ReelLecture</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/user">Profile</Nav.Link>
                </Nav>
                <a href="/logout"><Button variant="danger">Logout</Button></a>
            </Container>
        </Navbar>
    )
}

export default Navigation;
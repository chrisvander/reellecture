import React from 'react'; 
import Nav from './nav';


class Register extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            name: '', 
            email: '', 
            password: '', 
            role: '', 
        }
    }

    onNameChange = (event) => {
        this.setState({name: event.target.value})
    }

    onEmailChange = (event) => {
        this.setState({email: event.target.value})
    }

    onPasswordChange = (event) => {
        this.setState({password: event.target.value})
    }

    onRoleChange = (event) => {
        this.setState({role: event.target.value})
    }

    onSubmitSignIn = () => {
        fetch('http://localhost:3000/api/register', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            name: this.state.name, 
            email: this.state.email,
            password: this.state.password,
            role: this.state.role
          })
        })
          .then(response => response.json())
          .then(user => {
              console.log(user)
            if (user.id) {
              this.props.loadUser(user)
            //  this.props.onRouteChange('home');
            }
          })
      }

    render() {
        return (
            <React.Fragment>
                <Nav />
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                    <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f2 fw6 ph0 mh0">Register </legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black w-100" 
                            type="text" name="name"  id="name" onChange={this.onNameChange}/>
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black w-100" 
                            type="email" name="email-address"  id="email-address" onChange={this.onEmailChange}/>
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input className="b pa2 input-reset ba bg-transparent hover-bg-black w-100" 
                            type="password" name="password"  id="password" onChange={this.onPasswordChange}/>
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="role">Role</label>
                            <select name="roles" onChange={this.onRoleChange}> 
                                <option value="Student"> Student </option>
                                <option value="Instructor"> Instructor </option>
                          
                    <div className="">
                    <label className="db fw6 lh-copy f6" htmlFor="login"> Already Regsitered? </label>
                    <input onClick={this.onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f3 tc dib" type="submit" value="Log In" />
                    <a href="#0" className="f6 link dim black db">Register</a>
                    </div>  </select>
                        </div>
                        <div className="">
                        <input onClick={this.onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f3 tc dib" type="submit" value="Register" />
                        </div>
                        </fieldset>
                        {/* <div className="">
                        <input onClick={this.onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register" />
                        </div> */}
                        {//<div className="lh-copy mt3">
                                        //  <a href="#0" className="f6 link dim black db">Register</a>
                                    // </div>
                                    }
                    </div>
                    </main>
                </article>
            </React.Fragment>
        );
    }
}
export default Register; 
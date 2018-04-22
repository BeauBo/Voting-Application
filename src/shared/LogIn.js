import React, { Component } from 'react'
import AuthService from './AuthService'
import Ipad from './Ipad'
import { Link } from 'react-router-dom'



class LogIn extends Component {

    constructor(props){
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.Auth = new AuthService()
        this.state = {
            email: null,
            password: null,
            error: null
        }
    }

    componentDidMount(){
        if(this.Auth.getGoogleToken() || this.Auth.getLocalToken()){
            this.props.history.replace('/')
        }
    }
    render(){
        const errorMessage = this.state.error? 'error-message' : ''
        return(
            <div className='login d-flex flex-row justify-content-center'>
                <div className='row'>
                    <div className='d-flex flex-row justify-content-center col-sm-6 ipad'>
                        <Ipad />
                    </div>
                    <div className='d-flex flex-column col-sm-6 login-form'>
                        <div className='d-flex flex-column form-box'>
                            <h1>VotePlex</h1>
                            <p className={errorMessage}>{this.state.error}</p>
                            <form className='d-flex flex-column' onSubmit={this.handleSubmit}>
                                <input
                                    className='form-control'
                                    name='email' 
                                    placeholder='Email'
                                    type='email'
                                    onChange={this.handleChange}
                                    value={this.state.email} 
                                />
                                <input
                                    className='form-control'
                                    name='password' 
                                    placeholder='password'
                                    type='password'
                                    onChange={this.handleChange}
                                    value={this.state.password} 
                                />
                                <input 
                                    type='submit'
                                    value='Log In'
                                    className='btn btn-success form-control'
                                    disabled={!this.state.email||!this.state.password}
                                />
                            </form>
                        </div>
                        <div className='go-to-sign-up'>
                            <p>Don't have an account ? <Link to='/' className='sign-up-link'>Sign up</Link></p>
                        </div>
                    </div>
                </div>
            </div>    
        )
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            }
        )
    }

    handleSubmit(e){
        e.preventDefault()
        this.Auth.logIn(this.state.email, this.state.password).then( res => {
            if(res.error){
               
                
               
                this.setState(
                    {
                        email: '',
                        password: '',
                        error: res.error
                    }
                )
               
             
            }else{
                this.props.history.replace('/')
            }
        })
    }
}

export default LogIn
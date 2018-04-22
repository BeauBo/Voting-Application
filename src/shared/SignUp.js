import React, { Component } from 'react'
import AuthService from './AuthService'
import { Link } from 'react-router-dom'
import Ipad from './Ipad'

class SignUp extends Component {

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.Auth = new AuthService()
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            username: null,
            email: null,
            password: null,
            passwordConfirm: null,
            error: ''
        }
    }

    render(){
        const errorMessage = this.state.error? 'error-message' : ''
        return(
            <div className='signUp d-flex flex-row justify-content-center'>
                <div className='row'>
                    <div className='d-flex flex-row justify-content-center col-sm-6 ipad'>
                        <Ipad />
                    </div>
                    <div className='d-flex flex-column col-sm-6 sign-up-form'>
                        <div className='d-flex flex-column form-box'>
                            <h1>VotePlex</h1>
                            <p className={errorMessage}>{this.state.error}</p>
                            <div>
                                <form className='d-flex flex-column'onSubmit={this.handleSubmit}>
                                    <p>Sign up to vote</p>
                                    <a href='/auth/google' ><i className="fa fa-google-plus" aria-hidden="true"></i> Log in with Google</a>
                                    <div className='d-flex flex-row hr'>
                                        <div className='flex-grow-1 align-self-center line'></div>
                                        <div className='p-2 letter'>or</div>
                                        <div className='flex-grow-1 align-self-center line'></div>
                                    </div>
                                    <input
                                        className='form-control'
                                        name='username' 
                                        placeholder='Username'
                                        type='text'
                                        onChange={this.handleChange} 
                                    />
                                    <input
                                        className='form-control'
                                        name='email' 
                                        placeholder='Email'
                                        type='email'
                                        onChange={this.handleChange} 
                                    />
                                    <input
                                        className='form-control'
                                        name='password' 
                                        placeholder='password'
                                        type='password'
                                        onChange={this.handleChange} 
                                    />
                                    <input
                                        className='form-control'
                                        name='passwordConfirm' 
                                        placeholder='Enter password again'
                                        type='password'
                                        onChange={this.handleChange} 
                                    />
                                    <input 
                                        type='submit'
                                        value='Sign Up'
                                        className='btn btn-success'
                                        disabled={!this.state.username || !this.state.email || !this.state.password}
                                    />
                                </form>
                            </div>       
                        </div>    
                        <div className='go-to-login'>
                            <p>Have an account ? <Link to='/login' className='login-link'>Log In</Link></p>
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

    handleSubmit(e) {
        e.preventDefault()
        if(this.state.password === this.state.passwordConfirm){
            this.Auth.signUp(this.state.username, this.state.email, this.state.password)
            .then((res) => {
                if (res.error){
                    this.setState({
                        error: res.error
                    })
                }else{
                    this.props.history.go('/')
                }
            })
        }else{
            this.setState({
                error: 'Please enter two same password!'
            })
        }
            
        
        
    }

    
}


export default SignUp
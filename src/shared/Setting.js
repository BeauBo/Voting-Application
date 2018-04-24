import React, { Component } from 'react'
import AuthService from './AuthService'



class Setting extends Component {

    constructor(props){
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.Auth = new AuthService()
        this.state={
            current: null,
            newPassWord: null,
            newConfirm: null,
            error: null
        }
    }

    componentDidMount(){
        if( !this.Auth.getGoogleToken() && !this.Auth.getLocalToken()){
            this.setState({
                error: 'Have not logged in yet!'
            },() => {
                alert(this.state.error)
                this.props.history.replace('/login')
            })
            
        } else if(this.Auth.getGoogleToken()){
            this.setState({
                error: 'You are using Google account, can not change password!'
            },() => {
                alert(this.state.error)
                this.props.history.replace('/')
            })
        }
    }
    render(){
        const errorMessage = this.state.error? 'error-message' : ''
        return(
            <div className='setting'>
                <h1>Change Password</h1>
                <p className={errorMessage}>{this.state.error}</p>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type='password'
                        name='current'
                        onChange={this.handleChange}
                        className='form-control'
                        placeholder='Current password'
                    />
                    <input
                        type='password'
                        name='newPassWord'
                        onChange={this.handleChange}
                        className='form-control'
                        placeholder='New password'
                    />
                    <input
                        type='password'
                        name='newConfirm'
                        onChange={this.handleChange}
                        className='form-control'
                        placeholder='Enter new password again'
                    />
                    <input
                        type='submit'
                        value='Save'
                        className='btn btn-success form-control'
                        disabled={!this.state.current || !this.state.newPassWord || !this.state.newConfirm}
                    />
                </form>
                
            </div>    
        )
    }

    handleChange(e){
        this.setState({
            [e.target.name] : e.target.value,
        })
    }

    handleSubmit(e){
        e.preventDefault()
        const email = this.Auth.getProfile().payload.email
        if(this.state.newPassWord === this.state.newConfirm){
            fetch('/api/setting', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    email,
                    current: this.state.current,
                    newPassWord: this.state.newPassWord
                })
            }).then((res) => res.json()).then((data) => {
                if(data.success){
                    
                    this.props.history.replace('/login')
                    
                }else{
                    this.setState({
                        error: data.error
                    })
                }
            })
        }else{
            this.setState({
                error: 'Please enter the same new password!'
            })
        }
    }
}




export default Setting
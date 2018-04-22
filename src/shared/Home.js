import React, { Component } from 'react'
import AuthService from './AuthService'
import queryString from 'query-string'
import { Link } from 'react-router-dom'
import UserProfile from './Profile'
import SignUp from './SignUp'





class Home extends  Component {
    constructor(props){
        super(props)
        
        this.Auth = new AuthService()
        this.state = {
            user: null,
            local: true
        }
    }

    componentDidMount(){
        
        
        let localToken = this.Auth.getLocalToken()
        let parsed = queryString.parse(location.search)
        let googleToken = parsed.googleToken || this.Auth.getGoogleToken()
        if(googleToken){
            localStorage.setItem('google_token', googleToken)
            
                    const user = this.Auth.getGoogleProfile() 
                    this.setState({
                        user: user,
                        local: false
                    },()=> {
                        this.props.history.replace('/')
                    })
                
                
           
        }

        else if(localToken){
           const profile =  this.Auth.getProfile()
           this.setState({
               user: profile,
               local: true
           })
        }else{
            this.setState({
                user: null,
                local: true
            })
        }
       
       
    }
    render(){
        
        if(this.state.user){
           
            return(
                
                    <UserProfile user={this.state.user} local={this.state.local} />
                   
            )
            
        }else{
          
            return (
                <SignUp history={this.props.history}/>   
            )
        }
       
    }

    
    
    
}



export default Home
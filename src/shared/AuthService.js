import decode from 'jwt-decode'

export default class AuthService {
    constructor() {
        this.signUp = this.signUp.bind(this)
        this.fetch = this.fetch.bind(this)
    }

    signUp(username, email, password){
        
        return this.fetch(`/api/signup`, {
        method: 'POST',
        body: JSON.stringify({
            username,
            email,
            password
        })
        }).then(res => {
            if(res.token){
                this.setToken(res.token)
            }
            
            return Promise.resolve(res)
            
        })
    }

    logIn(email, password) {
        if(!email || !password){
            alert('Please enter email and password')
            return 
        }
        return this.fetch(`/api/login`, {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        }).then( res => {
            if(res.token){
                this.setToken(res.token)
            }
            return Promise.resolve(res)
        })
    }

    loggedIn(){
        const token = this.getLocalToken() || this.getGoogleToken()
        return !!token
    }

    logout(){
        localStorage.removeItem('local_token')
        localStorage.removeItem('google_token')
    }

    setToken(token){
        localStorage.setItem('local_token', token)
    }
    
    getLocalToken(){
        if(localStorage.getItem('local_token')){
            return localStorage.getItem('local_token')
        }
        return false
    }

    getGoogleToken(){
        if(localStorage.getItem('google_token')){
            return localStorage.getItem('google_token')
        }
        return false
    }
    
    getProfile(){
        if(this.getLocalToken()){
           return decode(this.getLocalToken())
        }
        return false
    }
    getGoogleProfile(){
        if(this.getGoogleToken()){
            return decode(this.getGoogleToken())
        }
        return false
    }


    fetch(url, options){
        const headers = {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }

        if(this.loggedIn()){
            headers['Authorization'] = `Bearer ${this.getLocalToken()}`
        }

         return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
        
    }

    _checkStatus(response){
        if(response.status >= 200 && response.status < 300){
            return response
        }else{
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}
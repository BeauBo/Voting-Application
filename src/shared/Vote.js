import React, { Component } from 'react'
import AuthService from './AuthService'
import GoogleChart from './GoogleChart'


class Vote extends Component {
    constructor(props){
        super(props)
        this.state = {
            userId: null,
            pollName: null,
            options: [],
            submitted: false,
            local: false
        }
        this.Auth = new AuthService()
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    componentDidMount(){
        const path = location.pathname.replace(/%20/g, ' ').split('/')
        const pollName = path[2]
        const userId =  this.Auth.getProfile()? this.Auth.getProfile().payload._id : this.Auth.getGoogleProfile()._id
        const local = this.Auth.getProfile()? true : false
       
        fetch(`/api/votes`,{
            headers: {
            'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                userId,
                pollName,
                local
            })
        }).then((res) => res.json()).then((data) => {
            this.setState({
                userId,
                pollName: data.name,
                options: data.options,
                submitted: false,
                local
            })
            
        })
       

    }
    
    eachOption(){
        return this.state.options.map((option,key) => {
            return (
                <button
                key={key} 
                className=''
                data-selectedoption={option.name}
                onClick={this.handleSubmit}
                >
                {option.name}
                </button>
            )
        })
    }

  

    render(){
        
        if(this.state.submitted){
            return(
                <div className='display-google-chart'>
                    < GoogleChart options={this.state.options} pollName={this.state.pollName}/>
                </div>    
            )
        }else{
            return(
                <div className='vote'>
                    <h1 className='pollName'>{this.state.pollName}</h1>
                    <div className='d-flex flex-column align-items-center each-option'>
                        {this.eachOption()}
                    </div>  
                    
                </div>   
            )
        }
    }

    handleSubmit(e){
        
        const selectedOption = e.currentTarget.dataset.selectedoption
        const userId = this.state.userId
        const pollName = this.state.pollName
        const local = this.state.local
        
        fetch('/api/updateVotes',{
            headers: {
                'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    userId,
                    pollName,
                    selectedOption,
                    local
                })
        }).then((res) => res.json()).then((data) => {
            this.setState({
                options: data.payload.options,
                submitted: true
            })
        })
    }
}


export default Vote
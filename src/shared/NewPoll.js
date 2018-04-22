import React, { Component } from 'react'



class NewPoll extends Component {
    constructor(props){
        super(props)
        this.state = {
            pollName: '',
            options: ['',''],
            submitted: false,
            url: null,
            error: null
        }
        this.addOptions = this.addOptions.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.deleteOption = this.deleteOption.bind(this)
    }

    addOptions(e){
        e.preventDefault()
        let options = this.state.options
        options.push('')
        this.setState({
            options: options,
        })
    }
    deleteOption (e){
        const key = e.currentTarget.dataset.option
        const slicedOptions = this.state.options.slice(key)
        slicedOptions.shift()
        const options = this.state.options.slice(0,key).concat(slicedOptions)
        this.setState({
            options
        })
    }
    eachOption(){
      
        let options = this.state.options
        return options.map((option, key) => {
            return (
                <div className='d-flex flex-row justify-content-between options'>
                    <input
                        key={key}
                        name={key}
                        value={option}
                        type='text'
                        className='form-control'
                        placeholder='i.e. Enter your opition'
                        onChange={this.handleChange}
                    />
                    <span onClick={this.deleteOption} data-option={key}>&times;</span>
                </div>
            )
        })
        
    }
  

    render(){
        const addOptions = this.state.options.length > 2 ? 'add-option' : ''
        const errorMessage = this.state.error? 'error-message' : ''
        if(!this.props.newPoll && this.state.submitted){
            return(
    
                <div className='poll-launched'>
                    <h1>Congratulations!</h1>
                    <p>Your poll has been posted to: <a href={this.state.url} target='_blank'> {this.state.url}</a></p>
                </div>    
            )
            
        }else{
            return(
                <div className='d-flex flex-column align-items-center create-new-poll'>
                    <form className={addOptions} onSubmit={this.handleSubmit}>
                        <p className={errorMessage}>{this.state.error}</p>
                        <label for='pollName'>Name your poll</label>
                        <input 
                            name='pollName'
                            type='text'
                            className='form-control'
                            placeholder='i.e. What is your favorite color'
                            onChange={this.handleChange}
                            />
                        <label>Options</label>
                        
                        {this.eachOption()}
                        <a href='#' onClick={this.addOptions}><i className='fa fa-plus'></i> Add option</a>
                        <input
                            type='submit'
                            value='Lauch Poll'
                            className='btn btn-success form-control'
                            disabled = { !this.state.pollName || this.state.options.includes('') }
                        />
                    </form>
                      
                </div>    
            )
        }
        
    }

    handleChange(e){
        if(e.target.name === 'pollName'){
            this.setState({
                pollName : e.target.value
            })
        }else{
            let options = this.state.options
            options[e.target.name] = e.target.value
            this.setState({
                options : options
            })
        }
    }
    

    handleSubmit(e){
        e.preventDefault()
        fetch('/api/submitPoll',{
            headers : {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                userId: this.props.userId,
                local: this.props.local,
                pollName: this.state.pollName,
                options: this.state.options
            })
        }).then((res) => res.json()).then((data) => {
            if(!data.success){
                this.setState({
                    error: data.error
                })
            }else{
                this.props.newPoll = false
                this.setState({
                    submitted: true,
                    url: `/${this.props.username}/${data.payload.name}`,
                    options : ['','']
                }) 
            }
            
        })    
    }
}








export default NewPoll
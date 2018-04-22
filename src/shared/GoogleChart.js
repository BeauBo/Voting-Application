import React, { Component } from 'react'



class GoogleChart extends Component {
    constructor(props) {
        super(props)
        this.drawChart = this.drawChart.bind(this)
    }

    shouldComponentUpdate(){
        return false
    }

    componentDidMount(){
        google.charts.load('current', {'packages':['corechart']})
        google.charts.setOnLoadCallback(() => this.drawChart())
    }

    drawChart(){
        const data = new google.visualization.DataTable()
        data.addColumn('string', 'Options')
        data.addColumn('number', 'Votes')
        const rows = []
        this.props.options.map((option) => {
            rows.push([option.name, option.votes])
        })
        data.addRows(rows)
        const options = {
                title: this.props.pollName,
                titleTextStyle:{
                    color: '#fff',
                    fontName: 'Tahoma',
                    fontSize: 20
                },
                width: 800,
                height: 500,
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out'
                },
                backgroundColor: '#23252c',
                colors: ['#f6b921'],
                dataOpacity: .8,
                legend:{
                    position: 'none'
                },
                hAxis:{
                    textStyle:{
                        color: '#e2e2e2',
                        fontSize: 12,
                        fontName: 'Tahoma'
                    },
                    maxTextLines: 3
                },

            }
        const chart = new google.visualization.ColumnChart(this.refs.googleChart)
        chart.draw(data, options)
    }

    


    render(){
        return(
            <div className='d-flex flex-row justify-content-center googleChart' ref='googleChart'></div>    
        )
    }
}


export default GoogleChart
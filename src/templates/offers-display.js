import React from 'react'

export default class OffersDisplay extends React.Component {
    render() {
        console.log(this.props);
        return (
            <div>
                {this.props.pathContext.city.id}
                <br></br>
                {this.props.pathContext.ad_type.id}
            </div>
        )
    }
}
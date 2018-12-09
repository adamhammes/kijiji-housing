import { withPrefix } from 'gatsby';
import React from 'react'

export default class OffersDisplay extends React.Component {
    componentDidMount() {
        const { city, ad_type } = this.props.pathContext;
        const apiPath = withPrefix(`/api/${city.id}-${ad_type.id}.json`);

        fetch(apiPath)
            .then(res => res.json())
            .then(result => {
                this.setState({ allOffers: result.offers })
            });
    }

    render() {
        return (
            <div>
                {this.props.pathContext.city.id}
                <br></br>
                {this.props.pathContext.ad_type.id}
            </div>
        )
    }
}
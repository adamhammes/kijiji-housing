import React from 'react'
import { StaticQuery, graphql, Link } from 'gatsby'

const query = graphql`{
  gatsbyKijijiJson {
    cities {
      id
      name_french
    }
    ad_types {
      id
    }
  }
}`;

class IndexPage extends React.Component {
  constructor(props) {
    super(props)

    const defaultState = {
      city: 'quebec',
      ad_type: 'rent',
    }

    this.state = defaultState;

    this.nextLink = this.nextLink.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  render() {
    return (
      <StaticQuery
        query={query}
        render={data => (
          <form onChange={this.onChange}>
            <div>
            {data.gatsbyKijijiJson.cities.map(c => (
              <label key={c.id}>
                <input
                  key={c.id}
                  type="radio"
                  name="city"
                  value={c.id}
                  defaultChecked={this.state.city === c.id}
                />
                {c.name_french}
              </label>
            ))}
            </div>
            <div>
            {data.gatsbyKijijiJson.ad_types.map(a => (
              <label key={a.id}>
                <input
                  key={a.id}
                  type="radio"
                  name="ad_type"
                  value={a.id}
                  defaultChecked={this.state.ad_type === a.id}
                />
                {a.id}
              </label>
            ))
            }</div>
            <Link to={this.nextLink()}>Allons-y !</Link>
          </form>
        )}
      />
    )
  }

  nextLink() {
    return `/${this.state.city}/${this.state.ad_type}`;
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }
}

export default IndexPage

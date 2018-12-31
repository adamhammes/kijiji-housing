import React from "react";
import { StaticQuery, graphql } from "gatsby";

import "./front-page.scss";
import { LocalizedLink, Message } from "../components/lib";

const query = graphql`
  {
    apiJson {
      cities {
        id
        name_french
      }
      ad_types {
        id
      }
    }
  }
`;

class IndexPage extends React.Component {
  constructor(props) {
    super(props);

    const defaultState = {
      city: "quebec",
      ad_type: "rent",
    };

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
            <h2>
              <Message>frontPage.lookingFor</Message>
            </h2>
            <div className="options-container">
              {data.apiJson.ad_types.map(a => (
                <label key={a.id}>
                  <input
                    key={a.id}
                    type="radio"
                    name="ad_type"
                    value={a.id}
                    defaultChecked={this.state.ad_type === a.id}
                  />
                  <Message>{`frontPage.${a.id}`}</Message>
                </label>
              ))}
            </div>
            <h2>
              <Message>frontPage.in</Message>
            </h2>
            <div className="options-container">
              {data.apiJson.cities.map(c => (
                <label key={c.id}>
                  <input
                    key={c.id}
                    type="radio"
                    name="city"
                    value={c.id}
                    defaultChecked={this.state.city === c.id}
                  />
                  <Message>{`cities.${c.id}`}</Message>
                </label>
              ))}
            </div>
            <LocalizedLink className="toOfferPage" to={this.nextLink()}>
              <Message>frontPage.letsGo</Message>
            </LocalizedLink>
          </form>
        )}
      />
    );
  }

  nextLink() {
    return `/${this.state.city}/${this.state.ad_type}/`;
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
}

export default IndexPage;

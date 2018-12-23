import React from "react";
import { StaticQuery, graphql, Link } from "gatsby";

import "../components/layout.css";

import "./front-page.scss";

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

    this.language = "fr";
  }

  render() {
    const { locale } = this.props.pageContext;

    return (
      <StaticQuery
        query={query}
        render={data => (
          <div className="front-page">
            <form onChange={this.onChange}>
              <h2>{locale.messages.frontPage.lookingFor}</h2>
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
                    {locale.messages.frontPage[a.id]}
                  </label>
                ))}
              </div>
              <h2>{locale.messages.frontPage.in}</h2>
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
                    {locale.messages.cities[c.id]}
                  </label>
                ))}
              </div>
              <Link to={this.nextLink()}>
                {locale.messages.frontPage.letsGo}
              </Link>
            </form>
          </div>
        )}
      />
    );
  }

  nextLink() {
    const language = this.props.pageContext.locale.language;
    return `/${language}/${this.state.city}/${this.state.ad_type}`;
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
}

export default IndexPage;

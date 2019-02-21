import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

const Organization = ({ organization }) => (
  <div>
    <p>
      <strong>Issues from Organization:</strong>
      <a href={organization.url}>{organization.name}</a>
    </p>
  </div>
);

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`
  },
});

const TITLE = 'React GraphQL Github Client';
const GET_ORGANIZATION = `
  {
    organization(login: "the-road-to-learn-react") {
      name
      url
    }
  }
`;

class App extends Component {

  state = {
    path: 'the-road-to-learn-react/the-road-to-learn-react',
  };

  componentDidMount() {
    this.onFetchFromGithub();
  }

  onChange = event => {
    this.setState({ path: event.target.value });
  };

  onFetchFromGithub = () => {
    axiosGitHubGraphQL
      .post('', { query: GET_ORGANIZATION })
      .then(result => {
        this.setState({
          organization: result.data.data.organization,
          errors: result.data.errors
        });
      });
  };

  onSubmit = event => {
    // fetch data
    event.preventDefault();
  };

  render() {
    const { path, organization } = this.state;

    return (
      <div className="App">
        <h1>{TITLE}</h1>

        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">
            Show open issues for https://github.com/
          </label>
          <input
            id="url"
            type="text"
            value={path}
            onChange={this.onChange}
            style={{ width: '300px' }}
          />
          <button type="submit">Search</button>
        </form>

        <hr />
        {/* Display results here */}
        {
          organization ? (
            <Organization organization={organization} />
          ) : (
            <p>No information yet...</p>
          )
        }
      </div>
    );
  }
}

export default App;

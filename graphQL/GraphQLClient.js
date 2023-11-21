const axios = require('axios');
const graphql = require('graphql');
const { print } = graphql;


// @param query - gql query
const makeQuery = async (graphqlEndpoint, authToken, query, variablesValues) => {
  try {
    const data = {
      query: print(query),
    };
    if (variablesValues) {
      Object.assign(data, {variables: variablesValues});
    }
    const graphqlData = await axios({
      url: graphqlEndpoint,
      method: 'post',
      headers: {
        'authorization': authToken
      },
      data
    });
    return graphqlData.data.data;
  } catch (err) {
    console.log('error posting to appsync: ', err);
    throw err;
  } 
}

module.exports = {
  makeQuery
}

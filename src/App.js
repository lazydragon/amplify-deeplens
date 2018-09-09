import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// load components
import AllHistory from "./Components/AllHistory";

// config amplify
import Amplify, {Auth}  from "aws-amplify";
import awsmobile from './aws-exports';

// include UI components
import { withAuthenticator } from 'aws-amplify-react';

// include appsync related
import { AUTH_TYPE } from "aws-appsync/lib/link/auth-link";
import AWSAppSyncClient from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { graphql, ApolloProvider, compose } from 'react-apollo';
import * as AWS from 'aws-sdk';
import AppSync from './AppSync.js';
import ListHistorys from './Queries/ListHistory';
import NewHistorySubscription from "./Queries/NewHistorySubscription";

// config amplify
Amplify.configure(awsmobile)
// Optionally add Debug Logging
// Amplify.Logger.LOG_LEVEL = 'DEBUG';

const client = new AWSAppSyncClient({
    url: AppSync.graphqlEndpoint,
    region: AppSync.region,
    auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey: AppSync.apiKey,

        // type: AUTH_TYPE.AWS_IAM,
        // Note - Testing purposes only
        /*credentials: new AWS.Credentials({
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY
        })*/

        // Amazon Cognito Federated Identities using AWS Amplify
        //credentials: () => Auth.currentCredentials(),

        // Amazon Cognito user pools using AWS Amplify
        //type: AUTH_TYPE.AMAZON_COGNITO_USER_POOLS, 
        //jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken(),
    },
});

class App extends Component {
  render() {
    return (
        <div>
            <AllHistoryWithData/>
        </div>
    );
  }
}

const sortFunction = function(a,b){
    const result = parseInt(b.visit_time) - parseInt(a.visit_time)
    //console.log(b.visit_time,a.visit_time,result)
    return result
}

const AllHistoryWithData = compose(
    graphql(ListHistorys, {
        options: {
            fetchPolicy: 'cache-and-network'
        },
        props: (props) => ({
            items: props.data.listHistorys && [...props.data.listHistorys.items].sort(sortFunction),
            subscribeToNewHistory: params => {
                props.data.subscribeToMore({
                    document: NewHistorySubscription,
                    updateQuery: (prev, { subscriptionData: { data : { onCreateHistory } } }) => {
                        console.log(onCreateHistory);
                        //console.log(prev)
                        let newdata = {
                            listHistorys: { 
                                items: [...prev.listHistorys.items.filter(history => history.id !== onCreateHistory.id), onCreateHistory].sort(sortFunction),
                                __typename: 'ModelHistoryConnection'
                            },
                        }
                        let result = {...prev, ...newdata} 
                        //console.log(newdata)
                        //console.log(result)
                        return result
                    }
                });
            },
        })
    })
)(AllHistory);


// apollo provider
const WithProvider = () => (
    <ApolloProvider client={client}>
        <Rehydrated>
            <App />
        </Rehydrated>
    </ApolloProvider>
);

// app with amplify auth
export default withAuthenticator(WithProvider);
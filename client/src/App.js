import logo from './logo.svg';
import './App.css';
import Test from './Components/Test';
import { ApolloProvider } from '@apollo/client';
import client from './shopify';

function App() {
  return (
      <ApolloProvider client={client}>
          <Test/>
      </ApolloProvider>
  );
}

export default App;

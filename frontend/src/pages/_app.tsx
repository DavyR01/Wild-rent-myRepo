import dynamic from "next/dynamic";
import type { AppProps } from "next/app";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import Layout from "@/components/Layout";

import "@/styles/globals.css"

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

// Disabling SSR
export default dynamic(() => Promise.resolve(App), { ssr: false });
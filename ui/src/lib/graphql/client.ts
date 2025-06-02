import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

// Create HTTP link to your GraphQL endpoint
const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

// Auth link to add authorization header
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from localStorage or your auth system
  const token =
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Error link to handle GraphQL errors
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`,
        );
      });
    }

    if (networkError) {
      console.error(`Network error: ${networkError}`);

      // Handle authentication errors
      if ("statusCode" in networkError && networkError.statusCode === 401) {
        // Clear auth token and redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
      }
    }
  },
);

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      UserDto: {
        keyFields: ["id"],
      },
      FriendDto: {
        keyFields: ["id"],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});

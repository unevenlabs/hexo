import { gql, useQuery } from "@apollo/client";

const GET_ITEMS = gql`
  query GetItems {
    items(first: 1000) {
      id
      color
      object
      generation
      customImageURI
      owner
    }
  }
`;

export const useGetItems = () => useQuery(GET_ITEMS);

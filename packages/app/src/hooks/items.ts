import { gql, useQuery } from "@apollo/client";

const GET_ITEMS = gql`
  query GetItems($first: Int, $skip: Int) {
    items(first: $first, skip: $skip) {
      id
      color
      object
      generation
      customImageURI
      owner
    }
  }
`;

export const useGetItems = (first: number, skip: number) =>
  useQuery(GET_ITEMS, { variables: { first, skip } });

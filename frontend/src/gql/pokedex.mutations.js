import gql from "graphql-tag";

export const CREATE_FAVORITE = gql`
  mutation CreateFavoriteMutation($id: ID!) {
    favoritePokemon(id: $id) {
      id
    }
  }
`;

export const UN_FAVORITE = gql`
  mutation CreateUnFavoriteMutation($id: ID!) {
    unFavoritePokemon(id: $id) {
      id
    }
  }
`;

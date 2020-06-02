import gql from "graphql-tag";

export const POKEMONBYID = gql`
  query pokemonById($id: ID!) {
    pokemonById(id: $id) {
      name
      id
      image
      isFavorite
      evolutions {
        name
        id
      }
    }
  }
`;

export const POKEMON_TYPES = gql`
  query pokemonTypes {
    pokemonTypes
  }
`;

export const POKEMONBYNAME = gql`
  query pokemonByName($name: String!) {
    pokemonByName(name: $name) {
      name
      id
      image
      isFavorite
    }
  }
`;

export const POKEMON_NAMES = gql`
  query pokemons {
    query: pokemons(query: { limit: 151, offset: 0 }) {
      edges {
        name
      }
    }
  }
`;

export const POKEMON_ALLDATA = gql`
  query pokemons {
    pokemonData: pokemons(query: { limit: 151, offset: 0 }) {
      edges {
        name
        id
        image
        isFavorite
        types
        height {
          maximum
          minimum
        }
        weight {
          maximum
          minimum
        }
        maxCP
        maxHP
        sound
        evolutions {
          id
          name
        }
      }
    }
  }
`;

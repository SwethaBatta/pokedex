# pokedex
Pokedex using Vuejs and GraphQL

### My learnings and relatability with React
```
- Scoped styles to keep styling confined to component without conflicting with other classes. Styling is in the same file, so it is easier with shorter class names
- Easy to use directives like v-model which can easily feed values to the template, React needed complex logic like if statements inside JSX
- Vuex state management - mutations, actions, getters (Similarity to state management in React)
- Infinite scrolling using v-inifinte-scroll logic which implements similar logic as Intersection API and observer. 
- Understood lifecycle hooks via fixing Active/disabled of Tab/View and default settings for the same
- Using computed() properties to speed up the application
- Using global Event bus to communicate between components
- Vue JS handles lazy loading at the route level of abstraction with the help of Webpack code splitting
- GraphQL queries and mutations
```
### Challenges faced:
```
- Favorite action between routes
Using event bus to favorite/un-favorite a pokemon between Grid/List page and Pokemon details page leads to incorrect results sometime due to the action being triggered multiple times. Debugging this currently.

- Lazy loading with filters. 
The current implementation only returns search results till the data loading is complete. Modifying code to use GraphQL query pokemonByName to return the appropriate result.

```

### Future to-do implementations
```
- Adding more details on Pokemon detail page. 
- Using color-picker to create a gradient background for pokemon details page based on dominant colors of a pokemon
- Using color-picker to create chips for pokemon type in Grid/List view cards based on dominant colors of a pokemon
- Adding a game section with throw pokemon ball animation which randomly chooses a pokemon and returns the details in a modal pop-up
- Using animation background for home page
- Adding toast notification for favorite action
- Adding more animations to button clicks and highlights to enhance user experience. 
- Complete lazy loading feature and test it in integration with filters
```

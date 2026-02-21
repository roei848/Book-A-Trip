# Frontend Code Style

- Functional components only, no class components
- styled-components for all styling — no CSS files
- camelCase for variables/functions, PascalCase for components/types
- Axios for all API calls via the api client
- No inline styles
- Styled components defined at the bottom of the component file
- Only the root wrapper is a styled component, named `{ComponentName}Wrapper`
- Inner elements use `className` props, not additional styled components

# Msg Converse

## GIT Conventions

-   Commit message pattern: `<feat | fix | chore> <short-description>`, [See more here](https://www.conventionalcommits.org/en/v1.0.0/#summary).
-   Examples: `chore: remove api types`, `feat: implement connection to OpenAI API`
-   Branch name pattern: `Task-XYZ-Short-Task-Description` (where CODINGBCRO-XYZ is the name of the task in Jira)
-   Merge request name pattern: `Task-XYZ: Short Description`
-   Remember to have the `Squash commits` checked before merging your MR.

## Getting Started

### Prerequisites

-   Have `Node.js` installed (>= v20.11.0)
-   Preferably use [NVM](https://github.com/coreybutler/nvm-windows) to quickly switch between versions

### Setup

-   Clone the repository
-   Run `npm install`
-   Run `npm run prepare` (just to be sure we have Git Hooks bootstrap, note this are run each time you commit / push changes)
-   Setup prettier in your IDE
-   Create `.env` file in the root of your repository and set up the required variables
-   Start the docker container using `docker-compose up -d` in the folder `./docker`
-   Run `npm run serve:api` for the backend
-   Run `npm run serve:ui` for the frontend

## Quick References

-   [Nx Docs](https://nx.dev/getting-started/intro)
-   [Container and Presentational Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
-   [Benefits of a Monorepo](https://nx.dev/latest/react/core-concepts/why-monorepos)

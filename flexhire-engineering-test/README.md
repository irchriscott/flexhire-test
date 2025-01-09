# Flexhire Engineering Test

This is a base project you can use to quickly kickstart your Flexhire Engineering Test.

## Platforms and Tools

You are provided with a `docker.sh` script so you can use docker to build a container
with the required platforms and tools installed

If the container is already running, use `docker exec -it flexhire-engineering-test bash` to open a shell into it

If you prefer, you can also avoid the container entirely. If you do, you will need to install the following:

- Node.js (version 20 should be best) with npm
- Ruby (version 3.3 should be best) 
- bundler and rails with `gem install bundler rails` to run bundler and rails commands

## Structure

- the `backend` folder contains an empty rails project you can use to build the backend side of the test.
    - SQlite is already set up as DB for simplicity
    - use `rails s` in the `backend` folder to start the server. It will be available at `localhost:3000`.
- the `frontend` folder contains an empty Next.js project you can use to build the frontend side of the test.
    - [Relay](https://relay.dev/) and [MUI](https://mui.com/core/) have already been set up in the project
    - Relay is set up to talk to the backend server at `localhost:3000/graphql`
    - MUI is set up so you can import and use components from `@mui/material`
    - the Next.js project is using the app router instead of the older pages router
    - use `npm run dev` in the `frontend` folder to start the server. It will be available at `localhost:8080`

## Setup

Note that the Flexhire GraphQL API schema is needed for Relay to work, but not included due to being changed frequently.

See instructions in `frontend/src/schema.graphql` to get the schema.

## Running the project

- run `rails s` in the `backend` folder to start the Rails server. It will be available at `localhost:3000`.
- run `npm run dev` in the `frontend` folder to start the Next.js server. It will be available at `localhost:8080`.

## Gotchas

- if you are using a container or virtualization, run rails with `rails s -b 0.0.0.0` for the port forwarding to work.
- run `npm run relay` to get relay to compile the types for the queries you wrote, otherwise you might get errors
- if you are using Relay in a component, make sure to mark it as a client component with `'use client';` otherwise Next.js will try to use it as a RSC (React Server Component) and it won't work

## More information

Chat with the hiring manager on Flexhire.com
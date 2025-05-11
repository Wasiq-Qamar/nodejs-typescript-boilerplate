# NODE TYPESCRIPT BOILERPLATE
This is the backend server for the ....

## SETUP
- Requires `Node v18.17.0`
- Run `npm install` to install all the dependencies
- Create a `.env` file inside the root dir to store env variables
    - **NODE_ENV**: The environment to run the service for
    - **MONGODB_URI**: An Atlas MongoDB URI string
    - **MONGODB_DATABASE**: The name to use for the database inside the Atlas MongoDB cluster
    - **ENABLE_STACK_TRACE**: `true/false`. Enables in-depth logging with stack trace

## Development Commands
- `npm run dev` - Start the development server
- `npm run compile` - Build the project
- `npm run start` - Start the production server
- `npm run lint` - Lint the project
- `npm run fix` - Fix linting errors
- `npm run test` - Run all tests
- `test:watch` - Run the tests and watch. For Windows

## Additional Notes
- A VS Code debugger has been set-up in this project to use breakpoints while debugging code
  - Run the debugger using the `Debug Backend` script

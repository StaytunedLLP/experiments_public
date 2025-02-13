
## Workspace Setup

The project uses workspaces to manage dependencies and modules. Here are the
steps to set up the workspaces:

1. Create a `package.json` file in the root directory with the following
   content:

   ```json
   {
     "workspaces": ["package2"]
   }
   ```

2. Create a `deno.json` file in the root directory with the following content:

   ```json
   {
     "workspace": ["deno-app"]
   }
   ```

These configurations ensure that the dependencies and modules are correctly
managed across the project.

## Project Setup Instructions

To set up and run the project, follow these steps:

1. Navigate to the `package2` directory, install dependencies, and build the
   project:

   ```bash
   cd package2 && npm install && npm run build && cd ..
   ```

2. Once the dependencies are installed and the project is built, navigate to the
   `deno-app` directory, install dependencies, and start the project:

   ```bash
   cd deno-app && deno install && deno task run
   ```

This will start the Deno application.

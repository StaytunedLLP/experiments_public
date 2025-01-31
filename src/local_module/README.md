# Project Setup Instructions

To set up and run the project, follow these steps:

1. Navigate to the `package1` directory and install dependencies:
   ```bash
   cd package1 && npm install && cd ..
   ```

2. Navigate to the `package2` directory, install dependencies, and build the
   project:
   ```bash
   cd package2 && npm install && npm run build && cd ..
   ```

3. Once the dependencies are installed and the project is built, navigate to the
   `deno-app` directory and start the project:
   ```bash
   cd deno-app && deno task run
   ```

This will start the Deno application.

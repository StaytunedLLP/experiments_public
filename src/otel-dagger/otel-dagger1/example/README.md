
# Dice Roll Service with OpenTelemetry Tracing

This project consists of two Deno applications:

* `main.ts`: A dice rolling service that generates random numbers and sends OpenTelemetry (OTel) traces.
* `getData.ts`: A simple OTLP (OpenTelemetry Protocol) collector that receives and logs the OTel data from the dice rolling service.

## Folder Structure

```
.
├── README.md      # This file
├── deno.json      # Configuration for the Deno application (main.ts)
├── deno.lock      # Lockfile for dependency management
├── getData.ts     # OTLP collector application
└── main.ts        # Dice rolling service application
```

## Prerequisites

* **Deno:** Make sure you have Deno installed. You can find installation instructions on the official [Deno website](https://deno.land/).

## Getting Started

### 1. Start the OTLP Collector (`getData.ts`)

The `getData.ts` application acts as a simple OTLP collector, receiving the telemetry data (traces) from the `main.ts` application.

Open a terminal and navigate to the project directory `example`.  Then, run the following command:

```bash
deno run --allow-net getData.ts
```

This command starts the OTLP collector on `http://localhost:8800`. The `--allow-net` flag is necessary to allow the application to listen for incoming network connections.  You should see a message in the console indicating that the server is running on port 8800. This server simply receives the OTLP/JSON data and logs it to the console.

**Why this is necessary:** The `getData.ts` server *must* be running *before* you start the `main.ts` server. This ensures that when `main.ts` starts generating traces, there's a collector available to receive them. If the collector isn't running, the traces from `main.ts` will be lost.

### 2. Start the Dice Roll Service (`main.ts`)

Open a *new* terminal window and navigate to the project directory `example`.  Run the following command:

```bash
deno task start
```

This command uses the `start` task defined in `deno.json`. The task sets several environment variables crucial for OpenTelemetry configuration and then executes the `main.ts` file.  Specifically:

* `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:8800`: Configures the OTLP exporter to send data to the collector running on `localhost:8800`.
* `OTEL_EXPORTER_OTLP_PROTOCOL=http/json`: Specifies that the OTLP data should be sent using the HTTP/JSON protocol. (JSON format)
* `OTEL_DENO_CONSOLE=true`:  (Probably not useful)Enables console exporter, if supported by the OpenTelemetry SDK
* `OTEL_DENO=true`: Enables automatic instrumentation for Deno runtime.
* `deno run --allow-all --unstable-otel main.ts`:  Runs the `main.ts` file.  `--allow-all` grants all necessary permissions to the application (network access, environment variable access, etc.).  `--unstable-otel` enables the OpenTelemetry API, which is currently an unstable feature in Deno.

**Why these environment variables are necessary:**  The OpenTelemetry SDK relies on environment variables for configuration. Without these variables, the SDK won't know where to send the telemetry data, what protocol to use, or whether to enable console output or Deno runtime instrumentation.

### 3. Generate Dice Rolls

With both servers running, open your web browser and navigate to `http://localhost:8000`.  This will send a request to the `main.ts` server, which will generate a set of dice rolls and return them as a JSON response in your browser.

### 4. Observe the Logs

In the terminal window where you started the `getData.ts` server, you should see the OTLP data logged to the console. This data will include information about the "rollTheDice" span, including the `rolls` attribute you set in the code, as well as information about the dice rolls themselves.  The logged data will be in JSON format and may be quite verbose.

**Example Log Output (from `getData.ts`):**

The output will be a complex JSON structure representing the OTLP data. It will include resources, scopes, and traces.  Within the traces, you should find spans related to the `rollTheDice` function. You'll see attributes like `rolls` (the number of dice rolled) and other metadata about the execution.

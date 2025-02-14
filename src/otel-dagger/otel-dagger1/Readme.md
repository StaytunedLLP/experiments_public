# OpenTelemetry with Dagger and Deno

## Running locally with Deno

Refer to [the example README](./example/README.md) for more details.

## Running with Dagger

To run the example with Dagger, follow these steps:

1. Navigate to the `src/otel-dagger/otel-dagger1` directory:

2. Run the following command to start the OTLP collector:

```bash
dagger call get-data --source=example up
```

3. Open a new terminal window and run the following command to start the dice rolling service:

```bash
dagger call base-service --source=example up
```

1. Open your web browser and navigate to `http://localhost:8800` to generate dice rolls.

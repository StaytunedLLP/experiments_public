import {
  Container,
  dag,
  Directory,
  func,
  object,
  Service,
} from "@dagger.io/dagger";

@object()
export class OtelDagger {
  @func()
  denoRunWithEnv(source: Directory): Promise<Service> {
    const service = dag
      .container()
      .from("denoland/deno:latest")
      .withDirectory("/app", source)
      .withWorkdir("/app")
      .withEnvVariable("OTEL_EXPORTER_OTLP_PROTOCOL", "http/json")
      .withEnvVariable("OTEL_DENO", "true")
      .withEnvVariable("OTEL_DENO_CONSOLE", "true")
      .withExec(["deno", "task", "start"])
      .withExposedPort(8800)
      .asService();
    return service;
  }

  @func()
  denoRunWithoutEnv(source: Directory): Promise<Service> {
    const service = dag
      .container()
      .from("denoland/deno:latest")
      .withDirectory("/app", source)
      .withWorkdir("/app")
      .withExec(["deno", "task", "start-with-env"])
      .withExposedPort(8800)
      .asService();
    return service;
  }

  @func()
  async getData(source: Directory): Promise<Service> {
    const service = dag
      .container()
      .from("denoland/deno:latest")
      .withDirectory("/app", source)
      .withWorkdir("/app")
      .withExec(["deno", "run", "-A", "getData.ts"])
      .withExposedPort(4318)
      .asService();
    return service;
  }
}

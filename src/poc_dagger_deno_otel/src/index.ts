/**
 * A generated module for PocDaggerDenoOtel functions
 *
 * This module has been generated via dagger init and serves as a reference to
 * basic module structure as you get started with Dagger.
 *
 * Two functions have been pre-created. You can modify, delete, or add to them,
 * as needed. They demonstrate usage of arguments and return types using simple
 * echo and grep commands. The functions can be called from the dagger CLI or
 * from one of the SDKs.
 *
 * The first line in this comment block is a short description line and the
 * rest is a long description with more detail on the module's purpose or usage,
 * if appropriate. All modules should have a short description.
 */
import {
  Container,
  dag,
  Directory,
  func,
  object,
  type Service,
} from "@dagger.io/dagger";

@object()
export class PocDaggerDenoOtel {
  /**
   * Returns a container that echoes whatever string argument is provided
   */
  @func()
  containerEcho(stringArg: string): Container {
    return dag.container().from("alpine:latest").withExec(["echo", stringArg]);
  }

  async denoRunWithoutEnv(source: Directory): Promise<Service> {
    return dag.container().from("denoland/deno:latest")
      .withDirectory("/app", source)
      .withWorkdir("/app")
      .withEnvVariable("OTEL_DENO", "true")
      .withExec(["deno", "task", "start-with-env"])
      .withExposedPort(8800)
      .asService();
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

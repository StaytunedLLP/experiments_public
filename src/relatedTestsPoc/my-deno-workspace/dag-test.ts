import { checkStagedDagTests } from "jsr:@staytuned/deno-dag-test";

const config = {
  baseFolders: ["features"], // Base directories to analyze
  testTask: "test", // The test task name (e.g., "test")
};

const result = await checkStagedDagTests(config);
if (!result.ok) {
  console.error(result.error);
}

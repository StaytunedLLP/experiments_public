// dw_nested/src/domain_one/feature_a/story_x/process_x.ts
// Import from shared remains the same
import { processDataYAsync } from "@my-app/domain_one/feature_a/story_y/process_y.ts";
import { logMessage } from "@my-app/shared/utils/common_helper.ts";
const MODULE_NAME = "DomainOne:FeatA:StoryX"

export function processDataX(data: string): string {
  logMessage(MODULE_NAME, `Processing X data: ${data}`)
  processDataYAsync(123)
  return `Processed X: ${data.toUpperCase()}`
}
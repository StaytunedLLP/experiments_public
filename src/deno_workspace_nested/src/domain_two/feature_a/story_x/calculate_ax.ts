// dw_nested/src/domain_two/feature_a/story_x/calculate_ax.ts
import { logMessage } from "@my-app/shared/utils/common_helper.ts" // Unchanged
// *** Import path UPDATED ***
import { processDataX } from "@my-app/domain_one/feature_a/story_x/process_x.ts"

const MODULE_NAME = "DomainTwo:FeatA:StoryX"

export function calculateResultAX(input: string): string {
  logMessage(MODULE_NAME, `Calculating AX based on input: ${input}`)
  const processed = processDataX(input)
  logMessage(MODULE_NAME, `Result from Domain One: ${processed}`)
  return `Final AX Result for ${input}`
}
// dw_nested/src/domain_two/feature_a/story_y/calculate_ay.ts
import { logMessage } from "@my-app/shared/utils/common_helper.ts" // Unchanged
// *** Import path UPDATED ***
import { processDataY } from "@my-app/domain_one/feature_a/story_y/process_y.ts"

const MODULE_NAME = "DomainTwo:FeatA:StoryY"

export function calculateResultAY(num: number): number {
  logMessage(MODULE_NAME, `Calculating AY based on number: ${num}`)
  const processedY = processDataY(num)
  logMessage(MODULE_NAME, `Processed Y value: ${processedY}`)
  return processedY + 100
}
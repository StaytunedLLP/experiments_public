// dw_nested/src/domain_one/feature_a/story_y/process_y.ts
import { logMessage } from "@my-app/shared/utils/common_helper.ts"; // Unchanged

const MODULE_NAME = "DomainOne:FeatA:StoryY"

export function processDataY(value: number): number {
  logMessage(MODULE_NAME, `Processing Y value: ${value}`)
  return value * 2
}

export const processDataYAsync = async (value: number): Promise<number> => {
  logMessage(MODULE_NAME, `Processing Y async value: ${value}`)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value * 2)
    }, 1000)
  })
}
// dw_nested/src/domain_two/feature_b/story_y/generate_by.ts
import { logMessage } from "@my-app/shared/utils/common_helper.ts" // Unchanged

const MODULE_NAME = "DomainTwo:FeatB:StoryY"

export function generateReportBY(criteria: string): { reportId: string; criteria: string } {
  logMessage(MODULE_NAME, `Generating report BY with criteria: ${criteria}`)
  return { reportId: `BY-Report-${Date.now()}`, criteria: criteria }
}
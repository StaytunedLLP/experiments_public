// dw_nested/src/domain_one/feature_b/story_y/handle_by.ts
import { logMessage } from "@my-app/shared/utils/common_helper.ts" // Unchanged

const MODULE_NAME = "DomainOne:FeatB:StoryY"

export function handleRequestBY(user: string): { status: string; user: string } {
  logMessage(MODULE_NAME, `Handling request BY for user: ${user}`)
  return { status: "Handled BY", user: user }
}
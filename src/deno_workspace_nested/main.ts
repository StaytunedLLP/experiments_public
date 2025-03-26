// dw_nested/main.ts
// *** All import paths UPDATED ***

// Imports from Domain One Stories
import { processDataX } from "@my-app/domain_one/feature_a/story_x/process_x.ts"
import { processDataY } from "@my-app/domain_one/feature_a/story_y/process_y.ts"
import { handleRequestBX } from "@my-app/domain_one/feature_b/story_x/handle_bx.ts"
import { handleRequestBY } from "@my-app/domain_one/feature_b/story_y/handle_by.ts"

// Imports from Domain Two Stories
import { calculateResultAX } from "@my-app/domain_two/feature_a/story_x/calculate_ax.ts"
import { calculateResultAY } from "@my-app/domain_two/feature_a/story_y/calculate_ay.ts"
import { generateReportBX } from "@my-app/domain_two/feature_b/story_x/generate_bx.ts"
import { generateReportBY } from "@my-app/domain_two/feature_b/story_y/generate_by.ts"

// ... (rest of main.ts remains the same) ...

console.log("--- Running Deno Workspace Demo ---")
console.log("\n--- Domain One ---")
const processedX = processDataX("hello world")
console.log("Main received:", processedX)
const processedY = processDataY(50)
console.log("Main received:", processedY)
const handledBX = handleRequestBX(123)
console.log("Main received:", handledBX)
const handledBY = handleRequestBY("alice")
console.log("Main received:", handledBY)

console.log("\n--- Domain Two ---")
const calculatedAX = calculateResultAX("test data")
console.log("Main received:", calculatedAX)
const calculatedAY = calculateResultAY(25)
console.log("Main received:", calculatedAY)
const generatedBX = generateReportBX({ info: "some data" })
console.log("Main received:", generatedBX)
const generatedBY = generateReportBY("urgent")
console.log("Main received:", generatedBY)

console.log("\n--- Demo Finished ---")
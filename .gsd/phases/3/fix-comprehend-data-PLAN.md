---
phase: 3
plan: fix-comprehend-data
wave: 1
gap_closure: true
---

# Fix Plan: Comprehend Data Gap

## Problem
The `ScrapeCompany` Lambda was created in Phase 1 and expects `sessionId` and `companyName` at the root of the request body. When called via Step Functions during Phase 3, the `sessionId` is nested under `sessionResult.sessionId`. The handler errors out with 400, causing the downstream `AnalyzeCompany` Lambda to bypass Comprehend due to missing text input.

## Tasks

<task type="auto">
  <name>Fix ScrapeCompany handler</name>
  <files>backend/functions/scrape_company/handler.py</files>
  <action>Update `session_id` logic to extract from `body.get("sessionResult", {}).get("sessionId")` if `body.get("sessionId")` is missing (same as `analyze_company` and `generate_brief`).</action>
  <verify>Code updated to support Step Functions nested invocation payload.</verify>
  <done>Code handles both API Gateway and Step Functions payloads.</done>
</task>

<task type="auto">
  <name>Deploy and Verify Pipeline Output</name>
  <files>backend/</files>
  <action>Rebuild, deploy, and trigger the pipeline. Confirm `extractedEntities` in DynamoDB has items.</action>
  <verify>Run the pipeline via `curl` and query DynamoDB.</verify>
  <done>Comprehend data successfully stored in DynamoDB `analysisResults` object.</done>
</task>

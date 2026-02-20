# STATE.md — Project Memory

> **Last Updated**: 2026-02-20T10:15:00-06:00
> **Current Phase**: 4 — Ready to Start
> **Status**: Planning Complete
> **Branch**: `master`
> **Last Updated**: Phase 4 Planning
> **Session**: 1

## Current Position
- **Phase**: 4 (Frontend & Two-Stage Workflow)
- **Task**: Planning complete
- **Status**: Ready for execution

## Next Steps
1. `/execute 4`

## Phase 1 Deliverables

### Backend (`backend/`)
- SAM template with S3, DynamoDB, API Gateway, 9 Lambda functions, Step Functions
- 7 shared service modules (DynamoDB, S3, Bedrock, Textract, Comprehend, Scraper, ResponseHelpers)
- Step Functions state machine (parallel scrape/parse → analyze → generate)
- Lambda Layer build system (boto3, requests, beautifulsoup4, python-docx)
- Mock company data for all 5 case studies
- Backend README with architecture diagram

### Frontend (`frontend/`)
- React app via Vite (build: ✅ 48 modules, 804ms)
- 4 routes: Home, Dashboard, Interviewee Portal, Interview Guide
- Premium dark-theme design system (Inter font, glassmorphism, animations)
- API service module with all endpoint stubs
- Amplify build spec (amplify.yml)

## Key Decisions
- React frontend (Amplify hosting only; backend via SAM)
- Amazon Bedrock with Claude 3.5 Sonnet
- Python 3.13 Lambda backend with shared Layer
- Textract for document processing (.docx → python-docx; PDF → Textract)
- Step Functions for pipeline orchestration
- Amazon Comprehend for NLP enrichment
- 72-hour hackathon (us-west-2, us-east-1)

## Decisions Log
| Date | Phase | Decision | Rationale |
|------|-------|----------|-----------|
| 02/20 | 1 | Architecture | AWS SAM + Lambda + React/Amplify. Chosen for rapid deployment and native integration with Bedrock/Step Functions. |
| 02/20 | 1 | LangChain vs SDK| Selected native `boto3` for Bedrock instead of LangChain to minimize cold starts and reduce dependency size. |
| 02/20 | 2 | API Auth | Open CORS for Hackathon MVP speed. Will lock down if time permits in Phase 6. |
| 02/20 | 3 | Bedrock Model | Switched default from `claude-3-5-sonnet-20241022-v2:0` in `us-east-1` to `us-west-2` due to AWS availability constraints for on-demand inference. |
| 02/20 | 3 | Gap Closure | Fixed DynamoDB Float serialization and S3 access policies to successfully process Comprehend NLP extraction. |

## Last Session Summary
Phase 4 (Frontend & Two-Stage Workflow) planning is complete. Generated 5 executable plans covering backend feedback/PDF endpoints, React setup with Tailwind maroon theme, the Interviewer Dashboard, Interviewee Portal, and final PDF generation merge logic.

## Next Steps
1. Run `/execute 4` to execute the 5 atomic plans for Phase 4.

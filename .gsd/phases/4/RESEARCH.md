---
phase: 4
level: 2
researched_at: 2026-02-20
---

# Phase 4 Research

## Questions Investigated
1. How to best implement Server-Side PDF Generation in an AWS Lambda function?
2. How to configure Tailwind CSS for the Texas A&M Maroon color palette?
3. What is the scope of the new `POST /session/{id}/feedback` endpoint?

## Findings

### Topic 1: Server-Side PDF Generation in Lambda
PDF generation in Lambda can be challenging due to C-library dependencies (e.g., `wkhtmltopdf` or Pango/Cairo for WeasyPrint). 
- **pdfkit/wkhtmltopdf:** Requires uploading a compiled binary of `wkhtmltopdf` as a Lambda layer. Powerful but brittle.
- **ReportLab:** Pure Python, but requires manual drawing of elements (no HTML-to-PDF). High learning curve for complex documents.
- **xhtml2pdf:** Pure Python tool that parses HTML/CSS and converts to PDF using ReportLab beneath the hood. 

**Recommendation:** Use `xhtml2pdf`. It is pure Python, making it trivial to add to our `requirements.txt` and package in the existing `SharedDepsLayer` without worrying about platform-specific C-bindings.

### Topic 2: Texas A&M Tailwind Configuration
Texas A&M's primary brand color is Aggie Maroon.
- Hex: `#500000`

**Recommendation:** Extend the tailwind configuration (`tailwind.config.js`) to include this primary color.
```javascript
theme: {
  extend: {
    colors: {
      maroon: {
        600: '#500000',
        700: '#3c0000',
      }
    }
  }
}
```

### Topic 3: Feedback Endpoint Architecture
The `POST /session/{id}/feedback` endpoint needs to update the session state.
- **Input:** JSON body containing `{ "corrections": "string", "selectedQuestions": ["q1", "q2"] }`
- **Action:** Update the DynamoDB item for `sessionId`, adding a `feedback` map and changing the `status` to `FEEDBACK_RECEIVED`.
- **Output:** Returns success message and the updated session metadata.

## Decisions Made
| Decision | Choice | Rationale |
|----------|--------|-----------|
| PDF Library | `xhtml2pdf` | Pure Python, easy to bundle in SAM Lambda layer. |
| Styling Theme | Tailwind with Custom Maroon | Matches Texas A&M identity requested by user. |
| Feedback UX | UI-level merge | Frontend will fetch the session and inject feedback above the guide rather than re-running Claude. |

## Patterns to Follow
- Use `xhtml2pdf` to render a Jinja2 or simple string-formatted HTML template.
- Return Base64 encoded PDF from the Lambda straight to the client with `Content-Type: application/pdf`, or upload to S3 and return a presigned URL. (Base64 is easier if the PDF is small).

## Dependencies Identified
| Package | Version | Purpose |
|---------|---------|---------|
| `xhtml2pdf` | `~0.2.11` | Server-side HTML to PDF generation |
| `tailwindcss` | `^3.4.0` | Desktop-first React styling |

## Ready for Planning
- [x] Questions answered
- [x] Approach selected
- [x] Dependencies identified

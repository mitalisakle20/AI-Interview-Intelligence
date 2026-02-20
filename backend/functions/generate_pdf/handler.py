import json
import logging
import base64
import io
from xhtml2pdf import pisa
from user_agent import generate_user_agent
from urllib.request import Request, urlopen

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        body_str = event.get('body', '{}')
        if event.get('isBase64Encoded', False):
            body_str = base64.b64decode(body_str).decode('utf-8')
            
        body = json.loads(body_str)
        html_content = body.get('html_content')
        
        if not html_content:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({"error": "Missing html_content in request body"})
            }
            
        # Create a BytesIO buffer to hold the PDF
        result_file = io.BytesIO()
        
        # Convert HTML to PDF
        pisa_status = pisa.CreatePDF(
            html_content,                # the HTML to convert
            dest=result_file             # file handle to receive result
        )
        
        if pisa_status.err:
            logger.error(f"Error generating PDF: {pisa_status.err}")
            return {
                "statusCode": 500,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({"error": "Failed to generate PDF"})
            }
            
        # Get the value of the BytesIO buffer and base64 encode it
        pdf_bytes = result_file.getvalue()
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
        
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=\"InterviewIQ_Report.pdf\"",
                "Access-Control-Allow-Origin": "*"
            },
            "body": pdf_base64,
            "isBase64Encoded": True
        }
        
    except Exception as e:
        logger.error(f"Exception generating PDF: {str(e)}")
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": str(e)})
        }

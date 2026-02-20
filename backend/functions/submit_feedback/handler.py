import json
import logging
from shared.response_helpers import success_response, error_response, parse_body
from shared.dynamo_service import DynamoDBService

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        session_id = event.get('pathParameters', {}).get('sessionId')
        if not session_id:
            return error_response("Missing sessionId in path", 400)
            
        body = parse_body(event)
        corrections = body.get('corrections', '')
        selected_questions = body.get('selectedQuestions', [])
        
        db = DynamoDBService()
        session = db.get_session(session_id)
        if not session:
            return error_response(f"Session {session_id} not found", 404)
            
        # Update session with feedback
        feedback_data = {
            "corrections": corrections,
            "selectedQuestions": selected_questions
        }
        
        db.update_session(session_id, session["createdAt"], {
            "feedback": feedback_data,
            "status": "FEEDBACK_RECEIVED"
        })
        
        return success_response({
            "message": "Feedback submitted successfully",
            "sessionId": session_id,
            "status": "FEEDBACK_RECEIVED"
        })
        
    except ValueError as e:
        return error_response(str(e), 400)
    except Exception as e:
        logger.error(f"Error submitting feedback: {str(e)}")
        return error_response("Internal server error", 500)

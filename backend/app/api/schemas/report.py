from pydantic import BaseModel

class GenerateRequest(BaseModel):
    upload_id: int


class GenerateResponse(BaseModel):
    report_id: int
    result: str

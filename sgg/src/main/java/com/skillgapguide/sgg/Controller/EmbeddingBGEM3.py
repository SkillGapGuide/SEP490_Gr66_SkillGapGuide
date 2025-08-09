# from FlagEmbedding import BGEM3FlagModel
from sentence_transformers import SentenceTransformer
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Nhúng văn bản thành vector
# model = BGEM3FlagModel('BAAI/bge-m3', use_fp16=True)
modelv2 = SentenceTransformer("nomic-ai/nomic-embed-text-v2-moe", trust_remote_code=True)
modelv15 = SentenceTransformer("nomic-ai/nomic-embed-text-v1.5", trust_remote_code=True)
class TextInput(BaseModel):
    text: str
@app.post("/embed_nomicv1.5")
def get_embedding(input: TextInput):
    vector = modelv15.encode(input.text).tolist()
    return {"embedding": vector}
@app.post("/embed_nomicv2")
def get_embedding(input: TextInput):
    vector = modelv2.encode(input.text).tolist()
    return {"embedding": vector}
# Chạy server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

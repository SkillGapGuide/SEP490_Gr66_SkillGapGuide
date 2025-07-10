from FlagEmbedding import BGEM3FlagModel
import mysql.connector
import json

# Kết nối MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="12345678",
    database="skill_gap_guide"
)
cursor = conn.cursor()

# Nhúng văn bản thành vector
model = BGEM3FlagModel('BAAI/bge-m3', use_fp16=False)
text = "kỹ năng lập trình Java"
output = model.encode([text], return_dense=True)
vector = output['dense_vecs'][0].tolist()  # Chuyển numpy array thành list

# Lưu vào MySQL
sql = "INSERT INTO text_embeddings (text_content, embedding_json) VALUES (%s, %s)"
val = (text, json.dumps(vector))
cursor.execute(sql, val)
conn.commit()

# Đóng kết nối
cursor.close()
conn.close()

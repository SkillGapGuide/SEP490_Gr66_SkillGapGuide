● 📋 Detailed Instructions to Run EmbeddingBGEM3.py

  Step 1: Navigate to the Python file directory

  cd
  /opt/SEP490_Gr66_SkillGapGuide/sgg/src/main/java/com/skillgapguide/sgg/Controller/

  Step 2: Install required Python dependencies

  pip3 install fastapi uvicorn sentence-transformers pydantic

  Or if you need specific versions:
  pip3 install fastapi==0.104.1 uvicorn[standard]==0.24.0 sentence-transformers==2.2.2
   pydantic==2.5.0

  Step 3: Download the Nomic AI models (First time only)

  The models will be downloaded automatically when you first run the service:
  - nomic-ai/nomic-embed-text-v1.5 (~1.5GB)
  - nomic-ai/nomic-embed-text-v2-moe (~4GB)

  ⚠️ Note: This may take several minutes depending on your internet connection.

  Step 4: Run the Python embedding service

  python3 EmbeddingBGEM3.py

  You should see output like:
  INFO:     Started server process [12345]
  INFO:     Waiting for application startup.
  INFO:     Application startup complete.
  INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)

  Step 5: Test the service endpoints

  Open another terminal and test:

  Test Nomic v1.5 endpoint:
  curl -X POST "http://localhost:8000/embed_nomicv1.5" \
       -H "Content-Type: application/json" \
       -d '{"text": "search_query: Java programming"}'

  Test Nomic v2 endpoint:
  curl -X POST "http://localhost:8000/embed_nomicv2" \
       -H "Content-Type: application/json" \
       -d '{"text": "search_query: Python development"}'

  Step 6: Run your Spring Boot application

  In a new terminal:
  cd /opt/SEP490_Gr66_SkillGapGuide/sgg
  ./mvnw spring-boot:run

  🔧 System Requirements:

  - RAM: At least 8GB (models are large)
  - Storage: ~6GB free space for models
  - GPU: Optional but recommended for faster inference

  🚀 Running in background (optional):

  nohup python3 EmbeddingBGEM3.py > embedding_service.log 2>&1 &

  📊 Monitor the service:

  # Check if service is running
  curl http://localhost:8000
  # View logs
  tail -f embedding_service.log

● Update Todos
  ⎿  ☒ Provide detailed instructions for running EmbeddingBGEM3.py

● The service provides exactly the endpoints your Java EmbedService expects:
  - /embed_nomicv1.5 - for fetchEmbeddingNomicv15() method
  - /embed_nomicv2 - for fetchEmbeddingNomicv2() method

  Both endpoints return real embeddings using Nomic AI models, not mock data!


# Aravind E S — Master Experience & Project Reference

Kerala, India | +91 9496915905 | mail4aravindes@gmail.com | linkedin.com/in/aravind-es

This is the complete, unabridged reference compiled from all resume variants (AI/ML, Software Engineering, Edge/ADAS, Harman-Agentic, Hybrid). Each resume surfaces a subset of this content, framed for its target audience. Use this file as the source of truth when tailoring a new resume, writing a cover letter, or prepping for an interview.

---

## Experience

### Tata Elxsi — AI Software Engineer
**Dec 2024 – Present | Kerala, India**

#### Sub-project: Agentic Inventory Intelligence Platform
- Architected a production LLM agent enforcing read-only access, validated queries, and Pydantic schemas to eliminate hallucinated responses on live operational data.
- Engineered a RAG layer grounding agent reasoning in operating procedures and domain rules alongside real-time database state.
- Implemented Redis caching and an asynchronous skill-discovery agent that mines usage patterns for reusable query skills without adding user-facing latency.
- Engineered the platform's data layer (RFID, track-switch telegrams, PostgreSQL, Redis) to reconstruct real-time inventory location and movement state from fused sensor input.
- Owned migration of the core data layer from SQLite to PostgreSQL and Azure PostgreSQL, improving query performance and reliability for concurrent production workloads.

#### Sub-project: Real-Time Perception & Collision Prediction
- Developed and optimized real-time perception inference pipelines using TensorRT, CUDA, and NVIDIA Jetson for production automotive applications, reducing model inference latency by approximately 25%.
- Developed low-latency vehicle perception pipelines combining radar, camera, GPS, and vehicle-state signals for real-time collision-risk analysis, with multithreaded processing.
- **Delivered a collision-warning system that achieved U.S. safety certification for production deployment.** *(Note: this certification belongs to the collision-warning/ADAS system — not the inventory platform.)*

#### Sub-project: Computer Vision & Edge Deployment
- Deployed and optimized computer-vision workloads (YOLO, SAM 2.1 zero-shot, OCR/VLM, multi-camera tracking, camera calibration) on NVIDIA Jetson, adapting pipelines to constrained compute, memory, and power budgets.
- Optimized RTSP streaming pipelines using FFMPEG and GStreamer, improving video delivery stability by approximately 30% under unstable network conditions.
- Performed debugging, profiling, and system-level optimization, reducing end-to-end processing latency by approximately 20% in real-time perception pipelines.

---

### Tata Elxsi — AI Software Developer Intern
**Jan 2024 – Jun 2024 | Kerala, India**

- Developed modified YOLO architectures with dual detection heads to extend detection capabilities on pretrained models.
- Built radar point-cloud processing pipelines using ROS for real-time perception systems.
- Developed a multi-camera streaming backend service using sockets and multithreading for real-time inference systems.

---

## Projects

### Real-Time ADAS Perception & Collision Warning System
*ONNX, TensorRT, CUDA, NVIDIA Jetson — 2026*
- Engineered an edge-deployed ADAS perception pipeline combining camera-based ego-path detection with radar and GPS signals for real-time vehicle-risk analysis.
- Optimized TwinLiteNetPlus inference using ONNX and TensorRT/CUDA for low-latency deployment on NVIDIA Jetson hardware.
- Designed a sensor-fusion pipeline integrating radar, camera, and GPS/vehicle-state data, improving collision-risk estimation over single-sensor approaches.
- Achieved U.S. safety certification for the collision-warning system, validating it for production deployment.
- Implemented real-time perception and warning pipelines with hardware-aware inference optimization for embedded automotive environments.

### Agentic AI Clinical Fall Intelligence Platform
*FastAPI, MCP, LLM Tool Calling, Docker — 2025*
- Engineered an agentic clinical platform enabling LLM-driven analysis of patient fall-risk data through controlled backend tools (MCP) rather than unrestricted model access.
- Deployed containerized services on AWS EC2 with Nginx reverse proxying for isolated, production-style API routing.

### Goal Progress & Rehabilitation Intelligence Platform
*Python, FastAPI, Pydantic, LLMs — 2026*
- Engineered a rehabilitation progress-tracking platform where care staff define weighted patient goals, tasks, and milestones, with progress computed from structured activity logs.
- Designed a deterministic progress engine computing completion, velocity, and deviation as the source of truth, decoupled from a separate LLM analysis layer that interprets evidence for strengths, blockers, and timeline risk.
- Established validated Pydantic data contracts as the interface between the analytics engine and the AI review layer.

---

## Technical Skills (Master List)

**AI/ML & Computer Vision:** YOLO, SAM 2.1 (Zero-Shot), TwinLiteNetPlus, OCR/VLM, OpenCV, Camera Calibration, Multi-Camera Tracking, Deep Learning, Model Optimization, QLoRA, TensorRT, CUDA, ONNX, MLflow

**GenAI & Agentic AI:** LLM Agents, LLM Engineering, RAG, Agentic Workflows, Tool Calling, MCP, LangChain, LlamaIndex, Pydantic Schema Validation

**Edge & Sensor Systems:** NVIDIA Jetson, Edge Inference, ROS, Radar Point Clouds, Sensor Fusion (Camera/GPS/Vehicle State), Low-Latency Pipeline Design, Multithreading, Concurrent Processing

**Languages:** Python, C++, C, SQL, TypeScript

**Backend & APIs:** FastAPI, Flask, REST APIs, Microservices, Pydantic, JWT Authentication, Celery

**Databases & Caching:** PostgreSQL, SQLite, Redis

**Cloud & Deployment:** Docker, Kubernetes, AWS EC2, AWS Bedrock, SageMaker, Azure, Google Cloud, Nginx, Git, GitHub Actions

**Software Engineering Fundamentals:** Data Structures, Algorithms, OOP, Design Patterns, System Design

**Networking & Streaming:** RTSP, FFMPEG, GStreamer, TCP/IP, Socket Programming, Linux

---

## Certifications

- AWS Certified AI Practitioner
- AI Engineer Core Track: LLM Engineering, RAG, Agents, QLoRA
- Google Cloud Skill Badges
- OpenCV Bootcamp
- C Programming for Embedded Applications
- Deep Learning A–Z: Neural Networks and Artificial Intelligence

## Achievements

- Rising Star Award — Tata Elxsi, for contributions to production automotive and edge AI platforms

## Education

- **Master of Computer Applications (MCA)** — Cochin University of Science and Technology, Kerala, India (2022 – 2024)
- **Bachelor of Science in Physics** — Mary Matha Arts and Science College, Kerala, India (2018 – 2021)

---

## Usage Notes

- **Gaps to be honest about in interviews:** ElasticSearch, ScyllaDB, PyTorch model training, and CosmosDB have not been confirmed as hands-on experience — do not claim these without qualification.
- **The safety certification belongs to the collision-warning/ADAS system, not the inventory platform.** Keep this distinction correct across every resume and interview answer.
- Each resume variant should keep this same factual base — only framing, emphasis, and sub-project ordering should change per target role.
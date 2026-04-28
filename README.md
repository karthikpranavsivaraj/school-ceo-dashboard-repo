# Institutional Intelligence Platform

A production-grade microservices system designed for school CEOs, teachers, students, and parents.

## 🏗️ Architecture
- **Monorepo**: Managed with NPM Workspaces.
- **Backend**: Node.js (TypeScript) with Express.
- **Event-Driven**: Webhook-based integration for analytics and triggers.
- **DevOps**: Fully containerized (Docker), orchestrated (Kubernetes), and monitored (Prometheus/Grafana).

## 📁 Project Structure
- `services/`: Independent microservices (Identity, Student, Teacher, etc.)
- `shared/`: Shared libraries and types.
- `infrastructure/`: Docker, K8s, and Monitoring configs.
- `scripts/`: Utility scripts for deployment and maintenance.

## 🚀 Getting Started
1. Install dependencies: `npm install`
2. Build all services: `npm run build`
3. Run locally: `npm run dev` (per service)
4. Run with Docker: `docker-compose up --build`
5. Deploy to K8s: `kubectl apply -f infrastructure/k8s/`

## 🛠️ Phase Status
- [x] Phase 0: Project Foundation
- [x] Phase 1: Core Microservices
- [x] Phase 2: Event-Driven Architecture
- [x] Phase 3: Analytics & CEO Layer
- [x] Phase 4: Containerization
- [x] Phase 5: Orchestration
- [x] Phase 6: Monitoring & Observability
- [x] Phase 7: CI/CD Pipeline

## 🔄 CI/CD Automation
The project includes a `Jenkinsfile` that automates:
1. **Validation**: NPM install and TypeScript build check.
2. **Dockerization**: Builds optimized images for all 7 services.
3. **Registry**: Pushes images to a private/public Docker registry.
4. **Orchestration**: Automatically deploys/updates the Kubernetes cluster in the `institutional-platform` namespace.

To trigger the pipeline, configure a Git webhook in your repository settings pointing to your Jenkins instance.

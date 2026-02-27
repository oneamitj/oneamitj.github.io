# AWS Expertise Deep Dive

## Overview
- AWS is Amit's primary cloud platform with 8+ years of expert-level experience
- Spearheaded Leapfrog Technology's AWS Generative AI Competency and APN Advanced membership
- Architected 10+ production-level solutions on AWS

## AWS Services Used in Production

### Compute
- **EC2:** General compute instances for various workloads
- **ECS (Elastic Container Service):** Container orchestration for microservices
- **EKS (Elastic Kubernetes Service):** Managed Kubernetes for complex container workloads (used in Evoke Medical Care project)
- **Lambda:** Serverless compute — extensively used across GenAI, healthcare, and data projects. Core to the Addy AI HIPAA-compliant architecture.

### AI/ML
- **Bedrock:** Expert-level usage as the primary GenAI platform. Used for LLM integration, RAG systems, and the GenAI R&D Platform. Amit views Bedrock as a "model marketplace" / "model switchboard."
- **Textract:** Advanced-level document processing and OCR. Used in document processing pipelines.

### Storage
- **S3:** Object storage across all projects. Also used as S3 Vector for vector storage in GenAI applications.

### Database
- **RDS:** Managed relational databases (PostgreSQL, MySQL) used in multiple projects including Vyaguta LMS and Mindera.
- **DynamoDB:** NoSQL database with 3+ years of advanced experience.
- **Amazon Aurora:** High-performance relational database.

### Data & Analytics
- **AWS Glue:** ETL service used in the Mindera Skin Atlas data warehouse project.
- **OpenSearch:** Used for vector search in RAG systems and log analytics.

### Networking & Load Balancing
- **Elastic Load Balancing:** Used in NxVision and other production systems.

### Infrastructure as Code
- **CloudFormation:** 5+ years of advanced experience. Used in NxVision and other projects.
- Also uses Terraform (Expert, 6+ years) and Pulumi (Advanced, 2+ years) as IaC tools on AWS.

### CI/CD
- **AWS CodePipeline:** Part of the CI/CD toolchain.
- Primary CI/CD through GitHub Actions (Expert, 5+ years).

### Frontend
- **AWS Amplify:** Used in the Mindera project for frontend hosting.

### Monitoring
- **CloudWatch:** AWS-native monitoring across all AWS projects.
- Supplemented with Prometheus, Grafana, and ELK Stack.

### Security & Compliance
- Deep expertise in AWS security best practices
- HIPAA-compliant architecture design on AWS
- SOC2 compliance implementation on AWS
- IAM policy design and management
- Multi-tenant data isolation patterns on AWS

## AWS Partnership Achievements
- Led Leapfrog Technology to achieve AWS APN Advanced Partner status
- Spearheaded AWS Generative AI Competency certification for the company
- These are significant partnership milestones that demonstrate organizational-level AWS expertise

## AWS Architecture Patterns Amit Has Implemented
1. **HIPAA-Compliant Multi-Tenant Serverless:** Data isolation, rapid tenant onboarding, Lambda-based processing
2. **RAG Architecture on Bedrock:** OpenSearch/Pinecone vector stores, Bedrock for LLM inference, Lambda for orchestration
3. **Real-Time ETL Pipelines:** Migration from batch-based to near real-time processing using AWS Glue and Lambda
4. **Hybrid Cloud:** Seamless integration between AWS cloud and in-house databases
5. **Microservices on ECS/EKS:** Container orchestration with automated CI/CD
6. **Serverless API Architecture:** Lambda + API Gateway patterns for scalable APIs
7. **Data Warehouse:** S3 + Glue + RDS patterns for multi-source data integration

## Amit's Views on AWS Strategy
From his "Dawn of the Agents" presentation:
- AWS is positioning Bedrock as the "model switchboard" — run any model on their infrastructure
- AWS strategy is not model supremacy but Choice + Governance + Integration
- Foundation models are becoming commoditized infrastructure
- The real value is in the agent layer built on top of models
- AWS AgentCore is "more like a controlled workflow engine than true autonomous intelligence — and that's not bad" because enterprises need predictability
- "AWS ≠ Only GenAI Cloud — and that's OK. Choice beats supremacy."

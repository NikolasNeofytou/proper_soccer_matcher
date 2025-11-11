# Deployment & Infrastructure Guide

## Overview

This guide covers deployment strategies, infrastructure setup, and operational procedures for Proper Soccer Matcher.

## Table of Contents

- [Environments](#environments)
- [Infrastructure Architecture](#infrastructure-architecture)
- [Deployment Process](#deployment-process)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Logging](#monitoring--logging)
- [Backup & Recovery](#backup--recovery)
- [Security](#security)
- [Scaling](#scaling)
- [Cost Optimization](#cost-optimization)

## Environments

### Development
- **Purpose**: Local development and testing
- **URL**: http://localhost:3000
- **Database**: Local PostgreSQL
- **Features**: Hot reload, debug mode, test data

### Staging
- **Purpose**: Pre-production testing
- **URL**: https://staging.propersoccermatcher.com
- **Database**: Staging PostgreSQL (isolated)
- **Features**: Production-like environment, test payments

### Production
- **Purpose**: Live application
- **URL**: https://propersoccermatcher.com
- **Database**: Production PostgreSQL (replicated)
- **Features**: High availability, monitoring, backups

## Infrastructure Architecture

### Cloud Provider: AWS (Primary)

```
┌─────────────────────────────────────────────────────┐
│                  CloudFlare CDN                      │
│              (SSL/TLS, DDoS Protection)              │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│             Application Load Balancer                │
│              (us-east-1, us-west-2)                  │
└─────────────────────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
┌──────────────────┐          ┌──────────────────┐
│   EKS Cluster    │          │   EKS Cluster    │
│   us-east-1      │          │   us-west-2      │
│                  │          │                  │
│  - API Pods      │          │  - API Pods      │
│  - Worker Pods   │          │  - Worker Pods   │
│  - WebSocket     │          │  - WebSocket     │
└──────────────────┘          └──────────────────┘
          │                             │
          └──────────────┬──────────────┘
                         ▼
          ┌──────────────────────────────┐
          │     Data Layer (Multi-AZ)    │
          │                              │
          │  - RDS PostgreSQL            │
          │  - ElastiCache Redis         │
          │  - Elasticsearch Service     │
          │  - S3 (Images/Files)         │
          └──────────────────────────────┘
```

### AWS Services Used

#### Compute
- **EKS (Elastic Kubernetes Service)**: Container orchestration
- **EC2**: Worker nodes for EKS
- **Lambda**: Serverless functions for background tasks
- **Fargate**: Serverless container execution (optional)

#### Database & Storage
- **RDS PostgreSQL**: Primary database (Multi-AZ)
- **ElastiCache Redis**: Caching and session storage
- **Elasticsearch Service**: Full-text search
- **S3**: Object storage for images and files
- **EBS**: Persistent volumes

#### Networking
- **VPC**: Isolated network environment
- **ALB**: Application Load Balancer
- **Route53**: DNS management
- **CloudFront**: CDN (secondary to CloudFlare)

#### Security
- **IAM**: Identity and access management
- **Secrets Manager**: Credential storage
- **KMS**: Encryption key management
- **WAF**: Web application firewall
- **Shield**: DDoS protection

#### Monitoring
- **CloudWatch**: Logs and metrics
- **X-Ray**: Distributed tracing
- **SNS**: Alerting
- **SES**: Email delivery

## Deployment Process

### Prerequisites

```bash
# Install required tools
brew install kubectl helm terraform aws-cli

# Configure AWS CLI
aws configure

# Set up kubectl context
aws eks update-kubeconfig --name proper-soccer-matcher-prod
```

### Infrastructure as Code (Terraform)

```hcl
# terraform/main.tf
terraform {
  required_version = ">= 1.0"
  
  backend "s3" {
    bucket = "proper-soccer-matcher-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# VPC
module "vpc" {
  source = "./modules/vpc"
  
  name = "proper-soccer-matcher-vpc"
  cidr = "10.0.0.0/16"
  azs  = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

# EKS Cluster
module "eks" {
  source = "./modules/eks"
  
  cluster_name = "proper-soccer-matcher-prod"
  vpc_id       = module.vpc.vpc_id
  subnet_ids   = module.vpc.private_subnet_ids
}

# RDS PostgreSQL
module "database" {
  source = "./modules/rds"
  
  identifier     = "proper-soccer-matcher-db"
  engine_version = "15.4"
  instance_class = "db.r6g.xlarge"
  multi_az       = true
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.database_subnet_ids
}
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: 123456789.dkr.ecr.us-east-1.amazonaws.com/proper-soccer-matcher-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secrets
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: production
spec:
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

### Deployment Commands

```bash
# Build Docker image
docker build -t proper-soccer-matcher-api:latest .

# Tag for ECR
docker tag proper-soccer-matcher-api:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/proper-soccer-matcher-api:latest

# Push to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.us-east-1.amazonaws.com
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/proper-soccer-matcher-api:latest

# Apply Kubernetes manifests
kubectl apply -f k8s/

# Update deployment
kubectl set image deployment/api \
  api=123456789.dkr.ecr.us-east-1.amazonaws.com/proper-soccer-matcher-api:v1.2.3 \
  -n production

# Check rollout status
kubectl rollout status deployment/api -n production

# Rollback if needed
kubectl rollout undo deployment/api -n production
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm test -- --coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v2
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: us-east-1
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v1
    
    - name: Build and push Docker image
      env:
        ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        IMAGE_TAG: ${{ github.sha }}
      run: |
        docker build -t $ECR_REGISTRY/proper-soccer-matcher-api:$IMAGE_TAG .
        docker push $ECR_REGISTRY/proper-soccer-matcher-api:$IMAGE_TAG
        docker tag $ECR_REGISTRY/proper-soccer-matcher-api:$IMAGE_TAG \
          $ECR_REGISTRY/proper-soccer-matcher-api:latest
        docker push $ECR_REGISTRY/proper-soccer-matcher-api:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Configure kubectl
      uses: azure/setup-kubectl@v3
    
    - name: Update kubeconfig
      run: |
        aws eks update-kubeconfig --name proper-soccer-matcher-prod
    
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/api \
          api=${{ steps.login-ecr.outputs.registry }}/proper-soccer-matcher-api:${{ github.sha }} \
          -n production
        kubectl rollout status deployment/api -n production
    
    - name: Notify Slack
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Monitoring & Logging

### Prometheus + Grafana

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
      action: keep
      regex: true
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
      action: replace
      target_label: __metrics_path__
      regex: (.+)
```

### Key Metrics to Monitor

```javascript
// Example metrics collection in Node.js
const prometheus = require('prom-client');

// Request duration
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

// Database query duration
const dbQueryDuration = new prometheus.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries',
  labelNames: ['query_type'],
});

// Active users
const activeUsers = new prometheus.Gauge({
  name: 'active_users_total',
  help: 'Number of currently active users',
});

// Bookings created
const bookingsCreated = new prometheus.Counter({
  name: 'bookings_created_total',
  help: 'Total number of bookings created',
  labelNames: ['status'],
});
```

### Logging with ELK Stack

```javascript
// Winston logger configuration
const winston = require('winston');
const { ElasticsearchTransport } = require('winston-elasticsearch');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new ElasticsearchTransport({
      level: 'info',
      clientOpts: { 
        node: process.env.ELASTICSEARCH_URL,
      },
      index: 'logs-api',
    }),
  ],
});
```

## Backup & Recovery

### Database Backup Strategy

```bash
#!/bin/bash
# backup-database.sh

# Configuration
BACKUP_DIR="/backups/postgresql"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME | \
  gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/backup_$TIMESTAMP.sql.gz \
  s3://proper-soccer-matcher-backups/database/

# Remove old backups
find $BACKUP_DIR -type f -mtime +$RETENTION_DAYS -delete

# Remove old S3 backups
aws s3 ls s3://proper-soccer-matcher-backups/database/ | \
  while read -r line; do
    createDate=$(echo $line | awk {'print $1" "$2'})
    createDate=$(date -d "$createDate" +%s)
    olderThan=$(date -d "$RETENTION_DAYS days ago" +%s)
    if [[ $createDate -lt $olderThan ]]; then
      fileName=$(echo $line | awk {'print $4'})
      aws s3 rm s3://proper-soccer-matcher-backups/database/$fileName
    fi
  done
```

### Automated Backups (RDS)

```hcl
# terraform/rds.tf
resource "aws_db_instance" "main" {
  # ... other configuration ...
  
  backup_retention_period = 30
  backup_window          = "03:00-04:00"
  maintenance_window     = "Mon:04:00-Mon:05:00"
  
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  
  deletion_protection = true
  skip_final_snapshot = false
  final_snapshot_identifier = "proper-soccer-matcher-final-${timestamp()}"
}
```

### Disaster Recovery Plan

1. **RPO (Recovery Point Objective)**: 1 hour
2. **RTO (Recovery Time Objective)**: 4 hours
3. **Backup frequency**: Continuous (transaction logs) + Daily snapshots
4. **Geographic redundancy**: Cross-region replication

## Security

### SSL/TLS Configuration

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name propersoccermatcher.com;
    
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
```

### Secrets Management

```bash
# Store secrets in AWS Secrets Manager
aws secretsmanager create-secret \
  --name proper-soccer-matcher/prod/database \
  --secret-string '{"username":"admin","password":"securepass"}'

# Retrieve in application
const secret = await secretsManager
  .getSecretValue({ SecretId: 'proper-soccer-matcher/prod/database' })
  .promise();
```

## Scaling

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Database Scaling

- **Read Replicas**: For read-heavy workloads
- **Connection Pooling**: PgBouncer with 100 connections
- **Caching**: Redis for frequently accessed data
- **Sharding**: Consider for 10M+ users

## Cost Optimization

### Cost Breakdown (Estimated Monthly)

- **Compute (EKS)**: $500-1000
- **Database (RDS)**: $400-800
- **Cache (Redis)**: $100-200
- **Storage (S3)**: $50-150
- **CDN (CloudFlare)**: $0-200
- **Monitoring**: $100-200
- **Data Transfer**: $100-300

**Total**: ~$1,250-2,850/month

### Optimization Strategies

1. **Reserved Instances**: 40% savings on compute
2. **Spot Instances**: For non-critical workloads
3. **S3 Intelligent Tiering**: Automatic cost optimization
4. **CloudFront**: Reduce data transfer costs
5. **Right-sizing**: Monitor and adjust instance sizes
6. **Cleanup**: Remove unused resources regularly

## Operations Runbook

### Common Operations

```bash
# Scale deployment
kubectl scale deployment api --replicas=5 -n production

# View logs
kubectl logs -f deployment/api -n production

# Execute command in pod
kubectl exec -it <pod-name> -n production -- /bin/bash

# Port forward for debugging
kubectl port-forward svc/api-service 8080:80 -n production

# Database connection
kubectl run -it --rm psql --image=postgres:15 --restart=Never -- \
  psql -h <db-host> -U <username> -d <database>
```

### Troubleshooting

See detailed troubleshooting guide in [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

**Maintained by**: DevOps Team  
**Last Updated**: 2025-01-15  
**Review Schedule**: Quarterly

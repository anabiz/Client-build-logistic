# Infrastructure Deployment - Enhanced Version

Infrastructure as Code for deploying the enhanced Logistic Application to Azure Kubernetes Service (AKS) with monitoring stack.

## Architecture

```
Internet → Load Balancer → API Gateway → Microservices
                                      ↓
                              Azure PostgreSQL
                                      ↓
                                   Kafka
                                      ↓
                            Prometheus + Grafana
```

## Enhanced Features

### Monitoring Stack
- **Prometheus**: Metrics collection from all services
- **Grafana**: Visual dashboards with pre-configured panels
- **Kafka UI**: Real-time queue monitoring interface
- **Alert Manager**: Automated alerting for critical issues

### Auto-Scaling
- **Horizontal Pod Autoscaler**: CPU/Memory based scaling
- **Vertical Pod Autoscaler**: Resource optimization
- **Cluster Autoscaler**: Node scaling based on demand

### Security Enhancements
- **Network Policies**: Pod-to-pod communication control
- **RBAC**: Role-based access control
- **Secret Management**: Azure Key Vault integration
- **SSL/TLS**: Automatic certificate management

## Prerequisites

- **Azure CLI** installed and logged in
- **Terraform** v1.0+
- **Docker** for image building
- **kubectl** for cluster management
- **Helm** for package management

## Quick Deployment

### Windows (PowerShell)
```powershell
.\infrastructure\deploy.ps1
```

### Linux/macOS (Bash)
```bash
chmod +x infrastructure/deploy.sh
./infrastructure/deploy.sh
```

## Manual Deployment Steps

### 1. Deploy Infrastructure
```bash
cd infrastructure/terraform
terraform init
terraform plan -var="environment=production"
terraform apply
```

### 2. Build & Push Images
```bash
# Get ACR name from Terraform output
ACR_NAME=$(terraform output -raw acr_login_server)

# Login to ACR
az acr login --name ${ACR_NAME%%.*}

# Build and push all images
cd ../../backend
docker build -f docker/ApiGateway.Dockerfile -t $ACR_NAME/api-gateway:latest .
docker push $ACR_NAME/api-gateway:latest

# Repeat for all services...
```

### 3. Deploy to Kubernetes
```bash
# Configure kubectl
az aks get-credentials --resource-group rg-logistic-app --name aks-logistic-app

# Deploy manifests
cd ../infrastructure/k8s
kubectl apply -f namespace.yaml
kubectl apply -f secrets.yaml
kubectl apply -f kafka.yaml
kubectl apply -f microservices.yaml
kubectl apply -f api-gateway.yaml
kubectl apply -f monitoring.yaml
```

## Resources Created

### Azure Resources
- **Resource Group**: `rg-logistic-app`
- **AKS Cluster**: `aks-logistic-app` (2-10 nodes, auto-scaling)
- **Container Registry**: `acrlogisticapp{random}`
- **PostgreSQL**: `psql-logistic-{random}` (Flexible Server)
- **Key Vault**: `kv-logistic-{random}` (Secrets management)
- **Log Analytics**: `law-logistic-{random}` (Monitoring)
- **Application Insights**: `ai-logistic-{random}` (APM)

### Kubernetes Resources
- **Namespace**: `logistic-app`
- **Deployments**: All microservices + monitoring stack
- **Services**: LoadBalancer for API Gateway, ClusterIP for internal
- **ConfigMaps**: Application configuration
- **Secrets**: Database credentials, API keys
- **HPA**: Horizontal Pod Autoscalers for all services
- **NetworkPolicies**: Security policies

## Enhanced Monitoring

### Grafana Dashboards
- **Application Overview**: Service health, request rates, errors
- **Infrastructure**: Node metrics, pod resources, network
- **Business Metrics**: Items processed, delivery rates, user activity
- **Kafka Monitoring**: Topic throughput, consumer lag, broker health

### Prometheus Metrics
```yaml
# Custom application metrics
logistic_items_total{status="delivered"}
logistic_delivery_duration_seconds
logistic_rider_performance_score
logistic_batch_processing_time
```

### Alerting Rules
- **High Error Rate**: >5% error rate for 5 minutes
- **High Response Time**: >2s average response time
- **Pod Restart**: Frequent pod restarts
- **Resource Usage**: >80% CPU/Memory usage
- **Kafka Lag**: Consumer lag >1000 messages

## Access Application

```bash
# Get external IPs
kubectl get services -n logistic-app

# Access points
API_GATEWAY_IP=$(kubectl get service api-gateway -n logistic-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
GRAFANA_IP=$(kubectl get service grafana -n logistic-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

echo "API Gateway: http://$API_GATEWAY_IP"
echo "Grafana: http://$GRAFANA_IP:3000 (admin/admin123)"
echo "Swagger: http://$API_GATEWAY_IP/swagger"
```

## Scaling Operations

### Manual Scaling
```bash
# Scale microservices
kubectl scale deployment user-service --replicas=5 -n logistic-app
kubectl scale deployment item-service --replicas=5 -n logistic-app

# Scale AKS nodes
az aks scale --resource-group rg-logistic-app --name aks-logistic-app --node-count 5
```

### Auto-Scaling Configuration
```yaml
# HPA example
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: user-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: user-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Security Configuration

### Network Policies
```yaml
# Allow only API Gateway to access microservices
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: microservice-policy
spec:
  podSelector:
    matchLabels:
      tier: microservice
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api-gateway
```

### RBAC Configuration
```bash
# Create service account with limited permissions
kubectl create serviceaccount logistic-app-sa -n logistic-app
kubectl create rolebinding logistic-app-binding \
  --clusterrole=view \
  --serviceaccount=logistic-app:logistic-app-sa \
  -n logistic-app
```

## Backup & Disaster Recovery

### Database Backup
```bash
# Automated daily backups
az postgres flexible-server backup create \
  --resource-group rg-logistic-app \
  --server-name psql-logistic-{random} \
  --backup-name daily-backup-$(date +%Y%m%d)
```

### Application Backup
```bash
# Backup Kubernetes resources
kubectl get all -n logistic-app -o yaml > logistic-app-backup.yaml

# Backup persistent volumes
velero backup create logistic-app-backup --include-namespaces logistic-app
```

## Performance Optimization

### Resource Requests/Limits
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### Caching Strategy
- **Redis**: Session and application caching
- **CDN**: Static asset delivery
- **Database**: Query result caching
- **API**: Response caching with TTL

## Cost Optimization

### Resource Sizing
- **AKS Nodes**: Standard_B2s (2 vCPUs, 4GB RAM) - $60/month
- **PostgreSQL**: B_Standard_B1ms (1 vCore, 2GB RAM) - $25/month
- **Storage**: Premium SSD 128GB - $20/month
- **Load Balancer**: Standard - $18/month
- **Container Registry**: Basic - $5/month

**Total Estimated Cost**: ~$200-300/month

### Cost Reduction Tips
- Use **Spot Instances** for non-critical workloads
- Enable **Auto-shutdown** for development environments
- Implement **Resource quotas** to prevent over-provisioning
- Use **Reserved Instances** for production workloads

## Troubleshooting

### Common Issues
```bash
# Check pod status
kubectl get pods -n logistic-app

# View pod logs
kubectl logs -f deployment/user-service -n logistic-app

# Check service endpoints
kubectl get endpoints -n logistic-app

# Describe problematic resources
kubectl describe pod <pod-name> -n logistic-app
```

### Health Checks
```bash
# API Gateway health
curl http://$API_GATEWAY_IP/health

# Individual service health
kubectl port-forward service/user-service 8080:80 -n logistic-app
curl http://localhost:8080/health
```

## Monitoring & Alerting

### Grafana Access
```bash
# Get Grafana URL
GRAFANA_IP=$(kubectl get service grafana -n logistic-app -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
echo "Grafana: http://$GRAFANA_IP:3000"
echo "Username: admin"
echo "Password: admin123"
```

### Prometheus Queries
```promql
# Request rate
rate(http_requests_total[5m])

# Error rate
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])

# Response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))
```

## Cleanup

```bash
# Delete Kubernetes resources
kubectl delete namespace logistic-app

# Destroy Azure infrastructure
cd infrastructure/terraform
terraform destroy
```

## Support & Documentation

- **API Documentation**: [../backend/API_ENDPOINTS_ENHANCED.md](../backend/API_ENDPOINTS_ENHANCED.md)
- **Frontend Integration**: [../backend/FRONTEND_API_MAPPING_ENHANCED.md](../backend/FRONTEND_API_MAPPING_ENHANCED.md)
- **Monitoring Runbook**: [monitoring-runbook.md](monitoring-runbook.md)
- **Security Guidelines**: [security-guidelines.md](security-guidelines.md)

This enhanced infrastructure provides production-ready deployment with comprehensive monitoring, auto-scaling, and security features optimized for the Nigerian logistics market.
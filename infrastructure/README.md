# Azure Kubernetes Deployment

Infrastructure as Code for deploying the Logistic Application to Azure Kubernetes Service (AKS).

## Architecture

```
Internet → Load Balancer → API Gateway → Microservices
                                      ↓
                              Azure PostgreSQL
                                      ↓
                                   Kafka
```

## Prerequisites

- **Azure CLI** installed and logged in
- **Terraform** installed
- **Docker** installed
- **kubectl** installed

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
# ... repeat for all services
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
```

## Resources Created

### Azure Resources
- **Resource Group**: `rg-logistic-app`
- **AKS Cluster**: `aks-logistic-app` (2 nodes, Standard_B2s)
- **Container Registry**: `acrlogisticapp{random}`
- **PostgreSQL**: `psql-logistic-{random}` (Flexible Server)
- **Databases**: `logistic_users`, `logistic_items`, `logistic_deliveries`

### Kubernetes Resources
- **Namespace**: `logistic-app`
- **Deployments**: API Gateway, User Service, Item Service, Delivery Service, Notification Service, Kafka, Zookeeper
- **Services**: LoadBalancer for API Gateway, ClusterIP for microservices
- **Secrets**: Database connection strings, Kafka configuration

## Access Application

```bash
# Get external IP
kubectl get service api-gateway -n logistic-app

# Access Swagger UI
curl http://<EXTERNAL-IP>/swagger
```

## Scaling

```bash
# Scale microservices
kubectl scale deployment user-service --replicas=3 -n logistic-app
kubectl scale deployment item-service --replicas=3 -n logistic-app

# Scale AKS nodes
az aks scale --resource-group rg-logistic-app --name aks-logistic-app --node-count 3
```

## Monitoring

```bash
# View pods
kubectl get pods -n logistic-app

# View logs
kubectl logs -f deployment/api-gateway -n logistic-app

# View services
kubectl get services -n logistic-app
```

## Cleanup

```bash
# Delete Kubernetes resources
kubectl delete namespace logistic-app

# Destroy Azure infrastructure
cd infrastructure/terraform
terraform destroy
```

## Cost Optimization

- **AKS**: Standard_B2s nodes (2 vCPUs, 4GB RAM)
- **PostgreSQL**: B_Standard_B1ms (1 vCore, 2GB RAM)
- **ACR**: Basic tier
- **Estimated monthly cost**: ~$150-200 USD

## Security Features

- **Network isolation** with Kubernetes namespaces
- **Secrets management** with Kubernetes secrets
- **Container registry** with admin access
- **PostgreSQL** with SSL enforcement
- **Role-based access** for AKS to ACR
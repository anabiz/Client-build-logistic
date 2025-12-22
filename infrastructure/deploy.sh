#!/bin/bash

# Azure Kubernetes Deployment Script for Logistic Application

set -e

echo "=== Logistic Application - Azure Deployment ==="

# Variables
RESOURCE_GROUP="rg-logistic-app"
LOCATION="eastus"
ACR_NAME=""
AKS_NAME=""

# Step 1: Deploy Infrastructure with Terraform
echo "Step 1: Deploying Azure infrastructure with Terraform..."
cd infrastructure/terraform
terraform init
terraform plan -out=tfplan
terraform apply tfplan

# Get outputs
ACR_NAME=$(terraform output -raw acr_login_server)
AKS_NAME=$(terraform output -raw aks_cluster_name)
RESOURCE_GROUP=$(terraform output -raw resource_group_name)
POSTGRESQL_FQDN=$(terraform output -raw postgresql_fqdn)

echo "ACR: $ACR_NAME"
echo "AKS: $AKS_NAME"

# Step 2: Build and Push Docker Images
echo "Step 2: Building and pushing Docker images to ACR..."
cd ../../backend

# Login to ACR
az acr login --name ${ACR_NAME%%.*}

# Build and push images
docker build -f docker/ApiGateway.Dockerfile -t $ACR_NAME/api-gateway:latest .
docker push $ACR_NAME/api-gateway:latest

docker build -f docker/UserService.Dockerfile -t $ACR_NAME/user-service:latest .
docker push $ACR_NAME/user-service:latest

docker build -f docker/ItemService.Dockerfile -t $ACR_NAME/item-service:latest .
docker push $ACR_NAME/item-service:latest

docker build -f docker/DeliveryService.Dockerfile -t $ACR_NAME/delivery-service:latest .
docker push $ACR_NAME/delivery-service:latest

docker build -f docker/NotificationService.Dockerfile -t $ACR_NAME/notification-service:latest .
docker push $ACR_NAME/notification-service:latest

# Step 3: Configure kubectl
echo "Step 3: Configuring kubectl..."
az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME --overwrite-existing

# Step 4: Update Kubernetes manifests
echo "Step 4: Updating Kubernetes manifests..."
cd ../infrastructure/k8s

# Replace placeholders
sed -i "s|ACR_LOGIN_SERVER|$ACR_NAME|g" microservices.yaml
sed -i "s|ACR_LOGIN_SERVER|$ACR_NAME|g" api-gateway.yaml
sed -i "s|POSTGRESQL_FQDN|$POSTGRESQL_FQDN|g" secrets.yaml
sed -i "s|DB_PASSWORD|LogisticApp123!|g" secrets.yaml

# Step 5: Deploy to Kubernetes
echo "Step 5: Deploying to Kubernetes..."
kubectl apply -f namespace.yaml
kubectl apply -f secrets.yaml
kubectl apply -f kafka.yaml
kubectl apply -f microservices.yaml
kubectl apply -f api-gateway.yaml
kubectl apply -f monitoring.yaml

# Wait for deployments
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment --all -n logistic-app

# Get external IP
echo "Getting service endpoints..."
kubectl get service api-gateway -n logistic-app
kubectl get service grafana -n logistic-app

echo "=== Deployment Complete ==="
echo "API Gateway: kubectl get service api-gateway -n logistic-app"
echo "Grafana: kubectl get service grafana -n logistic-app (admin/admin123)"
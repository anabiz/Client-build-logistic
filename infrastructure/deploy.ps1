# Azure Kubernetes Deployment Script for Logistic Application (PowerShell)

Write-Host "=== Logistic Application - Azure Deployment ===" -ForegroundColor Green

# Variables
$RESOURCE_GROUP = "rg-logistic-app"
$LOCATION = "eastus"

try {
    # Step 1: Deploy Infrastructure with Terraform
    Write-Host "Step 1: Deploying Azure infrastructure with Terraform..." -ForegroundColor Yellow
    Set-Location infrastructure\terraform
    terraform init
    terraform plan -out=tfplan
    terraform apply tfplan

    # Get outputs
    $ACR_NAME = terraform output -raw acr_login_server
    $AKS_NAME = terraform output -raw aks_cluster_name
    $RESOURCE_GROUP = terraform output -raw resource_group_name
    $POSTGRESQL_FQDN = terraform output -raw postgresql_fqdn

    Write-Host "ACR: $ACR_NAME" -ForegroundColor Cyan
    Write-Host "AKS: $AKS_NAME" -ForegroundColor Cyan

    # Step 2: Build and Push Docker Images
    Write-Host "Step 2: Building and pushing Docker images to ACR..." -ForegroundColor Yellow
    Set-Location ..\..\backend

    # Login to ACR
    $ACR_SHORT_NAME = $ACR_NAME.Split('.')[0]
    az acr login --name $ACR_SHORT_NAME

    # Build and push images
    docker build -f docker/ApiGateway.Dockerfile -t "$ACR_NAME/api-gateway:latest" .
    docker push "$ACR_NAME/api-gateway:latest"

    docker build -f docker/UserService.Dockerfile -t "$ACR_NAME/user-service:latest" .
    docker push "$ACR_NAME/user-service:latest"

    docker build -f docker/ItemService.Dockerfile -t "$ACR_NAME/item-service:latest" .
    docker push "$ACR_NAME/item-service:latest"

    docker build -f docker/DeliveryService.Dockerfile -t "$ACR_NAME/delivery-service:latest" .
    docker push "$ACR_NAME/delivery-service:latest"

    docker build -f docker/NotificationService.Dockerfile -t "$ACR_NAME/notification-service:latest" .
    docker push "$ACR_NAME/notification-service:latest"

    # Step 3: Configure kubectl
    Write-Host "Step 3: Configuring kubectl..." -ForegroundColor Yellow
    az aks get-credentials --resource-group $RESOURCE_GROUP --name $AKS_NAME --overwrite-existing

    # Step 4: Update Kubernetes manifests
    Write-Host "Step 4: Updating Kubernetes manifests..." -ForegroundColor Yellow
    Set-Location ..\infrastructure\k8s

    # Replace placeholders
    (Get-Content microservices.yaml) -replace 'ACR_LOGIN_SERVER', $ACR_NAME | Set-Content microservices.yaml
    (Get-Content api-gateway.yaml) -replace 'ACR_LOGIN_SERVER', $ACR_NAME | Set-Content api-gateway.yaml
    (Get-Content secrets.yaml) -replace 'POSTGRESQL_FQDN', $POSTGRESQL_FQDN | Set-Content secrets.yaml
    (Get-Content secrets.yaml) -replace 'DB_PASSWORD', 'LogisticApp123!' | Set-Content secrets.yaml

    # Step 5: Deploy to Kubernetes
    Write-Host "Step 5: Deploying to Kubernetes..." -ForegroundColor Yellow
    kubectl apply -f namespace.yaml
    kubectl apply -f secrets.yaml
    kubectl apply -f kafka.yaml
    kubectl apply -f microservices.yaml
    kubectl apply -f api-gateway.yaml
    kubectl apply -f monitoring.yaml

    # Wait for deployments
    Write-Host "Waiting for deployments to be ready..." -ForegroundColor Yellow
    kubectl wait --for=condition=available --timeout=300s deployment --all -n logistic-app

    # Get external IP
    Write-Host "Getting service endpoints..." -ForegroundColor Yellow
    kubectl get service api-gateway -n logistic-app
    kubectl get service grafana -n logistic-app

    Write-Host "=== Deployment Complete ===" -ForegroundColor Green
    Write-Host "API Gateway: kubectl get service api-gateway -n logistic-app" -ForegroundColor Cyan
    Write-Host "Grafana: kubectl get service grafana -n logistic-app (admin/admin123)" -ForegroundColor Cyan

} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}
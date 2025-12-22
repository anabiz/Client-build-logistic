terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "logistic_rg" {
  name     = "rg-logistic-app"
  location = "East US"
}

# Container Registry
resource "azurerm_container_registry" "logistic_acr" {
  name                = "acrlogisticapp${random_string.suffix.result}"
  resource_group_name = azurerm_resource_group.logistic_rg.name
  location            = azurerm_resource_group.logistic_rg.location
  sku                 = "Basic"
  admin_enabled       = true
}

# PostgreSQL Flexible Server
resource "azurerm_postgresql_flexible_server" "logistic_db" {
  name                   = "psql-logistic-${random_string.suffix.result}"
  resource_group_name    = azurerm_resource_group.logistic_rg.name
  location               = azurerm_resource_group.logistic_rg.location
  version                = "15"
  administrator_login    = "postgres"
  administrator_password = var.db_password
  storage_mb             = 32768
  sku_name               = "B_Standard_B1ms"
}

# PostgreSQL Databases
resource "azurerm_postgresql_flexible_server_database" "users_db" {
  name      = "logistic_users"
  server_id = azurerm_postgresql_flexible_server.logistic_db.id
}

resource "azurerm_postgresql_flexible_server_database" "items_db" {
  name      = "logistic_items"
  server_id = azurerm_postgresql_flexible_server.logistic_db.id
}

resource "azurerm_postgresql_flexible_server_database" "deliveries_db" {
  name      = "logistic_deliveries"
  server_id = azurerm_postgresql_flexible_server.logistic_db.id
}

# AKS Cluster
resource "azurerm_kubernetes_cluster" "logistic_aks" {
  name                = "aks-logistic-app"
  location            = azurerm_resource_group.logistic_rg.location
  resource_group_name = azurerm_resource_group.logistic_rg.name
  dns_prefix          = "logistic-aks"

  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "Standard_B2s"
  }

  identity {
    type = "SystemAssigned"
  }
}

# ACR Role Assignment
resource "azurerm_role_assignment" "aks_acr_pull" {
  principal_id                     = azurerm_kubernetes_cluster.logistic_aks.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = azurerm_container_registry.logistic_acr.id
  skip_service_principal_aad_check = true
}

# Random suffix for unique names
resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}
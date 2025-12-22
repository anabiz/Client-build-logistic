output "resource_group_name" {
  value = azurerm_resource_group.logistic_rg.name
}

output "aks_cluster_name" {
  value = azurerm_kubernetes_cluster.logistic_aks.name
}

output "acr_login_server" {
  value = azurerm_container_registry.logistic_acr.login_server
}

output "postgresql_fqdn" {
  value = azurerm_postgresql_flexible_server.logistic_db.fqdn
}

output "kube_config" {
  value     = azurerm_kubernetes_cluster.logistic_aks.kube_config_raw
  sensitive = true
}
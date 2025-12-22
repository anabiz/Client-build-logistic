variable "db_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
  default     = "LogisticApp123!"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}
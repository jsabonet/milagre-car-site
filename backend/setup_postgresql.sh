#!/bin/bash
# Script para configurar PostgreSQL para Milagre Car

echo "🗄️ Configurando PostgreSQL para Milagre Car..."

# Criar banco de dados PostgreSQL com as credenciais do Joel
# Execute estes comandos no psql como superusuário ou com o usuário joellasmim

echo "Execute os seguintes comandos no PostgreSQL:"
echo ""
echo "# Como superusuário postgres:"
echo "CREATE DATABASE milagre_car_db OWNER joellasmim;"
echo ""
echo "# Ou se joellasmim já tem privilégios:"
echo "CREATE DATABASE milagre_car_db;"
echo ""
echo "# Verificar se a conexão funciona:"
echo "psql -U joellasmim -d milagre_car_db -h localhost"
echo ""
echo "✅ DATABASE_URL já configurado no .env:"
echo "DATABASE_URL=postgresql://joellasmim:jossilene@localhost:5432/milagre_car_db"

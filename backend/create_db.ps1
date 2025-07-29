# Script para criar banco PostgreSQL para desenvolvimento

Write-Host "🗄️ Criando banco de dados PostgreSQL para desenvolvimento..." -ForegroundColor Green

# Substitua pelos seus dados de conexão
$PG_USER = "SEU_USUARIO"
$PG_HOST = "localhost"
$PG_PORT = "5432"

Write-Host "`n📋 Executando criação do banco..." -ForegroundColor Yellow

# Criar banco de dados (se não existir)
try {
    Write-Host "Criando banco 'milagre_car_db'..." -ForegroundColor White
    psql -U $PG_USER -h $PG_HOST -p $PG_PORT -c "CREATE DATABASE milagre_car_db;" postgres
    Write-Host "✅ Banco criado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Banco já existe ou erro na criação" -ForegroundColor Yellow
}

Write-Host "`n🔧 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Atualize o .env com suas credenciais" -ForegroundColor White
Write-Host "2. Execute: python manage.py makemigrations" -ForegroundColor White
Write-Host "3. Execute: python manage.py migrate" -ForegroundColor White
Write-Host "4. Execute: python manage.py createsuperuser" -ForegroundColor White

# Script PowerShell para configurar PostgreSQL no Windows

Write-Host "🗄️ Configurando PostgreSQL para Milagre Car no Windows..." -ForegroundColor Green

Write-Host "`n📋 Comandos para executar no pgAdmin ou psql:" -ForegroundColor Yellow
Write-Host "1. Abra o pgAdmin ou conecte via psql com o usuário joellasmim" -ForegroundColor White
Write-Host "2. Execute o seguinte comando:" -ForegroundColor White
Write-Host ""
Write-Host "CREATE DATABASE milagre_car_db;" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 Credenciais configuradas:" -ForegroundColor White
Write-Host "Usuário: joellasmim" -ForegroundColor Green
Write-Host "Senha: jossilene" -ForegroundColor Green  
Write-Host "Banco: milagre_car_db" -ForegroundColor Green
Write-Host "Host: localhost:5432" -ForegroundColor Green
Write-Host ""
Write-Host "✅ DATABASE_URL já configurado no .env!" -ForegroundColor Green
Write-Host "DATABASE_URL=postgresql://joellasmim:jossilene@localhost:5432/milagre_car_db" -ForegroundColor Cyan

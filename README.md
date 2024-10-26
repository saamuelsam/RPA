# RPA para Tiny ERP

## Descrição
Este sistema de RPA lê os pedidos do Tiny ERP, verifica a lista de CEPs de entrega e adiciona os novos clientes a uma planilha do Google Sheets. Também pode ser configurado para rodar periodicamente com cron jobs e enviar notificações em caso de erro.

## Estrutura de Pastas
- `/config`: Arquivos de configuração para APIs externas (Tiny ERP, Google Sheets).
- `/controllers`: Lógica de negócio (validação de CEPs, dia de entrega).
- `/services`: Integrações com APIs externas (Tiny ERP, Google Sheets).
- `/jobs`: Tarefas de sincronização periódica.
- `/utils`: Funções utilitárias (logger, envio de e-mails).

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-repositorio.git

# Instruções de Configuração do Projeto

### Passos iniciais: 

1. Execute o comando para instalar as dependências do projeto:
   ```bash
   npm install
   ```

2. Crie um banco de dados PostgreSQL no DBeaver ou PgAdmin com o nome **eacelera-dev**.

3. Na raiz do projeto, crie um arquivo `.env`.

4. Adicione a seguinte variável de ambiente ao arquivo `.env` para configurar a conexão com o banco de dados:
   ```env
   DATABASE_URL=postgres://{seu_usuario}:{sua_senha}@localhost:5432/eacelera-dev
   ```
   Substitua `{seu_usuario}` e `{sua_senha}` pelos seus dados de acesso ao banco no DBeaver ou PgAdmin.

---

# Gerenciamento de Migrações

### Aplicar migrações no ambiente local:

- Para aplicar as migrações pendentes no banco de dados de desenvolvimento local, use o comando:
   ```bash
   npx prisma migrate dev
   ```

### Aplicar migrações no ambiente de Staging:

- Para aplicar migrações no banco de dados do ambiente de staging, utilize:
   ```bash
   npx prisma migrate deploy
   ```

# Criar Migrações

- Para gerar uma nova migração no ambiente local, use o seguinte comando, substituindo `{nome_da_migracao}` por uma descrição da migração:
   ```bash
   npx prisma migrate dev --name {nome_da_migracao}
   ```

   **Importante:**
   - Sempre crie as migrações localmente, na sua branch de desenvolvimento. 
   - Nunca crie ou aplique migrações diretamente na branch de staging.
   - Certifique-se de que o diretório `prisma/migrations` seja comitado no repositório Git após a criação das migrações.

# Deploy BACKEND: (Vercel)
### Etapas: feature → main → staging

1. Atualizar a branch main local
```bash
git checkout main
git pull origin main
```
2. Criar PR da feature para main (no GitHub)
   
- Vá até o GitHub > Pull Requests > New Pull Request.
- Base: main | Compare: feature/nome-da-sua-branch
- Escreva o título e descrição do que foi feito.
- Após aprovação do time, clique em Merge pull request > Confirm merge.

### Obs:
Deploy no Vercel (automaticamente após merge na main): Vercel detecta mudanças na branch main e faz o deploy no ambiente configurado (staging).

### Para acompanhar:
- Acesse: https://vercel.com/dashboard
- Clique no projeto e-acelera-back
- Veja a aba Deploys e abra o log se necessário

3. Atualizar a branch staging com o código da main
```bash
git checkout staging
git pull origin staging
git merge main
git push origin staging
```
### Obs:
Embora o Vercel use main para deploy, manter staging atualizado garante padronização e controle de histórico.

4. Verificar se está no ar
- Acesse:https://e-acelera-back.vercel.app/
- Teste endpoints e rotas.
- Valide se a funcionalidade foi publicada corretamente.
- Se tudo estiver ok, o card pode ser movido para PRONTO (não há produção separada).

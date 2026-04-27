# Deploy no Vercel

## Fluxo de Deploy: feature → main → staging

### 1. Atualizar a branch main local
```bash
git checkout main
git pull origin main
```

### 2. Criar PR da feature para main (no GitHub)
   
- Vá até o GitHub > Pull Requests > New Pull Request.
- Base: main | Compare: feature/nome-da-sua-branch
- Escreva o título e descrição do que foi feito.
- Após aprovação do time, clique em Merge pull request > Confirm merge.

**Observação:** Deploy no Vercel (automaticamente após merge na main)
- Vercel detecta mudanças na branch main e faz o deploy no ambiente configurado (staging).

### Para acompanhar o deploy:
- Acesse: https://vercel.com/dashboard
- Clique no projeto e-acelera-back
- Veja a aba Deploys e abra o log se necessário

### 3. Atualizar a branch staging com o código da main
```bash
git checkout staging
git pull origin staging
git merge main
git push origin staging
```

**Observação:** Embora o Vercel use main para deploy, manter staging atualizado garante padronização e controle de histórico.

### 4. Verificar se está no ar
- Acesse: https://e-acelera-back.vercel.app/
- Teste endpoints e rotas.
- Valide se a funcionalidade foi publicada corretamente.
- Se tudo estiver ok, o card pode ser movido para PRONTO (não há produção separada).

# Configuração do Projeto - Bolsa de Estudo Emanuel Xirimbimbi

## Resumo do Projeto

Este é um projeto Next.js para um sistema de candidatura a bolsas de estudo. O sistema permite que candidatos preencham um formulário em múltiplas etapas, façam upload de documentos e submetam suas candidaturas para uma base de dados MySQL.

## Estrutura do Projeto

### Frontend (Next.js)
- **Framework:** Next.js 14.2.16 com TypeScript
- **UI:** Radix UI + Tailwind CSS
- **Formulários:** React Hook Form + Zod para validação
- **Autenticação:** bcryptjs + jsonwebtoken (se necessário)

### Backend (API Routes)
- **API:** Next.js API Routes
- **Base de Dados:** MySQL com mysql2
- **Upload de Ficheiros:** Sistema personalizado com validação

### Funcionalidades Principais
1. **Formulário Multi-etapa:** 5 passos para candidatura
2. **Upload de Documentos:** Validação de tipo e tamanho
3. **Categorias de Bolsa:** 4 categorias diferentes
4. **Validação:** Frontend e backend
5. **Armazenamento:** MySQL com tabelas relacionais

## Configuração da Base de Dados

### Tabelas Necessárias

#### 1. Tabela `applications`
Armazena os dados principais das candidaturas:

```sql
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    bilhete_identidade VARCHAR(50) NOT NULL UNIQUE,
    telefone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    situacao_academica VARCHAR(100) NOT NULL,
    nome_escola VARCHAR(255) NOT NULL,
    media_final DECIMAL(4,2) NOT NULL,
    universidade VARCHAR(255),
    curso VARCHAR(255),
    ano VARCHAR(50),
    carta_motivacao TEXT NOT NULL,
    situacao_financeira VARCHAR(100),
    numero_dependentes INT,
    categoria VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pendente',
    data_candidatura TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. Tabela `application_documents`
Armazena informações sobre os documentos enviados:

```sql
CREATE TABLE IF NOT EXISTS application_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
# Configurações da Base de Dados MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=bolsa_emanuel_xirimbimbi
DB_PORT=3306

# Configurações de Autenticação (se necessário)
JWT_SECRET=sua_chave_secreta_jwt_aqui

# Configurações de Upload
UPLOAD_MAX_SIZE=5242880
ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/jpg,image/png,image/webp

# URL da aplicação (para produção na Vercel)
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
```

## Alterações Realizadas

### 1. Correção dos Nomes dos Campos
- Ajustados os nomes dos campos no arquivo `app/api/applications/route.ts` para corresponder aos nomes usados no formulário frontend
- Corrigidos os nomes dos campos de upload de ficheiros

### 2. Estrutura de Ficheiros
- `app/api/applications/route.ts`: API para receber e processar candidaturas
- `lib/database.ts`: Configuração e funções da base de dados
- `lib/fileUpload.ts`: Funções para upload e validação de ficheiros
- `app/inscricao/page.tsx`: Formulário de candidatura frontend

### 3. Validações Implementadas
- **Frontend:** Validação de campos obrigatórios em cada etapa
- **Backend:** Validação de dados e ficheiros
- **Ficheiros:** Tipo (PDF, JPG, PNG) e tamanho (máx. 5MB)

## Instruções para Hospedagem na Vercel

### Pré-requisitos
1. Conta na Vercel
2. Base de dados MySQL (pode usar PlanetScale, Railway, ou outro provedor)
3. Repositório Git (GitHub, GitLab, ou Bitbucket)

### Passos para Deploy

#### 1. Preparar o Repositório
```bash
# Inicializar repositório Git (se ainda não feito)
git init
git add .
git commit -m "Initial commit"

# Adicionar repositório remoto
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git push -u origin main
```

#### 2. Configurar Base de Dados
- Criar uma base de dados MySQL num provedor cloud
- Executar o script SQL para criar as tabelas
- Anotar as credenciais de conexão

#### 3. Deploy na Vercel
1. Aceder a [vercel.com](https://vercel.com) e fazer login
2. Clicar em "New Project"
3. Importar o repositório Git
4. Configurar as variáveis de ambiente:
   - `DB_HOST`: Host da base de dados
   - `DB_USER`: Utilizador da base de dados
   - `DB_PASSWORD`: Senha da base de dados
   - `DB_NAME`: Nome da base de dados
   - `DB_PORT`: Porta da base de dados (geralmente 3306)
   - `JWT_SECRET`: Chave secreta para JWT
   - `NEXT_PUBLIC_APP_URL`: URL do seu domínio na Vercel

5. Clicar em "Deploy"

#### 4. Configurações Adicionais
- **Domínio Personalizado:** Configurar na aba "Domains" do projeto
- **Variáveis de Ambiente:** Podem ser atualizadas na aba "Settings" > "Environment Variables"
- **Logs:** Verificar na aba "Functions" para debug

### Provedores de Base de Dados Recomendados

#### PlanetScale (Recomendado)
- MySQL compatível
- Plano gratuito disponível
- Fácil integração com Vercel

#### Railway
- Suporte a MySQL
- Plano gratuito com limitações
- Interface simples

#### AWS RDS
- Mais robusto para produção
- Requer configuração mais avançada
- Custos variáveis

## Funcionalidades do Sistema

### Categorias de Bolsa
1. **Recém-Formados do Ensino Médio**
2. **Universitários em Curso**
3. **Cursos Técnicos Superiores**
4. **Pós-Graduação e Mestrado**

### Documentos Obrigatórios
- Cópia do Bilhete de Identidade
- Certificado/Declaração de Conclusão do Ensino Médio
- Declaração de Notas do Ensino Médio
- Declaração de Matrícula (se já matriculado)
- Carta de Recomendação (opcional)

### Validações
- **Média mínima:** 18 valores
- **Tipos de ficheiro:** PDF, JPG, PNG
- **Tamanho máximo:** 5MB por ficheiro
- **Campos obrigatórios:** Validados em cada etapa

## Manutenção e Monitorização

### Logs
- Verificar logs na Vercel para erros de API
- Monitorizar conexões com a base de dados

### Backup
- Configurar backup automático da base de dados
- Manter cópias dos ficheiros enviados

### Atualizações
- Testar alterações localmente antes do deploy
- Usar branches para funcionalidades novas
- Configurar CI/CD se necessário

## Suporte Técnico

Para questões técnicas ou problemas:
1. Verificar logs na Vercel
2. Testar conexão com a base de dados
3. Validar variáveis de ambiente
4. Verificar permissões de ficheiros

---

**Nota:** Este documento deve ser atualizado sempre que houver alterações significativas no projeto.


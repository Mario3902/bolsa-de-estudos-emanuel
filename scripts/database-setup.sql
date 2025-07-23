-- Criar base de dados
CREATE DATABASE IF NOT EXISTS bolsadee_bolsa_estudos;
USE bolsadee_bolsa_estudos;

-- Tabela de utilizadores admin
CREATE TABLE IF NOT EXISTS admin_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de candidaturas
CREATE TABLE IF NOT EXISTS applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_completo VARCHAR(255) NOT NULL,
    data_nascimento DATE NOT NULL,
    bilhete_identidade VARCHAR(50) UNIQUE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    situacao_academica ENUM('nao-matriculado', 'matriculado') NOT NULL,
    nome_escola VARCHAR(255) NOT NULL,
    media_final DECIMAL(4,2) NOT NULL,
    universidade VARCHAR(255),
    curso VARCHAR(255),
    ano VARCHAR(10),
    carta_motivacao TEXT NOT NULL,
    situacao_financeira ENUM('baixa', 'media', 'nao-informar'),
    numero_dependentes INT DEFAULT 0,
    categoria ENUM('ensino-medio', 'universitario', 'tecnico', 'pos-graduacao') NOT NULL,
    status ENUM('pendente', 'aprovado', 'rejeitado', 'em-analise') DEFAULT 'pendente',
    data_candidatura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de documentos
CREATE TABLE IF NOT EXISTS application_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL,
    document_type ENUM('bilhete_identidade', 'certificado_ensino', 'declaracao_notas', 'declaracao_matricula', 'carta_recomendacao') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Inserir utilizador admin padrão (password: admin123)
INSERT INTO admin_users (username, password_hash, email) VALUES 
('admin', '$2b$10$rOzJqKqQxQxQxQxQxQxQxOeKqKqQxQxQxQxQxQxQxQxQxQxQxQxQx', 'admin@bolsaemanuelxirimbimbi.ao')
ON DUPLICATE KEY UPDATE username = username;

-- Índices para melhor performance
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_categoria ON applications(categoria);
CREATE INDEX idx_applications_data ON applications(data_candidatura);
CREATE INDEX idx_documents_application ON application_documents(application_id);

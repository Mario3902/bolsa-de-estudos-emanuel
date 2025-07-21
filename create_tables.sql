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


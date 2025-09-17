#!/usr/bin/env python3
"""
Script para forçar a criação das tabelas do banco de dados
Use este script se as tabelas não forem criadas automaticamente
"""

import sys
import os
from pathlib import Path

# Adicionar o diretório app ao path
sys.path.append(str(Path(__file__).parent / "app"))

def force_create_tables():
    """Força a criação das tabelas"""
    print("🔨 Forçando criação das tabelas...")
    
    try:
        from app.core.config import settings
        from sqlalchemy import create_engine, text
        from app.models.base import Base
        
        # Importar todos os modelos explicitamente
        from app.models.user import User, Profile, Company, Job
        from app.models.application import Application
        from app.models.learning import Course, InterviewSimulation
        
        print(f"🔗 Conectando ao banco: {settings.database_url}")
        
        engine = create_engine(settings.database_url)
        
        # Testar conexão
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            print("✅ Conexão com banco estabelecida!")
        
        # Listar modelos importados
        print("📋 Modelos carregados:")
        for cls in Base.__subclasses__():
            print(f"   - {cls.__name__} -> {cls.__tablename__}")
        
        # Criar todas as tabelas
        print("🏗️  Criando tabelas...")
        Base.metadata.create_all(bind=engine)
        
        # Verificar tabelas criadas
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_type = 'BASE TABLE'
                ORDER BY table_name
            """))
            
            tables = [row[0] for row in result]
            print(f"✅ {len(tables)} tabelas criadas:")
            for table in tables:
                print(f"   ✓ {table}")
        
        print("🎉 Banco de dados inicializado com sucesso!")
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar tabelas: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = force_create_tables()
    sys.exit(0 if success else 1)









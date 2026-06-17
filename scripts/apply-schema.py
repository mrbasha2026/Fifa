#!/usr/bin/env python3
"""Apply schema.sql to Supabase via direct Postgres connection."""
import os
import sys
from pathlib import Path

# Load .env.local manually
env_path = Path('/home/z/my-project/.env.local')
env = {}
for line in env_path.read_text().splitlines():
    if '=' in line and not line.startswith('#'):
        k, _, v = line.partition('=')
        env[k.strip()] = v.strip()

db_url = env.get('SUPABASE_DB_URL')
if not db_url:
    print('❌ Missing SUPABASE_DB_URL')
    sys.exit(1)

# Supabase direct DB host is IPv6-only; use the pooler (IPv4 reachable).
# Pooler format: postgresql://postgres.{ref}:{password}@aws-0-{region}.pooler.supabase.com:6543/postgres
# Extract project ref from the SUPABASE_URL: https://{ref}.supabase.co
supabase_url = env.get('NEXT_PUBLIC_SUPABASE_URL', '')
ref = supabase_url.replace('https://', '').replace('http://', '').split('.')[0]

# Try a few pooler regions (Supabase EU projects are usually eu-central-1)
import socket
pooler_hosts = [
    'aws-0-eu-central-1.pooler.supabase.com',
    'aws-0-us-east-1.pooler.supabase.com',
    'aws-0-us-west-1.pooler.supabase.com',
    'aws-0-ap-southeast-1.pooler.supabase.com',
    'aws-0-ap-northeast-1.pooler.supabase.com',
]
# Extract password from db_url
# Format: postgresql://postgres:PASSWORD@db.{ref}.supabase.co:5432/postgres
import re
m = re.match(r'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', db_url)
if not m:
    print(f'❌ Cannot parse DB_URL: {db_url}')
    sys.exit(1)
pg_user, pg_pass, _pg_host, _pg_port, pg_db = m.groups()

reachable_pooler = None
for h in pooler_hosts:
    try:
        s = socket.create_connection((h, 6543), timeout=3)
        s.close()
        reachable_pooler = h
        print(f'✅ Pooler reachable: {h}')
        break
    except Exception:
        pass

if reachable_pooler:
    # Use transaction pooler on port 6543, user is postgres.{ref}
    pooler_url = f'postgresql://postgres.{ref}:{pg_pass}@{reachable_pooler}:6543/{pg_db}'
    print(f'🔌 Connecting via pooler: postgres.{ref}@{reachable_pooler}:6543')
    db_url = pooler_url
else:
    print('⚠️  No pooler reachable, falling back to direct DB URL (may fail on IPv6-only)...')

try:
    import psycopg2
except ImportError:
    print('❌ psycopg2 not installed. Run: pip install psycopg2-binary')
    sys.exit(1)

# Read schema SQL
schema_path = Path('/home/z/my-project/supabase/schema.sql')
sql = schema_path.read_text()

print(f'🔌 Connecting to Supabase Postgres...')
conn = psycopg2.connect(db_url)
conn.autocommit = True
cur = conn.cursor()

print('📜 Executing schema.sql...')
try:
    cur.execute(sql)
    print('✅ Schema applied successfully in one batch!')
except Exception as e:
    print(f'⚠️  Batch error: {e}')
    print('   Trying statement-by-statement (continuing on "already exists")...')
    statements = sql.split(';')
    success, failed, skipped = 0, 0, 0
    for stmt in statements:
        stmt = stmt.strip()
        if not stmt or stmt.startswith('--'):
            continue
        try:
            cur.execute(stmt + ';')
            success += 1
        except Exception as e2:
            msg = str(e2).lower()
            if 'already exists' in msg:
                skipped += 1
            else:
                failed += 1
    print(f'   ✅ {success} executed, ⏭️  {skipped} already existed, ❌ {failed} failed')

# Verify: count tables
cur.execute("""
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name;
""")
tables = [r[0] for r in cur.fetchall()]
print(f'\n📊 Tables in database ({len(tables)}):')
for t in tables:
    print(f'   - {t}')

cur.close()
conn.close()
print('\n✅ Done!')

# installation

1. Install postgres

macOS:

```bash
brew install postgresql@16
```

Arch Linux:

```bash
sudo pacman -S postgresql
```

2. initialize Postgresql

macOS:

```bash
brew services start postgresql@16
```

Arch Linux:
```bash
sudo -u postgres initdb -D /var/lib/postgres/data --locale en_US.UTF-8
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -u postgres psql
```

3. Enter psql shell

macOS:

```bash
psql postgres
```

Arch Linux:
```bash
sudo -u postgres psql
```

4. Create the gator database

```sql
CREATE DATABASE gator;
```

5. Connect to the database and set the user password

```bash
\c gator
ALTER USER postgres PASSWORD 'postgres';
```

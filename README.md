# Shigoto Vault

Store your Job Applications in a vault as you go on a journey to apply for your dream job! Keep track of your progress and view the summary of your journey through charts!
Requires no login, ready to start as soon as you are! Sync your progress with your account later if you wish!

## How To Use This Project

1. Clone the project

```bash
git clone https://github.com/StylePoints420/shigoto-vault.git
```

2. Install Dependencies

```bash
npm install
```

2. Create .env file in root directory and modify the value according to your configuration

```bash
NODE_ENV=development

# DATABASE CONFIGS - you can change this according to your config
DB_USER=root
DB_PASSWORD=admin
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shigoto-vault

# PGADMIN - you can change this according to your config
PGADMIN_EMAIL=root@admin.com
PGADMIN_PASSWORD=admin

# BETTER AUTH
BETTER_AUTH_SECRET=Get betterAuth secret here: https://www.better-auth.com/docs/installation
# TRUSTED ORIGIN (development)
BETTER_AUTH_URL=http://localhost:3000
# Use 'hostname -i' for linux and 'ipconfig' for windows
BETTER_AUTH_LOCAL_IP=Your local IP Address

# VITE CONFIG
VITE_API_VERSION=v1

# GEMINI AI CONFIGS
# get api key and project ID here: https://aistudio.google.com/apikey
GEMINI_API_KEY=Gemini API key here
GEMINI_PROJECT_ID=Gemini Project ID key here
```

3. Use in Development

```bash
npm run dev
```

4. Build for Production

```bash
npm run build
```

5. Build Preview

```bash
npm run start
```

5. Follow the instructions for Deployment [here](https://github.com/remix-run/react-router-templates/tree/main/node-custom-server#readme)

## Project Structure

View it [here](https://github.com/StylePoints420/shigoto-vault/blob/main/docs/PROJECT_STRUCTURE.md).

// Script to set up the database and run migrations
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Railway connection details
const PGPASSWORD = "Yk8ufQzNSsVBFCHdZABL";
const PGHOST = "containers-us-west-50.railway.app";
const PGPORT = "5682";
const PGUSER = "postgres";
const PGDATABASE = "railway";

// Create .env file
const envContent = `
# Database connection
DATABASE_URL=postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?schema=public

# JWT Secret
JWT_SECRET=upzento-crm-secret-key-change-in-production
JWT_REFRESH_SECRET=upzento-crm-refresh-secret-key-change-in-production

# App settings
PORT=3001
NODE_ENV=development

# Railway connection
PGPASSWORD=${PGPASSWORD}
PGHOST=${PGHOST}
PGPORT=${PGPORT}
PGUSER=${PGUSER}
PGDATABASE=${PGDATABASE}
`;

console.log('Setting up database connection...');

// Write .env file
try {
  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  console.log('Created .env file with Railway connection details');
} catch (error) {
  console.error('Error creating .env file:', error);
  process.exit(1);
}

// Run Prisma migrations
console.log('Running Prisma migrations...');
try {
  // Generate Prisma client
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully');

  // Run migrations
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Migrations applied successfully');

  // Seed the database if needed
  if (process.argv.includes('--seed')) {
    console.log('Seeding the database...');
    execSync('npx prisma db seed', { stdio: 'inherit' });
    console.log('Database seeded successfully');
  }

  console.log('Database setup completed successfully!');
} catch (error) {
  console.error('Error setting up the database:', error);
  process.exit(1);
} 
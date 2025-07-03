const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Database URL from Railway
const DATABASE_URL = "postgresql://postgres:SBtMJUnYzdXkoaMkJGSzSeDSZZmmBcfy@shinkansen.proxy.rlwy.net:30419/railway";

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file...');
  const envContent = `DATABASE_URL="${DATABASE_URL}"
PORT=3001
JWT_SECRET="upzento-crm-jwt-secret-key-for-authentication"
JWT_REFRESH_SECRET="upzento-crm-jwt-refresh-secret-key-for-authentication"
JWT_EXPIRATION="1d"
JWT_REFRESH_EXPIRATION="7d"`;

  fs.writeFileSync(envPath, envContent);
  console.log('.env file created successfully.');
} else {
  console.log('.env file already exists.');
  
  // Update DATABASE_URL in existing .env file
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL="${DATABASE_URL}"`);
  fs.writeFileSync(envPath, envContent);
  console.log('DATABASE_URL updated in .env file.');
}

// Run Prisma migrations
console.log('Running Prisma migrations...');
try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('Prisma migrations completed successfully.');
} catch (error) {
  console.error('Failed to run migrations:', error);
  
  // If migrations fail, try to generate the schema
  console.log('Trying to generate Prisma client...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('Prisma client generated successfully.');
  } catch (genError) {
    console.error('Failed to generate Prisma client:', genError);
  }
}

// Seed the database with initial data
console.log('Seeding the database...');
try {
  // Create a super admin user
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  async function seed() {
    try {
      // Create a tenant
      const tenant = await prisma.tenant.create({
        data: {
          name: 'Upzento Admin',
          domain: 'admin.upzento.com',
          plan: 'enterprise',
          status: 'active',
        },
      });
      
      console.log('Created admin tenant:', tenant.id);
      
      // Create a super admin user
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@upzento.com',
          password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // Password: Password123!
          firstName: 'Super',
          lastName: 'Admin',
          role: 'SUPER_ADMIN',
          tenantId: tenant.id,
        },
      });
      
      console.log('Created super admin user:', adminUser.id);
      
      // Create a demo agency
      const agency = await prisma.agency.create({
        data: {
          name: 'Demo Agency',
          logo: 'https://via.placeholder.com/150',
          primaryColor: '#3D5AFE',
          tenantId: tenant.id,
        },
      });
      
      console.log('Created demo agency:', agency.id);
      
      // Create agency owner
      const agencyOwner = await prisma.user.create({
        data: {
          email: 'agency@example.com',
          password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // Password: Password123!
          firstName: 'Agency',
          lastName: 'Owner',
          role: 'AGENCY_OWNER',
          tenantId: tenant.id,
          agencyId: agency.id,
        },
      });
      
      console.log('Created agency owner:', agencyOwner.id);
      
      // Create a demo client
      const client = await prisma.client.create({
        data: {
          name: 'Demo Client',
          logo: 'https://via.placeholder.com/150',
          primaryColor: '#FF4081',
          agencyId: agency.id,
        },
      });
      
      console.log('Created demo client:', client.id);
      
      // Create client owner
      const clientOwner = await prisma.user.create({
        data: {
          email: 'client@example.com',
          password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', // Password: Password123!
          firstName: 'Client',
          lastName: 'Owner',
          role: 'CLIENT_OWNER',
          tenantId: tenant.id,
          agencyId: agency.id,
          clientId: client.id,
        },
      });
      
      console.log('Created client owner:', clientOwner.id);
      
      console.log('Database seeding completed successfully.');
    } catch (error) {
      console.error('Error seeding database:', error);
    } finally {
      await prisma.$disconnect();
    }
  }
  
  seed();
} catch (error) {
  console.error('Failed to seed database:', error);
}

console.log('Database setup completed.'); 
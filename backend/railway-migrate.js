
  // This script will be run by Railway CLI
  const { execSync } = require('child_process');
  
  try {
    console.log('Running Prisma migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('Migrations completed successfully!');
    
    if (process.argv.includes('--seed')) {
      console.log('Seeding the database...');
      execSync('npx prisma db seed', { stdio: 'inherit' });
      console.log('Database seeded successfully!');
    }
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
  
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create a tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Upzento Demo',
      domain: 'demo.upzento.com',
      plan: 'enterprise',
      status: 'active',
    },
  });
  console.log(`Created tenant: ${tenant.name}`);

  // Create an agency
  const agency = await prisma.agency.create({
    data: {
      name: 'Digital Marketing Pros',
      logo: 'https://placehold.co/400x400/3D5AFE/FFFFFF?text=DMP',
      primaryColor: '#3D5AFE',
      tenantId: tenant.id,
    },
  });
  console.log(`Created agency: ${agency.name}`);

  // Create a client
  const client = await prisma.client.create({
    data: {
      name: 'Acme Corporation',
      logo: 'https://placehold.co/400x400/FF4081/FFFFFF?text=ACME',
      primaryColor: '#FF4081',
      agencyId: agency.id,
    },
  });
  console.log(`Created client: ${client.name}`);

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@upzento.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
      tenantId: tenant.id,
    },
  });
  console.log(`Created admin user: ${adminUser.email}`);

  // Create agency owner
  const agencyOwner = await prisma.user.create({
    data: {
      email: 'agency@example.com',
      password: hashedPassword,
      firstName: 'Agency',
      lastName: 'Owner',
      role: 'AGENCY_OWNER',
      tenantId: tenant.id,
      agencyId: agency.id,
    },
  });
  console.log(`Created agency owner: ${agencyOwner.email}`);

  // Create client owner
  const clientOwner = await prisma.user.create({
    data: {
      email: 'client@example.com',
      password: hashedPassword,
      firstName: 'Client',
      lastName: 'Owner',
      role: 'CLIENT_OWNER',
      tenantId: tenant.id,
      agencyId: agency.id,
      clientId: client.id,
    },
  });
  console.log(`Created client owner: ${clientOwner.email}`);

  // Create product categories
  const categories = await prisma.productCategory.createMany({
    data: [
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        clientId: client.id,
      },
      {
        name: 'Clothing',
        description: 'Apparel and fashion items',
        clientId: client.id,
      },
      {
        name: 'Home & Garden',
        description: 'Items for home and garden',
        clientId: client.id,
      },
    ],
  });
  console.log(`Created ${categories.count} product categories`);

  // Create products
  const electronics = await prisma.productCategory.findFirst({
    where: { name: 'Electronics', clientId: client.id },
  });

  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Smartphone X',
        description: 'Latest smartphone with advanced features',
        price: 999.99,
        sku: 'PHONE-X-001',
        status: 'ACTIVE',
        isFeatured: true,
        images: ['https://placehold.co/600x400/3D5AFE/FFFFFF?text=Smartphone+X'],
        inventory: 100,
        clientId: client.id,
      },
      {
        name: 'Laptop Pro',
        description: 'Professional laptop for work and entertainment',
        price: 1499.99,
        sku: 'LAPTOP-P-001',
        status: 'ACTIVE',
        isFeatured: true,
        images: ['https://placehold.co/600x400/FF4081/FFFFFF?text=Laptop+Pro'],
        inventory: 50,
        clientId: client.id,
      },
      {
        name: 'Wireless Earbuds',
        description: 'High-quality wireless earbuds',
        price: 149.99,
        sku: 'EARBUDS-W-001',
        status: 'ACTIVE',
        isFeatured: false,
        images: ['https://placehold.co/600x400/FFD700/000000?text=Wireless+Earbuds'],
        inventory: 200,
        clientId: client.id,
      },
    ],
  });
  console.log(`Created ${products.count} products`);

  // Create a campaign
  const campaign = await prisma.campaign.create({
    data: {
      name: 'Summer Sale',
      description: 'Promotional campaign for summer products',
      type: 'email',
      status: 'draft',
      clientId: client.id,
    },
  });
  console.log(`Created campaign: ${campaign.name}`);

  // Create a chat widget
  const chatWidget = await prisma.chatWidget.create({
    data: {
      name: 'Website Chat',
      clientId: client.id,
      primaryColor: '#3D5AFE',
      welcomeMessage: 'Welcome to Acme Corp! How can we help you today?',
    },
  });
  console.log(`Created chat widget: ${chatWidget.name}`);

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
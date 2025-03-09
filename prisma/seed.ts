import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create Admin User
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@afrodeity.com' },
    update: {},
    create: {
      email: 'admin@afrodeity.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'T-shirts' },
      update: {},
      create: {
        name: 'T-shirts',
        description: 'African-inspired t-shirts and tops',
        image: '/images/categories/tshirts.jpg',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Jeans' },
      update: {},
      create: {
        name: 'Jeans',
        description: 'Stylish African print jeans and pants',
        image: '/images/categories/jeans.jpg',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Shoes' },
      update: {},
      create: {
        name: 'Shoes',
        description: 'African-inspired footwear',
        image: '/images/categories/shoes.jpg',
      },
    }),
  ]);

  // Create Products
  // T-shirts
  await prisma.product.upsert({
    where: { sku: 'TSH001' },
    update: {},
    create: {
      name: 'Ankara Print T-Shirt',
      description: 'Beautiful Ankara print t-shirt with modern design',
      price: 29.99,
      images: ['/images/products/tshirt-1-1.jpg', '/images/products/tshirt-1-2.jpg'],
      stock: 50,
      sku: 'TSH001',
      categoryId: categories[0].id,
    },
  });

  await prisma.product.upsert({
    where: { sku: 'TSH002' },
    update: {},
    create: {
      name: 'Kente Pattern Tee',
      description: 'Classic t-shirt with traditional Kente pattern',
      price: 34.99,
      images: ['/images/products/tshirt-2-1.jpg', '/images/products/tshirt-2-2.jpg'],
      stock: 45,
      sku: 'TSH002',
      categoryId: categories[0].id,
    },
  });

  // Jeans
  await prisma.product.upsert({
    where: { sku: 'JNS001' },
    update: {},
    create: {
      name: 'African Print Denim',
      description: 'Unique denim jeans with African print details',
      price: 59.99,
      images: ['/images/products/jeans-1-1.jpg', '/images/products/jeans-1-2.jpg'],
      stock: 30,
      sku: 'JNS001',
      categoryId: categories[1].id,
    },
  });

  await prisma.product.upsert({
    where: { sku: 'JNS002' },
    update: {},
    create: {
      name: 'Ankara Patch Jeans',
      description: 'Modern jeans with Ankara fabric patches',
      price: 64.99,
      images: ['/images/products/jeans-2-1.jpg', '/images/products/jeans-2-2.jpg'],
      stock: 25,
      sku: 'JNS002',
      categoryId: categories[1].id,
    },
  });

  // Shoes
  await prisma.product.upsert({
    where: { sku: 'SHO001' },
    update: {},
    create: {
      name: 'African Print Sneakers',
      description: 'Comfortable sneakers with vibrant African prints',
      price: 79.99,
      images: ['/images/products/shoes-1-1.jpg', '/images/products/shoes-1-2.jpg'],
      stock: 40,
      sku: 'SHO001',
      categoryId: categories[2].id,
    },
  });

  await prisma.product.upsert({
    where: { sku: 'SHO002' },
    update: {},
    create: {
      name: 'Kente Slip-ons',
      description: 'Stylish slip-on shoes with Kente pattern',
      price: 69.99,
      images: ['/images/products/shoes-2-1.jpg', '/images/products/shoes-2-2.jpg'],
      stock: 35,
      sku: 'SHO002',
      categoryId: categories[2].id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import { User, Category, Supplier } from '../models/index.js';

/**
 * Script de inicialización de datos de prueba (Seed).
 * Crea usuarios base (Admin y Operario), categorías y proveedores para desarrollo.
 */
const seedDatabase = async () => {
  try {
    console.log('--- Iniciando Seed de Base de Datos StockMaster ---');
    await connectDB();

    // 1. Usuarios iniciales
    const usersToSeed = [
      {
        name: 'Administrador del Sistema',
        email: 'admin@stockmaster.com',
        password: 'Admin1234!',
        role: 'admin',
        status: 'active',
      },
      {
        name: 'Operario de Depósito',
        email: 'operario@stockmaster.com',
        password: 'Operario1234!',
        role: 'operario',
        status: 'active',
      },
    ];

    for (const userData of usersToSeed) {
      const exists = await User.findOne({ email: userData.email });
      if (!exists) {
        await User.create(userData);
        console.log(`[Seed] Usuario creado: ${userData.email} (${userData.role})`);
      } else {
        console.log(`[Seed] Usuario ya existía: ${userData.email}`);
      }
    }

    // 2. Categorías iniciales
    const categoriesToSeed = [
      { name: 'Electrónica y Computación', description: 'Componentes, placas y accesorios electrónicos' },
      { name: 'Herramientas y Ferretería', description: 'Equipamiento manual, eléctrico y fijaciones' },
      { name: 'Embalaje y Despacho', description: 'Cajas de cartón, cinta film, etiquetas' },
      { name: 'Materiales y Repuestos', description: 'Insumos generales de mantenimiento' },
    ];

    for (const catData of categoriesToSeed) {
      const exists = await Category.findOne({ name: catData.name });
      if (!exists) {
        await Category.create(catData);
        console.log(`[Seed] Categoría creada: ${catData.name}`);
      }
    }

    // 3. Proveedores iniciales
    const suppliersToSeed = [
      {
        name: 'Distribuidora Global S.A.',
        taxId: '30-71234567-9',
        phone: '+54 11 4567-8901',
        email: 'ventas@distribuidoraglobal.com',
        address: 'Av. Industrial 4500, Parque Logístico',
      },
      {
        name: 'Suministros Industriales SRL',
        taxId: '30-68912345-4',
        phone: '+54 11 5123-4567',
        email: 'contacto@suministrosind.com',
        address: 'Ruta 8 Km 54, Depósito 12',
      },
    ];

    for (const supData of suppliersToSeed) {
      const exists = await Supplier.findOne({ name: supData.name });
      if (!exists) {
        await Supplier.create(supData);
        console.log(`[Seed] Proveedor creado: ${supData.name}`);
      }
    }

    console.log('--- Seed completado exitosamente ---');
    console.log('Credenciales de acceso para pruebas:');
    console.log('  Admin:    admin@stockmaster.com    | Password: Admin1234!');
    console.log('  Operario: operario@stockmaster.com | Password: Operario1234!');
    console.log('------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();

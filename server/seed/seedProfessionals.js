import { db } from '../lib/firebase-admin.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const salonsPath = path.join(__dirname, '../data/salons.json');
const professionals = JSON.parse(fs.readFileSync(salonsPath, 'utf8'));

async function seed() {
  console.log('🌱 Starting seed process...');
  if (!db) {
    console.error('❌ Cannot seed: Firestore database is not initialized. Make sure FIREBASE_SERVICE_ACCOUNT is provided.');
    process.exit(1);
  }

  try {
    for (const pro of professionals) {
      const docRef = db.collection('professionals').doc(pro.id);
      await docRef.set({
        ...pro,
        created_at: new Date()
      });
      console.log(`✅ Seeded professional: ${pro.name}`);
    }
    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding professionals:', error);
  }
}

// Check if running directly
if (process.argv[1]?.endsWith('seedProfessionals.js')) {
  seed();
}

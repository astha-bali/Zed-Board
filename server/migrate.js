const mongoose = require('mongoose');
require('dotenv').config();

const LOCAL_URI = 'mongodb://localhost:27017/zedboard';
// Replace this with your actual Atlas connection string once you have it
const ATLAS_URI = process.env.ATLAS_URI || 'mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/zedboard?retryWrites=true&w=majority';

async function migrate() {
  if (ATLAS_URI.includes('<username>')) {
    console.error('❌ ERROR: You need to replace the ATLAS_URI in this script (or add ATLAS_URI to your .env file) with your actual MongoDB Atlas connection string first!');
    process.exit(1);
  }

  console.log('🔄 Starting database migration...');

  try {
    // 1. Connect to Local DB
    console.log('🔌 Connecting to local database...');
    const localDb = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Connected to local database');

    // 2. Connect to Atlas DB
    console.log('🔌 Connecting to Atlas database...');
    const atlasDb = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Connected to Atlas database');

    // 3. Get all collections from local DB
    const collections = await localDb.db.listCollections().toArray();
    console.log(`📦 Found ${collections.length} collections to migrate`);

    // 4. Migrate each collection
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`\n⏳ Migrating collection: ${collectionName}...`);

      const localCollection = localDb.collection(collectionName);
      const atlasCollection = atlasDb.collection(collectionName);

      // Get all documents
      const docs = await localCollection.find({}).toArray();
      
      if (docs.length > 0) {
        // Clear destination collection just in case
        await atlasCollection.deleteMany({});
        
        // Insert documents
        await atlasCollection.insertMany(docs);
        console.log(`✅ Successfully migrated ${docs.length} documents for '${collectionName}'`);
      } else {
        console.log(`⏭️ Collection '${collectionName}' is empty, skipping.`);
      }
    }

    console.log('\n🎉 Migration completed successfully!');
    
    // Close connections
    await localDb.close();
    await atlasDb.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();

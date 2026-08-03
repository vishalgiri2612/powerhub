const fs = require('fs');
const mongoose = require('mongoose');

// Read MONGODB_URI from .env.local
let mongoUri = process.env.MONGODB_URI;
if (!mongoUri && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/MONGODB_URI=(.+)/);
  if (match) {
    mongoUri = match[1].trim().replace(/^["']|["']$/g, '');
  }
}

if (!mongoUri) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

async function run() {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  const categorySchema = new mongoose.Schema({
    name: String,
    subcategories: [String],
    image: String,
    showOnHome: Boolean,
    homePosition: Number
  }, { strict: false });

  const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

  // 1. Update Networking
  await Category.updateOne(
    { name: "Networking" },
    { $set: { subcategories: ["PATCH CORD", "CAT6 CABLE"] } },
    { upsert: true }
  );
  console.log("Updated Networking subcategories to ['PATCH CORD', 'CAT6 CABLE']");

  // 2. Update USB Hubs
  await Category.updateOne(
    { name: "USB Hubs" },
    { $set: { subcategories: ["TYPE C", "USB"], image: "/images/magsafe.png", showOnHome: true } },
    { upsert: true }
  );
  console.log("Updated USB Hubs subcategories to ['TYPE C', 'USB']");

  // 3. Update Docking Stations
  await Category.updateOne(
    { name: "Docking Stations" },
    { $set: { subcategories: ["TYPE C", "USB", "Dual Type C"] } }
  );
  console.log("Updated Docking Stations subcategories");

  await mongoose.disconnect();
  console.log("Done!");
}

run().catch(console.error);

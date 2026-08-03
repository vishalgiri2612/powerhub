const fs = require('fs');
const mongoose = require('mongoose');

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

  // Remove all variations of USB Hubs
  await Category.deleteMany({ name: { $regex: /^usb hubs$/i } });
  console.log("Removed all duplicate USB Hubs categories");

  // Create single official USB HUBS category with TYPE C & USB subcategories
  await Category.create({
    name: "USB HUBS",
    subcategories: ["TYPE C", "USB"],
    image: "/images/magsafe.png",
    showOnHome: true,
    homePosition: 0
  });

  console.log("Created clean single USB HUBS category with TYPE C and USB subcategories!");

  await mongoose.disconnect();
  console.log("Done!");
}

run().catch(console.error);

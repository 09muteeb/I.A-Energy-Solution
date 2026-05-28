import { getDb } from "../api/queries/connection";
import { products } from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // Check if products already exist
  const existing = await db.select().from(products).limit(1);
  if (existing.length > 0) {
    console.log("Products already seeded, skipping...");
    process.exit(0);
  }

  await db.insert(products).values([
    {
      name: "5KVA Home System",
      slug: "5kva-home-system",
      category: "home_system",
      description:
        "Complete solar power solution for small homes. Includes 8 x 545W solar panels, 5KVA hybrid inverter, 2 x 200Ah batteries, mounting structure, and full installation. Powers lights, fans, TV, refrigerator, and small appliances.",
      price: "285000.00",
      comparePrice: "320000.00",
      image: "/images/products/5kva-system.jpg",
      images: JSON.stringify([
        "/images/products/5kva-system.jpg",
        "/images/products/5kva-system-2.jpg",
      ]),
      specs: JSON.stringify({
        "System Capacity": "5KVA / 5KW",
        "Panel Count": "8 x 545W Mono PERC",
        "Inverter": "5KVA Hybrid Inverter",
        "Battery": "2 x 200Ah Deep Cycle",
        "Mounting": "Aluminum Structure",
        "Warranty": "5 Years on Inverter, 25 Years on Panels",
        "Installation Time": "2-3 Days",
        "Backup Time": "6-8 Hours",
      }),
      stock: 50,
      featured: true,
      rating: "4.9",
      reviewCount: 127,
    },
    {
      name: "10KVA Home System",
      slug: "10kva-home-system",
      category: "home_system",
      description:
        "Ideal for medium-sized homes with higher energy demands. Includes 16 x 545W solar panels, 10KVA hybrid inverter, 4 x 200Ah batteries, mounting structure, and full installation. Powers AC units, water pumps, and all household appliances.",
      price: "485000.00",
      comparePrice: "550000.00",
      image: "/images/products/10kva-system.jpg",
      images: JSON.stringify([
        "/images/products/10kva-system.jpg",
        "/images/products/10kva-system-2.jpg",
      ]),
      specs: JSON.stringify({
        "System Capacity": "10KVA / 10KW",
        "Panel Count": "16 x 545W Mono PERC",
        "Inverter": "10KVA Hybrid Inverter",
        "Battery": "4 x 200Ah Deep Cycle",
        "Mounting": "Aluminum Structure",
        "Warranty": "5 Years on Inverter, 25 Years on Panels",
        "Installation Time": "3-4 Days",
        "Backup Time": "8-10 Hours",
      }),
      stock: 35,
      featured: true,
      rating: "4.8",
      reviewCount: 89,
    },
    {
      name: "15KVA Commercial System",
      slug: "15kva-commercial-system",
      category: "commercial",
      description:
        "Powerful commercial-grade solar solution for shops, offices, and small businesses. Includes 24 x 545W solar panels, 15KVA three-phase inverter, 8 x 200Ah batteries, heavy-duty mounting, and professional installation.",
      price: "750000.00",
      comparePrice: "850000.00",
      image: "/images/products/15kva-system.jpg",
      images: JSON.stringify([
        "/images/products/15kva-system.jpg",
        "/images/products/15kva-system-2.jpg",
      ]),
      specs: JSON.stringify({
        "System Capacity": "15KVA / 15KW",
        "Panel Count": "24 x 545W Mono PERC",
        "Inverter": "15KVA Three-Phase Hybrid",
        "Battery": "8 x 200Ah Deep Cycle",
        "Mounting": "Heavy-D Aluminum Structure",
        "Warranty": "5 Years on Inverter, 25 Years on Panels",
        "Installation Time": "4-5 Days",
        "Backup Time": "10-12 Hours",
      }),
      stock: 20,
      featured: true,
      rating: "4.9",
      reviewCount: 56,
    },
    {
      name: "Hybrid Solar Inverter 5KW",
      slug: "hybrid-inverter-5kw",
      category: "inverter",
      description:
        "Advanced 5KW hybrid solar inverter with MPPT charge controller. Supports grid-tie, off-grid, and hybrid modes. LCD display, WiFi monitoring, and smartphone app compatibility.",
      price: "125000.00",
      comparePrice: "145000.00",
      image: "/images/products/inverter-5kw.jpg",
      images: JSON.stringify([
        "/images/products/inverter-5kw.jpg",
      ]),
      specs: JSON.stringify({
        "Rated Power": "5KW",
        "Max PV Input": "6500W",
        "MPPT Voltage": "120-500V",
        "Efficiency": "97.6%",
        "Waveform": "Pure Sine Wave",
        "Warranty": "5 Years",
        "Weight": "18kg",
        "Dimensions": "480 x 350 x 180mm",
      }),
      stock: 100,
      featured: false,
      rating: "4.7",
      reviewCount: 203,
    },
    {
      name: "Deep Cycle Battery 200Ah",
      slug: "deep-cycle-battery-200ah",
      category: "battery",
      description:
        "High-quality 200Ah deep cycle battery designed for solar energy storage. Maintenance-free design, long cycle life, and excellent deep discharge recovery. Perfect for home and commercial solar systems.",
      price: "45000.00",
      comparePrice: "52000.00",
      image: "/images/products/battery-200ah.jpg",
      images: JSON.stringify([
        "/images/products/battery-200ah.jpg",
      ]),
      specs: JSON.stringify({
        "Capacity": "200Ah",
        "Voltage": "12V",
        "Type": "Deep Cycle AGM",
        "Cycle Life": "1500+ Cycles",
        "Weight": "58kg",
        "Dimensions": "522 x 240 x 219mm",
        "Warranty": "2 Years",
        "Operating Temp": "-20°C to 60°C",
      }),
      stock: 200,
      featured: false,
      rating: "4.6",
      reviewCount: 312,
    },
    {
      name: "Solar Panel Mounting Kit",
      slug: "solar-mounting-kit",
      category: "accessory",
      description:
        "Complete aluminum mounting kit for solar panel installation. Includes rails, clamps, brackets, and all necessary hardware. Corrosion-resistant design suitable for all weather conditions.",
      price: "18000.00",
      comparePrice: "22000.00",
      image: "/images/products/mounting-kit.jpg",
      images: JSON.stringify([
        "/images/products/mounting-kit.jpg",
      ]),
      specs: JSON.stringify({
        "Material": "Aluminum 6063-T5",
        "Panel Capacity": "Up to 8 panels",
        "Tilt Angle": "Adjustable 15-45°",
        "Wind Rating": "150km/h",
        "Warranty": "10 Years",
        "Weight": "12kg",
        "Includes": "Rails, clamps, brackets, bolts",
      }),
      stock: 150,
      featured: false,
      rating: "4.5",
      reviewCount: 178,
    },
  ]);

  console.log("Seeded 6 products.");
  process.exit(0);
}

seed();

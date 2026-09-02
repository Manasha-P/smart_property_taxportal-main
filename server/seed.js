require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const Taxpayer = require("./models/Taxpayer");
const TaxPayment = require("./models/TaxPayment");
const AIAnalysis = require("./models/AIAnalysis");
const User = require("./models/User");

// ---------- MOCK TAXPAYERS ----------
const taxpayers = [
  { aadhaarDemoId: "DEMO-1001", name: "Arun Kumar", propertyId: "PROP-1001", propertyAddress: "12 Gandhi Street, Erode", propertyType: "Residential", propertyValue: 2500000 },
  { aadhaarDemoId: "DEMO-1002", name: "Priya Raman", propertyId: "PROP-1002", propertyAddress: "45 Anna Nagar, Chennai", propertyType: "Residential", propertyValue: 1800000 },
  { aadhaarDemoId: "DEMO-1003", name: "Suresh Babu", propertyId: "PROP-1003", propertyAddress: "7 Market Road, Coimbatore", propertyType: "Commercial", propertyValue: 5200000 },
  { aadhaarDemoId: "DEMO-1004", name: "Lakshmi Narayanan", propertyId: "PROP-1004", propertyAddress: "23 Temple Street, Madurai", propertyType: "Residential", propertyValue: 2100000 },
  { aadhaarDemoId: "DEMO-1005", name: "Kavitha Ramesh", propertyId: "PROP-1005", propertyAddress: "9 Lake View Road, Salem", propertyType: "Residential", propertyValue: 1600000 },
  { aadhaarDemoId: "DEMO-1006", name: "Muthu Selvam", propertyId: "PROP-1006", propertyAddress: "56 Farm Road, Erode", propertyType: "Agricultural", propertyValue: 900000 },
];

const banks = ["State Bank", "Indian Bank", "Bank of India"];

function buildPaymentsForTaxpayer(taxpayerId, demoId) {
  const payments = [];

  if (demoId === "DEMO-1001") {
    // 100% TAX PAYER - Fully Paid across all banks, months, and years
    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2022-23", taxDue: 5000, amountPaid: 5000, status: "Paid", paymentDate: new Date("2022-06-10") });
    payments.push({ taxpayerId, bankName: "Indian Bank", financialYear: "2022-23", taxDue: 5000, amountPaid: 5000, status: "Paid", paymentDate: new Date("2022-07-15") });

    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2023-24", taxDue: 6000, amountPaid: 6000, status: "Paid", paymentDate: new Date("2023-05-20") });
    payments.push({ taxpayerId, bankName: "Indian Bank", financialYear: "2023-24", taxDue: 6000, amountPaid: 6000, status: "Paid", paymentDate: new Date("2023-06-18") });

    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2024-25", month: "April", taxDue: 1250, amountPaid: 1250, status: "Paid", paymentDate: new Date("2024-04-10") });
    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2024-25", month: "May", taxDue: 1250, amountPaid: 1250, status: "Paid", paymentDate: new Date("2024-05-12") });
    payments.push({ taxpayerId, bankName: "Indian Bank", financialYear: "2024-25", month: "June", taxDue: 1250, amountPaid: 1250, status: "Paid", paymentDate: new Date("2024-06-15") });
    payments.push({ taxpayerId, bankName: "Bank of India", financialYear: "2024-25", month: "July", taxDue: 1250, amountPaid: 1250, status: "Paid", paymentDate: new Date("2024-07-20") });
    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2024-25", taxDue: 2500, amountPaid: 2500, status: "Paid", paymentDate: new Date("2024-08-05") });
    payments.push({ taxpayerId, bankName: "Indian Bank", financialYear: "2024-25", taxDue: 3750, amountPaid: 3750, status: "Paid", paymentDate: new Date("2024-09-12") });
    payments.push({ taxpayerId, bankName: "Bank of India", financialYear: "2024-25", taxDue: 3750, amountPaid: 3750, status: "Paid", paymentDate: new Date("2024-10-18") });

  } else if (demoId === "DEMO-1002") {
    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2022-23", taxDue: 10000, amountPaid: 10000, status: "Paid", paymentDate: new Date("2022-05-15") });
    payments.push({ taxpayerId, bankName: "Indian Bank", financialYear: "2023-24", taxDue: 12000, amountPaid: 12000, status: "Paid", paymentDate: new Date("2023-06-20") });

    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2024-25", taxDue: 5000, amountPaid: 5000, status: "Paid", paymentDate: new Date("2024-04-15") });
    payments.push({ taxpayerId, bankName: "Indian Bank", financialYear: "2024-25", taxDue: 5000, amountPaid: 3000, status: "Partially Paid", paymentDate: new Date("2024-05-10") });
    payments.push({ taxpayerId, bankName: "Bank of India", financialYear: "2024-25", taxDue: 5000, amountPaid: 0, status: "Unpaid" });

    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2024-25", month: "April", taxDue: 1250, amountPaid: 1250, status: "Paid", paymentDate: new Date("2024-04-10") });
    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2024-25", month: "May", taxDue: 1250, amountPaid: 1250, status: "Paid", paymentDate: new Date("2024-05-12") });
    payments.push({ taxpayerId, bankName: "Indian Bank", financialYear: "2024-25", month: "June", taxDue: 1250, amountPaid: 0, status: "Unpaid" });
    payments.push({ taxpayerId, bankName: "Indian Bank", financialYear: "2024-25", month: "July", taxDue: 1250, amountPaid: 1000, status: "Partially Paid", paymentDate: new Date("2024-07-11") });

  } else if (demoId === "DEMO-1006") {
    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2024-25", taxDue: 5000, amountPaid: 0, status: "Unpaid" });
    payments.push({ taxpayerId, bankName: "Indian Bank", financialYear: "2024-25", taxDue: 5000, amountPaid: 0, status: "Unpaid" });
    payments.push({ taxpayerId, bankName: "Bank of India", financialYear: "2024-25", taxDue: 5000, amountPaid: 0, status: "Unpaid" });

    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2024-25", month: "April", taxDue: 1250, amountPaid: 0, status: "Unpaid" });
    payments.push({ taxpayerId, bankName: "Indian Bank", financialYear: "2024-25", month: "May", taxDue: 1250, amountPaid: 0, status: "Unpaid" });
    payments.push({ taxpayerId, bankName: "Indian Bank", financialYear: "2024-25", month: "June", taxDue: 1250, amountPaid: 0, status: "Unpaid" });
    payments.push({ taxpayerId, bankName: "Bank of India", financialYear: "2024-25", month: "July", taxDue: 1250, amountPaid: 0, status: "Unpaid" });
  } else {
    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2022-23", taxDue: 8000, amountPaid: 8000, status: "Paid", paymentDate: new Date("2022-06-01") });
    payments.push({ taxpayerId, bankName: "Indian Bank", financialYear: "2023-24", taxDue: 10000, amountPaid: 10000, status: "Paid", paymentDate: new Date("2023-06-01") });
    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2024-25", taxDue: 6000, amountPaid: 4000, status: "Partially Paid", paymentDate: new Date("2024-05-01") });
    payments.push({ taxpayerId, bankName: "Bank of India", financialYear: "2025-26", taxDue: 8000, amountPaid: 0, status: "Unpaid" });

    payments.push({ taxpayerId, bankName: "State Bank", financialYear: "2024-25", month: "April", taxDue: 1500, amountPaid: 1500, status: "Paid", paymentDate: new Date("2024-04-05") });
    payments.push({ taxpayerId, bankName: "Indian Bank", financialYear: "2024-25", month: "May", taxDue: 1500, amountPaid: 1500, status: "Paid", paymentDate: new Date("2024-05-10") });
    payments.push({ taxpayerId, bankName: "Bank of India", financialYear: "2024-25", month: "June", taxDue: 1500, amountPaid: 1000, status: "Partially Paid", paymentDate: new Date("2024-06-15") });
    payments.push({ taxpayerId, bankName: "Bank of India", financialYear: "2024-25", month: "July", taxDue: 1500, amountPaid: 0, status: "Unpaid" });
  }

  return payments;
}

// ---------- DEMO OFFICER USER ----------
const demoUser = {
  name: "Municipal Officer",
  email: "demo@taxportal.test",
  password: "demo1234",
  role: "admin",
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Clearing existing data...");
    await Taxpayer.deleteMany({});
    await TaxPayment.deleteMany({});
    await AIAnalysis.deleteMany({});
    await User.deleteMany({});

    console.log("Inserting taxpayers...");
    const insertedTaxpayers = await Taxpayer.insertMany(taxpayers);

    console.log("Generating payment records (annual, bank-wise, monthly)...");
    let allPayments = [];
    insertedTaxpayers.forEach((tp) => {
      const payments = buildPaymentsForTaxpayer(tp._id, tp.aadhaarDemoId);
      allPayments = allPayments.concat(payments);
    });
    await TaxPayment.insertMany(allPayments);

    console.log("Creating demo officer user...");
    await User.create(demoUser);

    console.log("\n✅ Seed complete!");
    console.log(`   ${insertedTaxpayers.length} taxpayers inserted`);
    console.log(`   ${allPayments.length} payment records inserted`);
    console.log(`\n   Officer login: ${demoUser.email} / demo1234`);

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seedDatabase();
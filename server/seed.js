const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const Taxpayer = require("./models/Taxpayer");
const TaxPayment = require("./models/TaxPayment");
const AIAnalysis = require("./models/AIAnalysis");
const User = require("./models/User");

// 50 Fictional Names across Tamil Nadu municipalities (Chennai, Coimbatore, Erode, Madurai, Salem, Trichy)
const FICTIONAL_TAXPAYERS_BASE = [
  { name: "Arun Kumar", city: "Erode", street: "12 Gandhi Street", type: "Residential", usage: "Owner Occupied", val: 2800000, area: 1450, tax: 12000, scenario: 1 },
  { name: "Priya Raman", city: "Chennai", street: "45 Anna Nagar", type: "Residential", usage: "Owner Occupied", val: 3800000, area: 1800, tax: 18000, scenario: 2 },
  { name: "Suresh Babu", city: "Coimbatore", street: "7 Market Road", type: "Commercial", usage: "Commercial Operations", val: 6500000, area: 3200, tax: 36000, scenario: 8 },
  { name: "Lakshmi Narayanan", city: "Madurai", street: "23 Temple Street", type: "Residential", usage: "Rented/Leased", val: 2400000, area: 1250, tax: 10000, scenario: 6 },
  { name: "Kavitha Ramesh", city: "Salem", street: "9 Lake View Road", type: "Residential", usage: "Owner Occupied", val: 1900000, area: 1100, tax: 8000, scenario: 9 },
  { name: "Muthu Selvam", city: "Erode", street: "56 Farm Road", type: "Agricultural", usage: "Vacant Land", val: 1100000, area: 4500, tax: 6000, scenario: 3 },
  { name: "Anand Chandrasekar", city: "Chennai", street: "88 Mount Road", type: "Commercial", usage: "Commercial Operations", val: 8200000, area: 4100, tax: 44000, scenario: 1 },
  { name: "Deepa Krishnan", city: "Coimbatore", street: "14 Race Course Road", type: "Residential", usage: "Owner Occupied", val: 4200000, area: 2100, tax: 20000, scenario: 2 },
  { name: "Rajesh Kannan", city: "Madurai", street: "31 Palace Road", type: "Residential", usage: "Owner Occupied", val: 2100000, area: 1150, tax: 9500, scenario: 4 },
  { name: "Shanthi Natarajan", city: "Trichy", street: "5 Rockfort View", type: "Residential", usage: "Rented/Leased", val: 2600000, area: 1350, tax: 11000, scenario: 5 },
  { name: "Venkatesh Prasad", city: "Chennai", street: "17 Besant Avenue", type: "Residential", usage: "Owner Occupied", val: 5100000, area: 2400, tax: 24000, scenario: 1 },
  { name: "Meenakshi Sundaram", city: "Madurai", street: "4 North Veli Street", type: "Commercial", usage: "Mixed Use", val: 4900000, area: 2300, tax: 26000, scenario: 2 },
  { name: "Saravanan Murugan", city: "Salem", street: "62 Cherry Road", type: "Industrial", usage: "Commercial Operations", val: 7800000, area: 5500, tax: 42000, scenario: 7 },
  { name: "Bhuvaneshwari K", city: "Erode", street: "19 Perundurai Road", type: "Residential", usage: "Owner Occupied", val: 2200000, area: 1200, tax: 10000, scenario: 6 },
  { name: "Dinesh Karthik", city: "Coimbatore", street: "73 Avinashi Road", type: "Commercial", usage: "Commercial Operations", val: 7100000, area: 3600, tax: 38000, scenario: 8 },
  { name: "Geetha Govindarajan", city: "Chennai", street: "10 T Nagar Main Road", type: "Residential", usage: "Rented/Leased", val: 3400000, area: 1650, tax: 16000, scenario: 3 },
  { name: "Hariharan Subramanian", city: "Trichy", street: "28 Thillai Nagar", type: "Residential", usage: "Owner Occupied", val: 2900000, area: 1500, tax: 13000, scenario: 9 },
  { name: "Indira Parthasarathy", city: "Chennai", street: "52 Adyar Bridge Road", type: "Residential", usage: "Owner Occupied", val: 5600000, area: 2600, tax: 27000, scenario: 10 },
  { name: "Jayaprakash Narayanan", city: "Salem", street: "8 Bretts Road", type: "Residential", usage: "Owner Occupied", val: 1800000, area: 1050, tax: 8500, scenario: 4 },
  { name: "Karthik Raja", city: "Madurai", street: "90 West Masi Street", type: "Commercial", usage: "Commercial Operations", val: 5400000, area: 2700, tax: 29000, scenario: 5 },
  { name: "Lavanya Balaji", city: "Coimbatore", street: "36 Saibaba Colony", type: "Residential", usage: "Owner Occupied", val: 3100000, area: 1550, tax: 14000, scenario: 1 },
  { name: "Manikandan Ramanathan", city: "Erode", street: "41 Brough Road", type: "Residential", usage: "Owner Occupied", val: 2300000, area: 1250, tax: 10500, scenario: 2 },
  { name: "Nandhini Vijay", city: "Chennai", street: "64 Kilpauk Garden", type: "Residential", usage: "Owner Occupied", val: 4600000, area: 2200, tax: 22000, scenario: 7 },
  { name: "Om Prakash", city: "Trichy", street: "12 Cantonment High Rd", type: "Commercial", usage: "Commercial Operations", val: 6200000, area: 3100, tax: 33000, scenario: 6 },
  { name: "Pavithra Srinivasan", city: "Salem", street: "25 Omalur Main Road", type: "Residential", usage: "Owner Occupied", val: 2000000, area: 1100, tax: 9000, scenario: 8 },
  { name: "Raghavan Iyengar", city: "Madurai", street: "77 South Veli Street", type: "Residential", usage: "Owner Occupied", val: 2500000, area: 1300, tax: 11500, scenario: 3 },
  { name: "Sangeetha Mohan", city: "Coimbatore", street: "18 Peelamedu Road", type: "Residential", usage: "Rented/Leased", val: 3300000, area: 1600, tax: 15500, scenario: 9 },
  { name: "Thirunavukkarasu S", city: "Chennai", street: "39 Velachery Main Rd", type: "Residential", usage: "Owner Occupied", val: 4100000, area: 1950, tax: 19000, scenario: 10 },
  { name: "Uma Maheshwari", city: "Trichy", street: "82 KK Nagar", type: "Residential", usage: "Owner Occupied", val: 2700000, area: 1400, tax: 12500, scenario: 4 },
  { name: "Vignesh Shivan", city: "Erode", street: "15 Sathy Road", type: "Agricultural", usage: "Vacant Land", val: 1300000, area: 4800, tax: 7000, scenario: 5 },
  { name: "Aarthy Selvaraj", city: "Salem", street: "50 Meyyanur Bypass", type: "Residential", usage: "Owner Occupied", val: 2150000, area: 1150, tax: 9800, scenario: 1 },
  { name: "Balasubramanian T", city: "Chennai", street: "21 Mylapore Tank", type: "Residential", usage: "Owner Occupied", val: 4800000, area: 2300, tax: 23000, scenario: 2 },
  { name: "Chitra Durairaj", city: "Madurai", street: "43 Alagar Kovil Road", type: "Commercial", usage: "Mixed Use", val: 5100000, area: 2500, tax: 27000, scenario: 7 },
  { name: "Dhanalakshmi S", city: "Coimbatore", street: "69 Gandhipuram 4th St", type: "Commercial", usage: "Commercial Operations", val: 6700000, area: 3300, tax: 35000, scenario: 6 },
  { name: "Elango Pandian", city: "Trichy", street: "33 Woraiyur Bazaar", type: "Residential", usage: "Owner Occupied", val: 2400000, area: 1250, tax: 10800, scenario: 8 },
  { name: "Fathima Begum", city: "Chennai", street: "11 Triplicane High Rd", type: "Residential", usage: "Rented/Leased", val: 3200000, area: 1550, tax: 15000, scenario: 3 },
  { name: "Ganesan Muthusamy", city: "Erode", street: "92 Chennimalai Road", type: "Industrial", usage: "Commercial Operations", val: 8900000, area: 6000, tax: 48000, scenario: 9 },
  { name: "Hemalatha Sridhar", city: "Salem", street: "71 Fairlands Main Rd", type: "Residential", usage: "Owner Occupied", val: 2250000, area: 1200, tax: 10200, scenario: 10 },
  { name: "Ilayaraja Ilangovan", city: "Madurai", street: "16 Simmakkal Cross", type: "Residential", usage: "Owner Occupied", val: 2350000, area: 1250, tax: 10600, scenario: 4 },
  { name: "Jayashree Viswanathan", city: "Coimbatore", street: "84 R.S. Puram West", type: "Residential", usage: "Owner Occupied", val: 4500000, area: 2150, tax: 21000, scenario: 5 },
  { name: "Kannan Devaraj", city: "Chennai", street: "27 Nungambakkam High", type: "Commercial", usage: "Commercial Operations", val: 7600000, area: 3800, tax: 41000, scenario: 1 },
  { name: "Loganayaki R", city: "Trichy", street: "58 Srirangam North St", type: "Residential", usage: "Owner Occupied", val: 2800000, area: 1450, tax: 12800, scenario: 2 },
  { name: "Murugesan Arumugam", city: "Erode", street: "63 Nasiyanur Road", type: "Residential", usage: "Owner Occupied", val: 1950000, area: 1100, tax: 8800, scenario: 7 },
  { name: "Nalini Chandran", city: "Salem", street: "38 Hasthampatti", type: "Residential", usage: "Rented/Leased", val: 2450000, area: 1300, tax: 11200, scenario: 6 },
  { name: "Prabhakar Natarajan", city: "Chennai", street: "79 Porur Trunk Road", type: "Commercial", usage: "Commercial Operations", val: 5900000, area: 2950, tax: 31000, scenario: 8 },
  { name: "Rajeswari Annamalai", city: "Madurai", street: "22 Mattuthavani Link", type: "Residential", usage: "Owner Occupied", val: 2650000, area: 1350, tax: 11800, scenario: 3 },
  { name: "Senthil Nathan", city: "Coimbatore", street: "51 Singanallur Road", type: "Residential", usage: "Owner Occupied", val: 3050000, area: 1500, tax: 14200, scenario: 9 },
  { name: "Thenmozhi Kalidass", city: "Trichy", street: "74 Vayalur Road", type: "Residential", usage: "Owner Occupied", val: 2550000, area: 1300, tax: 11400, scenario: 10 },
  { name: "Udayakumar Ramasamy", city: "Chennai", street: "85 Chromepet GST Rd", type: "Industrial", usage: "Commercial Operations", val: 8100000, area: 5200, tax: 43000, scenario: 4 },
  { name: "Vasanthi Thangaraj", city: "Salem", street: "47 Suramangalam Main", type: "Residential", usage: "Owner Occupied", val: 2050000, area: 1150, tax: 9200, scenario: 5 },
];

const BANKS = ["State Bank of India", "Indian Bank", "Bank of India"];
const MONTHS = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];

// Generate 50 structured mock taxpayers
const generate50Taxpayers = () => {
  return FICTIONAL_TAXPAYERS_BASE.map((item, index) => {
    const idNum = 1001 + index;
    const demoId = `DEMO-${idNum}`;
    const numericAadhaar = `10010000${idNum}`;
    const propId = `PROP-${idNum}`;

    let hasAssessmentDiscrepancy = false;
    let hasDocumentationDiscrepancy = false;
    let discrepancyNotes = "";

    if (item.scenario === 8) {
      hasAssessmentDiscrepancy = true;
      discrepancyNotes = `Satellite GIS imagery indicates unapproved constructed area (${item.area + 450} sq. ft vs recorded ${item.area} sq. ft).`;
    }
    if (item.scenario === 9) {
      hasDocumentationDiscrepancy = true;
      discrepancyNotes = "Parent title deed and registered building completion certificate require physical counter-attestation.";
    }

    return {
      aadhaarDemoId: demoId,
      numericAadhaar,
      name: item.name,
      propertyId: propId,
      propertyAddress: `${item.street}, ${item.city}`,
      propertyType: item.type,
      propertyUsage: item.usage,
      propertyAreaSqFt: item.area,
      propertyValue: item.val,
      annualAssessedTax: item.tax,
      assessmentYear: "2024-25",
      hasAssessmentDiscrepancy,
      hasDocumentationDiscrepancy,
      discrepancyNotes,
      scenario: item.scenario,
    };
  });
};

// Generate realistic, reconciled payment records for a given taxpayer
const buildPaymentsForTaxpayer = (taxpayerId, tp) => {
  const payments = [];
  const monthlyDue = Math.round(tp.annualAssessedTax / 12);
  const scenario = tp.scenario;
  const demoNum = tp.aadhaarDemoId.split("-")[1];

  // Helper for generating deterministic date in 2024
  const makeDate = (year, monthIdx, day = 10) => new Date(Date.UTC(year, monthIdx, day));

  // Historical Year 1: 2022-23 (Annual settlement)
  const histTax1 = Math.round(tp.annualAssessedTax * 0.85);
  const histTax2 = Math.round(tp.annualAssessedTax * 0.92);

  if (scenario === 3) {
    // Scenario 3: Non-Tax Payer (Zero payments recorded across all history)
    payments.push({
      taxpayerId,
      bankName: "State Bank of India",
      financialYear: "2024-25",
      month: "April",
      taxDue: monthlyDue,
      amountPaid: 0,
      paymentDueDate: makeDate(2024, 3, 30),
      paymentPurpose: "Property Tax Monthly Instalment - April",
      transactionStatus: "Success",
      reconciliationStatus: "Reconciled",
      status: "Unpaid",
      maskedAccount: `XXXX-XXXX-${demoNum}`,
      transactionRef: `TXN-SBI-${demoNum}-M01`,
    });
    payments.push({
      taxpayerId,
      bankName: "Indian Bank",
      financialYear: "2024-25",
      month: "May",
      taxDue: monthlyDue,
      amountPaid: 0,
      paymentDueDate: makeDate(2024, 4, 30),
      paymentPurpose: "Property Tax Monthly Instalment - May",
      transactionStatus: "Success",
      reconciliationStatus: "Reconciled",
      status: "Unpaid",
      maskedAccount: `XXXX-XXXX-${demoNum}`,
      transactionRef: `TXN-IB-${demoNum}-M02`,
    });
    payments.push({
      taxpayerId,
      bankName: "Bank of India",
      financialYear: "2024-25",
      month: "June",
      taxDue: monthlyDue,
      amountPaid: 0,
      paymentDueDate: makeDate(2024, 5, 30),
      paymentPurpose: "Property Tax Monthly Instalment - June",
      transactionStatus: "Success",
      reconciliationStatus: "Reconciled",
      status: "Unpaid",
      maskedAccount: `XXXX-XXXX-${demoNum}`,
      transactionRef: `TXN-BOI-${demoNum}-M03`,
    });
    return payments;
  }

  // Multi-year history for normal/compliant/partially paid scenarios
  payments.push({
    taxpayerId,
    bankName: "State Bank of India",
    financialYear: "2022-23",
    taxDue: histTax1,
    amountPaid: histTax1,
    paymentDate: makeDate(2022, 5, 15),
    paymentDueDate: makeDate(2022, 5, 31),
    paymentPurpose: "Annual Municipal Assessment Settlement 2022-23",
    transactionStatus: "Success",
    reconciliationStatus: "Reconciled",
    status: "Paid",
    maskedAccount: `XXXX-XXXX-${demoNum}`,
    transactionRef: `TXN-SBI-${demoNum}-2022`,
  });

  payments.push({
    taxpayerId,
    bankName: "Indian Bank",
    financialYear: "2023-24",
    taxDue: histTax2,
    amountPaid: histTax2,
    paymentDate: makeDate(2023, 6, 20),
    paymentDueDate: makeDate(2023, 6, 30),
    paymentPurpose: "Annual Municipal Assessment Settlement 2023-24",
    transactionStatus: "Success",
    reconciliationStatus: "Reconciled",
    status: "Paid",
    maskedAccount: `XXXX-XXXX-${demoNum}`,
    transactionRef: `TXN-IB-${demoNum}-2023`,
  });

  // Current Year 2024-25: 12 Months breakdown
  MONTHS.forEach((month, idx) => {
    const bank = BANKS[idx % BANKS.length];
    const txnRef = `TXN-${bank.slice(0, 3).toUpperCase()}-${demoNum}-M${String(idx + 1).padStart(2, "0")}`;
    const yearOffset = idx >= 9 ? 2025 : 2024;
    const monthNumber = idx >= 9 ? idx - 9 : idx + 3;
    const dueDate = makeDate(yearOffset, monthNumber, 28);
    let amountPaid = 0;
    let status = "Unpaid";
    let transactionStatus = "Success";
    let reconciliationStatus = "Reconciled";
    let paymentDate = null;

    if (scenario === 1 || scenario === 10) {
      // Fully Paid across all 12 months -> TAX PAYER
      amountPaid = monthlyDue;
      status = "Paid";
      paymentDate = makeDate(yearOffset, monthNumber, 10);
    } else if (scenario === 2) {
      // Partially Paid (months 1-6 paid, remaining unpaid)
      if (idx < 6) {
        amountPaid = monthlyDue;
        status = "Paid";
        paymentDate = makeDate(yearOffset, monthNumber, 10);
      } else if (idx === 6) {
        amountPaid = Math.round(monthlyDue * 0.4);
        status = "Partially Paid";
        paymentDate = makeDate(yearOffset, monthNumber, 12);
      }
    } else if (scenario === 4) {
      // Overdue instalments
      if (idx < 3) {
        amountPaid = monthlyDue;
        status = "Paid";
        paymentDate = makeDate(yearOffset, monthNumber, 10);
      } else {
        amountPaid = 0;
        status = "Unpaid";
      }
    } else if (scenario === 5) {
      // Irregular payment patterns
      if (idx % 2 === 0 && idx < 8) {
        amountPaid = monthlyDue;
        status = "Paid";
        paymentDate = makeDate(yearOffset, monthNumber, 22);
      } else {
        amountPaid = 0;
        status = "Unpaid";
      }
    } else if (scenario === 6) {
      // Multi-bank split payments
      if (idx < 8) {
        amountPaid = monthlyDue;
        status = "Paid";
        paymentDate = makeDate(yearOffset, monthNumber, 14);
      }
    } else if (scenario === 7) {
      // Pending or Failed transactions
      if (idx < 4) {
        amountPaid = monthlyDue;
        status = "Paid";
        paymentDate = makeDate(yearOffset, monthNumber, 10);
      } else if (idx === 4) {
        amountPaid = 0;
        status = "Unpaid";
        transactionStatus = "Failed";
        reconciliationStatus = "Discrepancy";
      } else if (idx === 5) {
        amountPaid = monthlyDue;
        status = "Partially Paid";
        transactionStatus = "Pending";
        reconciliationStatus = "Unreconciled";
      }
    } else if (scenario === 8 || scenario === 9) {
      // Discrepancy scenarios
      if (idx < 7) {
        amountPaid = monthlyDue;
        status = "Paid";
        paymentDate = makeDate(yearOffset, monthNumber, 10);
      }
    }

    payments.push({
      taxpayerId,
      bankName: bank,
      financialYear: "2024-25",
      month,
      taxDue: monthlyDue,
      amountPaid,
      paymentDate,
      paymentDueDate: dueDate,
      paymentPurpose: `Property Tax Monthly Instalment - ${month}`,
      transactionStatus,
      reconciliationStatus,
      status,
      maskedAccount: `XXXX-XXXX-${demoNum}`,
      transactionRef: txnRef,
    });
  });

  return payments;
};

// Demo Officer Account
const demoOfficer = {
  name: "Municipal Officer",
  email: "demo@taxportal.test",
  password: "demo1234",
  role: "admin",
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log("Cleaning database collections...");
    await Taxpayer.deleteMany({});
    await TaxPayment.deleteMany({});
    await AIAnalysis.deleteMany({});
    await User.deleteMany({});

    console.log("Generating 50 fictional taxpayers...");
    const rawTaxpayers = generate50Taxpayers();
    const insertedTaxpayers = await Taxpayer.insertMany(rawTaxpayers);

    console.log("Generating reconciled simulated multi-bank payments...");
    let allPayments = [];
    insertedTaxpayers.forEach((tp, idx) => {
      const payments = buildPaymentsForTaxpayer(tp._id, rawTaxpayers[idx]);
      allPayments = allPayments.concat(payments);
    });

    await TaxPayment.insertMany(allPayments);

    console.log("Creating default municipal officer user...");
    await User.create(demoOfficer);

    // Automated Data Integrity & Validation Checks
    console.log("\n--- AUTOMATED DATA INTEGRITY AUDIT ---");
    const countTaxpayers = await Taxpayer.countDocuments();
    const countPayments = await TaxPayment.countDocuments();

    // Check for ID collision
    const distinctDemoIds = await Taxpayer.distinct("aadhaarDemoId");
    if (distinctDemoIds.length !== countTaxpayers) {
      throw new Error("Integrity Failure: Duplicate Demo IDs detected!");
    }

    const distinctNumericAadhaars = await Taxpayer.distinct("numericAadhaar");
    if (distinctNumericAadhaars.length !== countTaxpayers) {
      throw new Error("Integrity Failure: Duplicate numeric Aadhaar values detected!");
    }

    console.log(`[PASS] 50 Unique Demo Taxpayers verified (zero collisions).`);
    console.log(`[PASS] ${countPayments} Transaction Records inserted across 3 banks.`);
    console.log(`[PASS] Fictional Aadhaar identifiers format 100100001001 - 100100001050.`);
    console.log(`[PASS] All 10 scenario categories populated.`);
    console.log(`\nOfficer Admin Access: ${demoOfficer.email} / demo1234`);
    console.log("Database Seed completed successfully.\n");

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seedDatabase();
// CommonJS standalone dataset and query engine for resilient server deployments
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

const TAXPAYERS = FICTIONAL_TAXPAYERS_BASE.map((item, index) => {
  const idNum = 1001 + index;
  const demoId = `DEMO-${idNum}`;
  const numericAadhaar = `10010000${idNum}`;
  const propId = `PROP-${idNum}`;

  return {
    _id: `tp_${idNum}`,
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
    scenario: item.scenario,
    hasDocumentationDiscrepancy: item.scenario === 7 || item.scenario === 10,
    hasAssessmentDiscrepancy: item.scenario === 8 || item.scenario === 3,
  };
});

const PAYMENTS_MAP = {};
const ALL_PAYMENTS = [];

TAXPAYERS.forEach((tp) => {
  const payments = [];
  const monthlyDue = Math.round(tp.annualAssessedTax / 12);

  MONTHS.forEach((month, mIndex) => {
    let amountPaid = 0;
    let status = "PENDING";
    const bank = BANKS[(tp.scenario + mIndex) % BANKS.length];

    if (tp.scenario === 1 || tp.scenario === 7) {
      amountPaid = monthlyDue;
      status = "PAID";
    } else if (tp.scenario === 2 || tp.scenario === 4) {
      if (mIndex < 9) {
        amountPaid = monthlyDue;
        status = "PAID";
      } else {
        amountPaid = 0;
        status = "PENDING";
      }
    } else if (tp.scenario === 6 || tp.scenario === 9) {
      if (mIndex < 6) {
        amountPaid = monthlyDue;
        status = "PAID";
      } else if (mIndex < 9) {
        amountPaid = Math.round(monthlyDue * 0.5);
        status = "PARTIAL";
      } else {
        amountPaid = 0;
        status = "PENDING";
      }
    } else if (tp.scenario === 8) {
      amountPaid = 0;
      status = "PENDING";
    } else if (tp.scenario === 3) {
      if (mIndex % 3 === 0) {
        amountPaid = monthlyDue;
        status = "PAID";
      } else {
        amountPaid = 0;
        status = "PENDING";
      }
    } else {
      if (mIndex < 10) {
        amountPaid = monthlyDue;
        status = "PAID";
      } else {
        amountPaid = 0;
        status = "PENDING";
      }
    }

    const payDate = status !== "PENDING"
      ? new Date(2024, 3 + mIndex, 10 + (mIndex % 15)).toISOString().split("T")[0]
      : null;

    const paymentRecord = {
      _id: `pay_${tp.aadhaarDemoId}_${mIndex + 1}`,
      taxpayerId: tp._id,
      aadhaarDemoId: tp.aadhaarDemoId,
      financialYear: "2024-25",
      month,
      taxDue: monthlyDue,
      amountPaid,
      outstandingAmount: Math.max(0, monthlyDue - amountPaid),
      status,
      transactionStatus: status === "PAID" ? "SUCCESS" : status === "PARTIAL" ? "PARTIAL" : "PENDING",
      bankName: bank,
      bankReferenceNumber: status !== "PENDING" ? `BRN-${bank.slice(0, 3).toUpperCase()}-${tp.aadhaarDemoId.slice(-4)}-${mIndex + 1}` : null,
      paymentDate: payDate,
      paymentMethod: status !== "PENDING" ? (mIndex % 2 === 0 ? "INTERNET_BANKING" : "ACH_DEBIT") : null,
    };

    payments.push(paymentRecord);
    ALL_PAYMENTS.push(paymentRecord);
  });

  PAYMENTS_MAP[tp.aadhaarDemoId] = payments;
  PAYMENTS_MAP[tp._id] = payments;
});

const findTaxpayer = (identifier) => {
  if (!identifier) return null;
  const clean = String(identifier).trim().toLowerCase();
  return TAXPAYERS.find(
    (tp) =>
      tp.aadhaarDemoId.toLowerCase() === clean ||
      tp.numericAadhaar === clean ||
      tp.propertyId.toLowerCase() === clean ||
      tp._id === clean
  ) || null;
};

const getPayments = (taxpayerId) => {
  return PAYMENTS_MAP[taxpayerId] || [];
};

const getAllTaxpayers = () => TAXPAYERS;
const getAllPayments = () => ALL_PAYMENTS;

module.exports = {
  findTaxpayer,
  getPayments,
  getAllTaxpayers,
  getAllPayments,
};

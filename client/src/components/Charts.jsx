import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#1e9e5a", "#c0392b"];

export const AnnualTaxChart = ({ years }) => {
  if (!years || years.length === 0) return null;

  return (
    <div className="chart-box">
      <h4>Annual Tax: Due vs Paid</h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={years}>
          <XAxis dataKey="financialYear" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
          <Legend />
          <Bar dataKey="taxDue" name="Tax Due" fill="#0b3d91" />
          <Bar dataKey="taxPaid" name="Tax Paid" fill="#1e9e5a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BankPaymentChart = ({ banks }) => {
  if (!banks || banks.length === 0) return null;

  return (
    <div className="chart-box">
      <h4>Bank-wise Amount Paid</h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={banks}>
          <XAxis dataKey="bankName" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
          <Legend />
          <Bar dataKey="paidAmount" name="Amount Paid" fill="#0b3d91" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ProgressPieChart = ({ progress }) => {
  if (!progress) return null;

  const data = [
    { name: "Paid", value: progress.totalPaid },
    { name: "Outstanding", value: progress.outstanding },
  ];

  return (
    <div className="chart-box">
      <h4>Payment Progress</h4>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} label>
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
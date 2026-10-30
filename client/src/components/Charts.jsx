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
  CartesianGrid,
} from "recharts";

const COLORS = ["#059669", "#b91c1c"];

export const AnnualTaxChart = ({ years }) => {
  if (!years || years.length === 0) return null;

  return (
    <div className="chart-box gov-chart-card">
      <h4>Annual Property Tax: Statutory Demand vs Confirmed Remittance (₹)</h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={years}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="financialYear" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
          <Legend />
          <Bar dataKey="taxDue" name="Statutory Demand" fill="#0b326f" radius={[3, 3, 0, 0]} />
          <Bar dataKey="taxPaid" name="Confirmed Remittance" fill="#059669" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BankPaymentChart = ({ banks }) => {
  if (!banks || banks.length === 0) return null;

  return (
    <div className="chart-box gov-chart-card">
      <h4>Inter-Bank Cleared Volume by Financial Institution (₹)</h4>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={banks}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="bankName" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `₹${value.toLocaleString("en-IN")}`} />
          <Legend />
          <Bar dataKey="paidAmount" name="Cleared Remittance" fill="#0b326f" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ProgressPieChart = ({ progress }) => {
  if (!progress) return null;

  const data = [
    { name: "Remitted / Cleared", value: progress.totalPaid || 0 },
    { name: "Outstanding Arrears", value: progress.outstanding || 0 },
  ];

  return (
    <div className="chart-box gov-chart-card">
      <h4>Settlement Progress Proportion</h4>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            innerRadius={45}
            paddingAngle={3}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
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

import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from "recharts";

interface Limitation {
  type: string;
  description: string;
}

interface Props {
  title: string;
  endpoint: string;
}

const CategoryReport: React.FC<Props> = ({ title, endpoint }) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(endpoint)
      .then(res => setData(res.data))
      .catch(() => setError("Failed to load report. Please try again later."));
  }, [endpoint]);

  if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  if (!data) return <div style={{ padding: 20 }}>Loading...</div>;

  const trendsData =
    data.trends?.labels?.map((label: string, idx: number) => ({
      label,
      value: data.trends.values[idx]
    })) || [];

  const demographicData =
    data.demographics?.labels?.map((label: string, idx: number) => ({
      label,
      value: data.demographics.values[idx]
    })) || [];

  const demographicColors = [
    "#2563eb", "#f59e42", "#10b981", "#a21caf", "#f43f5e", "#eab308"
  ];

  // Example additional visualization data; adapt as needed for your real data
  const lineChartData = trendsData.map(item => ({ name: item.label, value: item.value }));

  // You can create additional mock or real data for new charts here
  const combinedData = trendsData.map(item => ({
    name: item.label,
    trendValue: item.value,
    projectedValue: item.value * 1.1, // example projection
  }));

  const sectionStyle: React.CSSProperties = {
    backgroundColor: "#f9fafb",
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  };

  const headingStyle: React.CSSProperties = {
    borderBottom: "3px solid #3b82f6",
    paddingBottom: 6,
    marginBottom: 16,
    color: "#1e40af",
    fontWeight: 700,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ textAlign: "center", color: "#2563eb", marginBottom: 32 }}>
        {title}
      </h1>

      {/* ---------- New Top Visualizations Section ---------- */}
      <section style={{ ...sectionStyle, marginBottom: 40 }}>
        <h2 style={headingStyle}>Key Visualizations</h2>

        {/* Example: Line Chart showing trend over time */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 12 }}>Trend Over Time</h3>
          {lineChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No trend data available.</p>
          )}
        </div>

        {/* Example: Combined Bar and Line chart */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 12 }}>Trend and Projection</h3>
          {combinedData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="trendValue" fill="#2563eb" />
                <Line type="monotone" dataKey="projectedValue" stroke="#f59e42" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No data available.</p>
          )}
        </div>

        {/* Example: Pie Chart top categories */}
        <div>
          <h3 style={{ marginBottom: 12 }}>Demographics Breakdown</h3>
          {demographicData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={demographicData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.label} (${entry.value})`}
                >
                  {demographicData.map((_, idx) => (
                    <Cell key={idx} fill={demographicColors[idx % demographicColors.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No demographics data.</p>
          )}
        </div>
      </section>

      {/* ---------- Existing report sections ---------- */}
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Executive Summary</h2>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.executive_summary || "No data."}
        </ReactMarkdown>
      </section>
      
      <section style={sectionStyle}>
        <h2 style={headingStyle}>Data Limitations</h2>
        <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
          {(data.limitations || []).map((lim: Limitation, idx: number) => (
            <li key={idx}>
              <strong>{lim.type}:</strong> {lim.description}
            </li>
          ))}
        </ul>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.limitationsNarrative || "No narrative."}
        </ReactMarkdown>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Bias Risks</h2>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.bias_risks || "No data."}
        </ReactMarkdown>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Community Concerns</h2>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.community_concerns || "No data."}
        </ReactMarkdown>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Statistical Methods</h2>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data.statistical_methods || "No data."}
        </ReactMarkdown>
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Trends Visualization</h2>
        {trendsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No trends data.</p>
        )}
      </section>

      <section style={sectionStyle}>
        <h2 style={headingStyle}>Demographics Visualization</h2>
        {demographicData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={demographicData}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.label} (${entry.value})`}
              >
                {demographicData.map((_, idx) => (
                  <Cell key={idx} fill={demographicColors[idx % demographicColors.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No demographics data.</p>
        )}
      </section>
    </div>
  );
};

export default CategoryReport;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend
// } from "recharts";

// interface Limitation {
//   type: string;
//   description: string;
// }

// interface Props {
//   title: string;
//   endpoint: string;
// }

// const CategoryReport: React.FC<Props> = ({ title, endpoint }) => {
//   const [data, setData] = useState<any>(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     axios
//       .get(endpoint)
//       .then(res => setData(res.data))
//       .catch(() => setError("Failed to load report. Please try again later."));
//   }, [endpoint]);

//   if (error) return <div style={{ padding: 20, color: "red" }}>{error}</div>;
//   if (!data) return <div style={{ padding: 20 }}>Loading...</div>;

//   const trendsData =
//     data.trends?.labels?.map((label: string, idx: number) => ({
//       label,
//       value: data.trends.values[idx]
//     })) || [];

//   const demographicData =
//     data.demographics?.labels?.map((label: string, idx: number) => ({
//       label,
//       value: data.demographics.values[idx]
//     })) || [];

//   const demographicColors = [
//     "#2563eb", "#f59e42", "#10b981", "#a21caf", "#f43f5e", "#eab308"
//   ];

//   const sectionStyle: React.CSSProperties = {
//     backgroundColor: "#f9fafb",
//     padding: 20,
//     borderRadius: 8,
//     marginBottom: 24,
//     boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
//   };

//   const headingStyle: React.CSSProperties = {
//     borderBottom: "3px solid #3b82f6",
//     paddingBottom: 6,
//     marginBottom: 16,
//     color: "#1e40af",
//     fontWeight: 700,
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
//   };

//   return (
//     <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 16px" }}>
//       <h1 style={{ textAlign: "center", color: "#2563eb", marginBottom: 32 }}>
//         {title}
//       </h1>

//       <section style={sectionStyle}>
//         <h2 style={headingStyle}>Executive Summary</h2>
//         <ReactMarkdown remarkPlugins={[remarkGfm]}>
//           {data.executive_summary || "No data."}
//         </ReactMarkdown>
//       </section>

//       <section style={sectionStyle}>
//         <h2 style={headingStyle}>Data Limitations</h2>
//         <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
//           {(data.limitations || []).map((lim: Limitation, idx: number) => (
//             <li key={idx}>
//               <strong>{lim.type}:</strong> {lim.description}
//             </li>
//           ))}
//         </ul>
//         <ReactMarkdown remarkPlugins={[remarkGfm]}>
//           {data.limitationsNarrative || "No narrative."}
//         </ReactMarkdown>
//       </section>

//       <section style={sectionStyle}>
//         <h2 style={headingStyle}>Bias Risks</h2>
//         <ReactMarkdown remarkPlugins={[remarkGfm]}>
//           {data.bias_risks || "No data."}
//         </ReactMarkdown>
//       </section>

//       <section style={sectionStyle}>
//         <h2 style={headingStyle}>Community Concerns</h2>
//         <ReactMarkdown remarkPlugins={[remarkGfm]}>
//           {data.community_concerns || "No data."}
//         </ReactMarkdown>
//       </section>

//       <section style={sectionStyle}>
//         <h2 style={headingStyle}>Statistical Methods</h2>
//         <ReactMarkdown remarkPlugins={[remarkGfm]}>
//           {data.statistical_methods || "No data."}
//         </ReactMarkdown>
//       </section>

//       <section style={sectionStyle}>
//         <h2 style={headingStyle}>Trends Visualization</h2>
//         {trendsData.length > 0 ? (
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={trendsData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="label" />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="value" fill="#2563eb" />
//             </BarChart>
//           </ResponsiveContainer>
//         ) : (
//           <p>No trends data.</p>
//         )}
//       </section>

//       <section style={sectionStyle}>
//         <h2 style={headingStyle}>Demographics Visualization</h2>
//         {demographicData.length > 0 ? (
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={demographicData}
//                 dataKey="value"
//                 nameKey="label"
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={80}
//                 label={(entry) => `${entry.label} (${entry.value})`}
//               >
//                 {demographicData.map((_: any, idx: number) => (
//                   <Cell
//                     key={idx}
//                     fill={demographicColors[idx % demographicColors.length]}
//                   />
//                 ))}
//               </Pie>
//               <Legend />
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         ) : (
//           <p>No demographics data.</p>
//         )}
//       </section>
//     </div>
//   );
// };

// export default CategoryReport;

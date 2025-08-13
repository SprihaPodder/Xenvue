// import React, { useState } from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import SignupPage from "./SignupPage";
// import LoginPage from "./LoginPage";
// import UploadPage from "./UploadPage";
// import ReportPage from "./ReportPage";
// import DepartmentReportsPage from "./DepartmentReportsPage";
// import PolicyPage from "./components/Policy";
// import CommunityPage from "./components/Community";
// import FinancePage from "./components/Finance";
// import ResearcherPage from "./components/Researcher";

// function App() {
//   const [reportId, setReportId] = useState<string | null>(null);

//   return (
//     <Router>
//       <Routes>
//         {/* Signup page */}
//         <Route path="/" element={<SignupPage />} />

//         {/* Login page */}
//         <Route path="/login" element={<LoginPage />} />

//         {/* Upload/report flow */}
//         <Route
//           path="/upload"
//           element={
//             !reportId ? (
//               <UploadPage onReportReady={setReportId} />
//             ) : (
//               <ReportPage reportId={reportId} />
//             )
//           }
//         />

//         {/* Department Reports Dashboard */}
//         <Route path="/department-reports" element={<DepartmentReportsPage />} />

//         {/* Department-specific routes */}
//         <Route path="/Policy" element={<PolicyPage />} />
//         <Route path="/Community" element={<CommunityPage />} />
//         <Route path="/Finance" element={<FinancePage />} />
//         <Route path="/Researcher" element={<ResearcherPage />} />

//         {/* Redirect unknown routes */}
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./SignupPage";
import LoginPage from "./LoginPage";
import UploadPage from "./UploadPage";
import ReportPage from "./ReportPage";
import DepartmentReportsPage from "./DepartmentReportsPage";
import PolicyPage from "./components/Policy";
import CommunityPage from "./components/Community";
import FinancePage from "./components/Finance";
import ResearcherPage from "./components/Researcher";

function App() {
  const [reportId, setReportId] = useState<string | null>(null);

  return (
    <Router>
      <Routes>
        {/* Signup page */}
        <Route path="/" element={<SignupPage />} />

        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Upload/report flow */}
        <Route
          path="/upload"
          element={
            !reportId ? (
              <UploadPage onReportReady={setReportId} />
            ) : (
              <ReportPage reportId={reportId} />
            )
          }
        />

        {/* Department Reports Dashboard */}
        <Route path="/department-reports" element={<DepartmentReportsPage />} />

        {/* Department-specific routes */}
        <Route path="/Policy" element={<PolicyPage />} />
        <Route path="/Community" element={<CommunityPage />} />
        <Route path="/Finance" element={<FinancePage />} />
        <Route path="/Researcher" element={<ResearcherPage />} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;

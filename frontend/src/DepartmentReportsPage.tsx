import React from "react";
import { useNavigate } from "react-router-dom";
import "./dept_rep.css";

interface CardProps {
  title: string;
  icon: string;
  path: string;
}

const Card: React.FC<CardProps> = ({ title, icon, path }) => {
  const navigate = useNavigate();
  return (
    <div className="card" onClick={() => navigate(path)}>
      <div className="icon">{icon}</div>
      <h2>{title}</h2>
    </div>
  );
};

const DepartmentReportsPage: React.FC = () => {
  const cards: CardProps[] = [
    { title: "Policy Manager", icon: "🛡️", path: "/Policy" },
    { title: "Community Member", icon: "👥", path: "/Community" },
    { title: "Finance Management", icon: "💰", path: "/Finance" },
    { title: "Researcher", icon: "🔍", path: "/Researcher" },
  ];

  return (
    <div className="dashboard">
      <h1>Select Your Role</h1>
      <div className="card-grid">
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default DepartmentReportsPage;

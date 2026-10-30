import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ items = [] }) => {
  return (
    <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        <li className="breadcrumb-item">
          <Link to="/">🏛️ Portal Home</Link>
        </li>
        <li className="breadcrumb-separator">/</li>
        <li className="breadcrumb-item">
          <Link to="/portal">Assessment Search</Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              <li className="breadcrumb-separator">/</li>
              <li className={`breadcrumb-item ${isLast ? "breadcrumb-active" : ""}`}>
                {isLast || !item.to ? (
                  <span>{item.label}</span>
                ) : (
                  <Link to={item.to}>{item.label}</Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

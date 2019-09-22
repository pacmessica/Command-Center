import React from "react";
import styled from "styled-components";

const Header = styled.div`
  width: 100%;
  background: #818181;
  color: white;
  padding: 24px 14px;
  font-weight: bold;
`;

function Dashboard() {
  return (
    <div>
      <Header>Acme Corp</Header>
    </div>
  );
}
export default Dashboard;

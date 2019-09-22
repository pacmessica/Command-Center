import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Header = styled.div`
  width: 100%;
  background: #818181;
  color: white;
  padding: 24px 14px;
  font-weight: bold;
`;

function Dashboard() {
  const [company, setCompany] = useState({ name: "", id: "", facilities: [] });
  useEffect(() => {
    async function fetchCompany() {
      let url = "/facilities/371fc3c9-fb5b-4892-b371-33d49e19b506"; // TODO get id from url
      const response = await axios(url);
      setCompany(response.data);
    }
    fetchCompany();
  }, []);

  return (
    <div>
      <Header>{company.name}</Header>
    </div>
  );
}
export default Dashboard;

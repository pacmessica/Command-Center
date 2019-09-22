import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Chart from "./chart";

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

  const [readings, setReadings] = useState([]);
  useEffect(() => {
    let faciltiyIds = company.facilities.map(({ id }) => id);
    async function fetchReadings() {
      const response = await axios.post("/facilities/demand", faciltiyIds);
      console.log(response.data);

      setReadings(response.data);
    }

    if (faciltiyIds.length > 0) {
      fetchReadings();
    }
    const interval = setInterval(() => {
      fetchReadings();
    }, 10000); // TODO
    return () => clearInterval(interval);
  }, [company]);

  let facilitiesWithReading = company.facilities.map(({ id, name }) => {
    let reading = readings.find(reading => reading.facility_id === id);
    return { id, name, reading };
  });

  return (
    <div>
      <Header>{company.name}</Header>
      {readings.length > 0 ? (
        <Chart facilities={facilitiesWithReading} />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
export default Dashboard;

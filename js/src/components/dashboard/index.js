import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Chart from "./chart";
import Map from "./map";

const Header = styled.div`
  width: 100%;
  background: #818181;
  color: white;
  padding-left: 14px;
  font-weight: bold;
  height: 64px;
  line-height: 64px;
`;

const FlexContainer = styled.div`
  height: 100%;
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
  height: calc(100vh - 64px);
`;

const FlexItem = styled.div`
  flex: ${props => (props.flex ? props.flex : 1)};
  margin: 0;
  min-width: ${props => (props.minWidth ? props.minWidth : 0)};
`;

const ShadowBox = styled.div`
  margin: 2%;
  height: 48%;

  box-shadow: 1px 3px 6px 0 #d3d3d3;
  box-sizing: border-box;
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

  let mapMarkers = company.facilities.map(({ id, name, coord }) => {
    return { key: id, content: name, position: coord };
  });

  return (
    <>
      <Header>{company.name}</Header>
      <FlexContainer>
        <FlexItem flex={1} minWidth={"400px"}>
          <ShadowBox height={"50%"}>[PLACEHOLDER]</ShadowBox>
          <ShadowBox height={"50%"}>
            {readings.length > 0 ? (
              <Chart facilities={facilitiesWithReading} />
            ) : (
              <div>Loading...</div>
            )}
          </ShadowBox>
        </FlexItem>
        <FlexItem flex={3}>
          {mapMarkers.length > 0 ? (
            <Map markers={mapMarkers} />
          ) : (
            <div>Loading...</div>
          )}
        </FlexItem>
      </FlexContainer>
    </>
  );
}
export default Dashboard;

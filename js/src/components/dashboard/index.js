import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "./chart";
import Map from "./map";
import {
  Header,
  FlexContainer,
  LeftPanel,
  ContentBox,
  ShadowBox
} from "./styles";

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

  const [mapMarkers, setMapMarkers] = useState([]);
  useEffect(() => {
    let markers = company.facilities.map(({ id, name, coord }) => {
      return { key: id, content: name, position: coord };
    });
    setMapMarkers(markers);
  }, [company]);

  let facilitiesWithReading = company.facilities.map(({ id, name }) => {
    let reading = readings.find(reading => reading.facility_id === id);
    return { id, name, reading };
  });

  return (
    <>
      <Header>{company.name}</Header>
      <FlexContainer>
        <LeftPanel className="aside">
          <ShadowBox className="item">
            <ContentBox>
              <div className="content">[PLACEHOLDER]</div>
            </ContentBox>
          </ShadowBox>
          <ShadowBox className="item">
            {readings.length > 0 ? (
              <Chart facilities={facilitiesWithReading} />
            ) : (
              <div>Loading...</div>
            )}
          </ShadowBox>
        </LeftPanel>
        <div className="map-container">
          {mapMarkers.length > 0 ? (
            <Map markers={mapMarkers} />
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </FlexContainer>
    </>
  );
}
export default Dashboard;

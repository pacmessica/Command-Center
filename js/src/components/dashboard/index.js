import React, { useState, useEffect } from "react";
import axios from "axios";
import Chart from "./chart";
import Map from "./map";
import {
  Header,
  FlexContainer,
  LeftPanel,
  ContentBox,
  ShadowBox,
  Banner
} from "./styles";

function Dashboard() {
  const [error, setError] = useState("");
  const [company, setCompany] = useState({ name: "", id: "", facilities: [] });
  useEffect(() => {
    let companyId = window.location.pathname;
    async function fetchCompany() {
      try {
        const response = await axios(`/facilities${companyId}`);
        setError("");
        setCompany(response.data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchCompany();
  }, []);

  const [readings, setReadings] = useState([]);
  useEffect(() => {
    let faciltiyIds = company.facilities.map(({ id }) => id);
    if (faciltiyIds.length === 0) {
      return;
    }
    async function fetchReadings() {
      try {
        const response = await axios.post("/facilities/demand", faciltiyIds);
        setError("");
        setReadings(response.data);
      } catch (err) {
        setError(err.message);
      }
    }

    if (faciltiyIds.length > 0) {
      fetchReadings();
    }
    const interval = setInterval(() => {
      fetchReadings();
    }, 15000);
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
      {!!error && <Banner warning>{error}</Banner>}
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
              <div>{!error ? "Loading..." : ""}</div>
            )}
          </ShadowBox>
        </LeftPanel>
        <div className="map-container">
          {mapMarkers.length > 0 ? (
            <Map markers={mapMarkers} />
          ) : (
            <div>{!error ? "Loading..." : ""}</div>
          )}
        </div>
      </FlexContainer>
    </>
  );
}

export default Dashboard;

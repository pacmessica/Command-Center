import React from "react";
import styled from "styled-components";

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;

  th,
  td {
    padding: 3px;
  }

  .facility-col {
    text-align: left;
  }
  .reading-col {
    text-align: right;
  }
  .last-update-col {
    text-align: right;
  }

  tr:nth-child(2n + 3) {
    background: #a8d5e5;
  }

  tr.summary-row {
    background: #9bf59b;
  }

  .grey-text {
    color: grey;
  }
`;

export default function Chart(props) {
  return (
    <Table>
      <tbody>
        <tr>
          <th className="facility-col">Facility</th>
          <th className="reading-col">Reading</th>
          <th className="last-update-col">Last Update</th>
        </tr>
        {props.facilities.map(({ id, name, reading }) => {
          let date = new Date(reading.last_seen * 1000);
          return (
            <tr key={id}>
              <td className="facility-col">{name}</td>
              <td className="reading-col">{reading.demand.toFixed(0)}kW</td>
              <td className="last-update-col">
                {date.toLocaleString("en-US")}
              </td>
            </tr>
          );
        })}
        <tr key="all" className="summary-row">
          <td className="facility-col grey-text">All</td>
          <td className="reading-col">
            {props.facilities
              .reduce((sum, current) => sum + current.reading.demand, 0)
              .toFixed(0)}
            kW
          </td>
          <td className="last-update-col"></td>
        </tr>
      </tbody>
    </Table>
  );
}

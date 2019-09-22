import React from "react";
import styled from "styled-components";

const Table = styled.table`
  border-collapse: collapse;
  th {
    text-align: right;
    padding: 3px;
  }
  th:first-child {
    text-align: left;
  }

  td {
    padding: 3px;
  }

  tr:nth-child(2n + 3) {
    background: #a8d5e5;
  }

  tr:last-child {
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
          <th>Facility</th>
          <th>Reading</th>
          <th>Last Update</th>
        </tr>
        {props.facilities.map(({ id, name, reading }) => {
          let date = new Date(reading.last_seen * 1000);
          return (
            <tr key={id}>
              <td>{name}</td>
              <td>{reading.demand}kW</td>
              <td>{date.toLocaleString("en-US")}</td>
            </tr>
          );
        })}
        <tr key="all">
          <td className="grey-text">All</td>
          <td>
            {props.facilities.reduce(
              (sum, current) => sum + current.reading.demand,
              0
            )}
            kW
          </td>
          <td></td>
        </tr>
      </tbody>
    </Table>
  );
}

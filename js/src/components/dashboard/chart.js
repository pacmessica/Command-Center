import React from "react";

export default function Chart(props) {
  return (
    <table>
      <tbody>
        <tr>
          <th>Facility</th>
          <th>Reading</th>
          <th>Last Update</th>
        </tr>
        {props.facilities.map(({ id, name, reading }) => {
          return (
            <tr key={id}>
              <td>{name}</td>
              <td>{reading.demand}kW</td>
              <td>{reading.last_seen}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

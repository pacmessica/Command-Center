import React from "react";
import { formatDate } from "../../utils/date";

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
          let date = new Date(reading.last_seen * 1000);
          let datestr = formatDate(date);

          return (
            <tr key={id}>
              <td>{name}</td>
              <td>{reading.demand}kW</td>
              <td>{datestr}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

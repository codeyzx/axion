import React from "react";

function EmptyTable({ columns }) {
  return (
    <>
      <table className=" my-4 border-b-[1px] border-gray-300 border-collapse bg-white text-sm w-full text-left">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th className="font-semibold rounded-sm p-2" key={i}>
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
      </table>
      <p className="text-sm text-center text-gray-600">Data not available</p>
    </>
  );
}

export default EmptyTable;

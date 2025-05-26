// utils/templateExcel.js
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const templateExcel = (fileName, sheetName, tableData) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Convert array of arrays to worksheet
  const ws = XLSX.utils.aoa_to_sheet(tableData);

  // Append worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Write workbook to binary array
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });

  // Create Blob and trigger download
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, `${fileName}.xlsx`);
};
// npm install xlsx file-saver - library to install

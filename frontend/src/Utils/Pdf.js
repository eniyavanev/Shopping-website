import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";

// 👇 FIX: Use `pdfFonts.default`
pdfMake.vfs = pdfFonts.default.vfs;

export const templatePdf = (pdfhead, tablebody, paperAngle) => {
  const dd = {
    pageSize: "A4",
    pageOrientation: paperAngle,
    defaultStyle: {
      font: "Roboto",
    },
    content: [
      {
        text: pdfhead,
        alignment: "center",
        fontSize: 18,
        margin: [0, 0, 0, 10],
      },
      {
        margin: [0, 10, 0, 0],
        table: {
          body: tablebody,
        },
      },
    ],
  };

  const win = window.open("", "_blank");
  pdfMake.createPdf(dd).open({}, win);
  return true;
};

//npm i pdfmake pdfmake-fonts

import jsPDF from "jspdf";
import NumeroaLetras from "../utils/NumeroaLetras.js";
import generateControlCode from "../utils/CodigoControl.js";
import html2canvas from "html2canvas";

let fecha_actual = new Date().toLocaleDateString();
let hora_actual = new Date().toLocaleTimeString();

export default function CierreTurnoPDF(datos, datos_extra) {
    let pdf = new jsPDF();

    pdf.addFont("Roboto-Medium.ttf", "helvetica", "bold", 1000);

    pdf.setFontSize(12);
    pdf.text("REPORTE CIERRE", 2, 4);
    pdf.text("TT: "+"15      "+ "TP: "+"40.29", 2, 10); // TP = TOTAL VENTAS / CANTIDAD DE TRANSACCIONES
    pdf.text("Fecha: "+datos_extra.fecha, 2, 16);
    pdf.text("Hr. Inicio: "+datos_extra.hora_inicio+" Hr. Cierre: "+ datos_extra.hora_fin, 2, 22);
    pdf.text("Usuario: "+datos_extra.usuario, 2, 28);
    pdf.text("Sucursal: "+datos_extra.sucursal, 2, 34);
    pdf.text("Turno: "+"PM", 2, 40);
    
    pdf.setFontSize(12);
    pdf.text("Ventas Por Plato", 2, 46);
    pdf.setFontSize(12);
    pdf.text("Cant", 2, 52);
    pdf.text("Descripcion", 18, 52);
    pdf.text("Total", 60, 52);
    let salto = 58;
    let total_fiscal = 0;
    datos.ventas_x_plato.forEach((element) => {
      let _cantidad = parseFloat(element.cantidad).toFixed(2);
      let _subtotal = parseFloat(element.subtotal).toFixed(2);
      total_fiscal+=element.subtotal;
      pdf.text(_cantidad.toString(), 2, salto);
      pdf.text(element.nombre.toString(), 18, salto);
      pdf.text(_subtotal.toString(), 60, salto);
      salto += 4;
    });

    salto += 2;
    pdf.text("Total: ", 2, salto);
    pdf.text(parseFloat(total_fiscal).toFixed(2), 60, salto);


    pdf.setFontSize(12);
    salto+=10;

    pdf.text("Ventas Por Categoria", 2, salto);
    salto+=6;
    pdf.text("Cant", 2, salto);
    pdf.text("Descripcion", 18, salto);
    pdf.text("Total", 60, salto);
    salto+=6;

    datos.ventas_x_plato.forEach((element) => {
      let _cantidad = parseFloat(element.cantidad).toFixed(2);
      let _subtotal = parseFloat(element.subtotal).toFixed(2);
      total_fiscal+=element.subtotal;
      pdf.text(_cantidad.toString(), 2, salto);
      pdf.text(element.nombre.toString(), 18, salto);
      pdf.text(_subtotal.toString(), 60, salto);
      salto += 4;
    });

    salto += 2;
    pdf.text("Total: ", 2, salto);
    pdf.text(parseFloat(total_fiscal).toFixed(2), 60, salto);

    pdf.setFontSize(12);
    salto+=10;

    pdf.text("Ventas Anuladas", 2, salto);
    salto+=6;
    pdf.text("Cant", 2, salto);
    pdf.text("Descripcion", 18, salto);
    pdf.text("Total", 60, salto);
    salto+=6;

    datos.ventas_anuladas.forEach((element) => {
      let _cantidad = parseFloat(element.cantidad).toFixed(2);
      let _subtotal = parseFloat(element.subtotal).toFixed(2);
      total_fiscal+=element.subtotal;
      pdf.text(_cantidad.toString(), 2, salto);
      pdf.text(element.nombre.toString(), 18, salto);
      pdf.text(_subtotal.toString(), 60, salto);
      salto += 4;
    });

    salto += 2;
    pdf.text("Total: ", 2, salto);
    pdf.text(parseFloat(total_fiscal).toFixed(2), 60, salto);


    pdf.setFontSize(12);
    salto+=10;
    pdf.text("Comida de Personal", 2, salto);
    salto+=6;
    pdf.text("Cant", 2, salto);
    pdf.text("Descripcion", 18, salto);
    pdf.text("Total", 60, salto);
    salto+=6;

    datos.comida_personal.forEach((element) => {
      let _cantidad = parseFloat(element.cantidad).toFixed(2);
      let _subtotal = parseFloat(element.subtotal).toFixed(2);
      total_fiscal+=element.subtotal;
      pdf.text(_cantidad.toString(), 2, salto);
      pdf.text(element.nombre.toString(), 18, salto);
      pdf.text(_subtotal.toString(), 60, salto);
      salto += 4;
    });
    
    salto += 2;
    pdf.text("Total: ", 2, salto);
    pdf.text(parseFloat(total_fiscal).toFixed(2), 60, salto);



    var string = pdf.output("datauristring");
    var embed =
      "<embed width='100%' height='100%' src='" + string + "'><embed/>";
    var x = window.open();
    x.document.open();
    x.document.write(embed);
    x.document.close();
  
}





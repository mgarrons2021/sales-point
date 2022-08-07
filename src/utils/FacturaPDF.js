import jsPDF from "jspdf";
import NumeroaLetras from "../utils/NumeroaLetras.js";
import generateControlCode from "../utils/CodigoControl.js";
import html2canvas from "html2canvas";

let datos_empresa = {
  nombre: "DONESCO SRL",
  celular: "78555410",
  fecha: "2021-03-23",
  nit: "166172023",
};

let fecha_actual = new Date().toLocaleDateString();
let hora_actual = new Date().toLocaleTimeString();

export default function downloadPDF(datos, visita) {
  console.log(datos);
  var content_qr = document.getElementById("content_qr");
  content_qr.style.opacity = 1;
  html2canvas(content_qr).then(function (canvas) {
    let pdf = new jsPDF();

    pdf.addFont("Roboto-Medium.ttf", "helvetica", "bold", 1000);

    pdf.setFontSize(10);
    pdf.text(datos_empresa.nombre, 30, 4, "center");
    pdf.text("BODEGA PRINCIPAL", 30, 8, "center");
    pdf.setFontSize(8);
    pdf.text("Celular: " + datos_empresa.celular, 30, 12, "center");
    pdf.text("Calle Mario Flores y Padre Adrian Melgar", 28, 16, "center");
    pdf.text("Santa Cruz - Bolivia", 30, 20, "center");
    pdf.text("SCF 1", 30, 24, "center");

    pdf.addFont("Roboto-Medium.ttf", "helvetica", "bold", 1000);

    pdf.setFontSize(11);
    pdf.text("FACTURA ORIGINAL", 30, 28, "center");
    pdf.text(
      "------------------------------------------------------------",
      25,
      34,
      "center"
    );

    pdf.setFontSize(10);
    pdf.text("NIT: " + datos_empresa.nit, 2, 38);
    pdf.text("FACTURA: " + datos.nro_factura, 2, 42);
    pdf.text("AUTORIZACION: " + datos.nro_autorizacion, 2, 46);
    pdf.setFontSize(11);
    pdf.text(
      "------------------------------------------------------------",
      25,
      52,
      "center"
    );

    pdf.setFontSize(10);
    pdf.text("Actividad Economica: " + datos.lugar, 2, 56);
    pdf.text("Fecha: " + fecha_actual, 2, 60);
    pdf.text("Hora: " + hora_actual, 2, 64);
    pdf.text("Cliente: " + datos.cliente, 2, 68);
    pdf.text("Nit/Ci: " + datos.nit_ci, 2, 72);
    pdf.setFontSize(11);
    pdf.text(
      "------------------------------------------------------------",
      25,
      78,
      "center"
    );

    pdf.setFontSize(10);
    pdf.text("Cant", 2, 82);
    pdf.text("Concepto", 12, 82);
    pdf.text("P. Unit", 40, 82);
    pdf.text("Total", 55, 82);

    let salto = 86;
    datos.detalle_venta.forEach((element) => {
      let _cantidad = parseFloat(element.cantidad).toFixed(2);
      pdf.text(_cantidad.toString(), 2, salto);
      pdf.text(element.plato.toString(), 12, salto);
      pdf.text(element.costo.toString(), 40, salto);
      pdf.text(element.subtotal.toString(), 55, salto);
      salto += 4;
    });

    salto += 4;
    pdf.setFontSize(11);
    pdf.text(
      "------------------------------------------------------------",
      25,
      salto,
      "center"
    );

    pdf.setFontSize(10);
    salto += 4;
    pdf.text("Subtotal Bs", 2, salto);
    pdf.text(datos.total_venta.toString(), 55, salto);
    salto += 4;
    pdf.text("Descuento Bs", 2, salto);
    let descuento = 0.0;
    pdf.text(descuento.toString(), 55, salto);
    salto += 4;
    pdf.text("Total Bs", 2, salto);
    let total = parseFloat(datos.total_venta - descuento).toFixed(2);
    pdf.text(total.toString(), 55, salto);
    salto += 8;
    pdf.setFontSize(8);
    pdf.text(
      "Son : " +
        NumeroaLetras(datos.total_venta - descuento, {
          plural: " bolivianos",
          singular: " boliviano",
          centPlural: " centavos",
          centSingular: " centavo",
        }),
      2,
      salto
    );

    salto += 4;
    pdf.setFontSize(11);

    pdf.text(
      "------------------------------------------------------------",
      25,
      salto,
      "center"
    );
    pdf.setFontSize(8);

    salto += 6;

    var imgData = canvas.toDataURL("image/png");
    console.log(imgData);
    var imgWidth = 310;
    var pageHeight = 390;
    var imgHeight = (canvas.height * imgWidth) / canvas.width;
    var heightLeft = imgHeight;
    var position = 0;
    pdf.addImage(imgData, "PNG", 25, salto, imgWidth, imgHeight);
    content_qr.style.opacity = 0;
    salto += 30;

    pdf.text("Codigo de Control :" + datos.codigo_control, 2, salto);
    salto += 4;
    pdf.text("Fecha Limite de Emision :" + "2021-10-10", 2, salto);
    salto += 5;
    pdf.text('"ESTA FACTURA CONTRIBUYE AL DESARROLLO', 2, salto);
    salto += 4;
    pdf.text("        DEL PAIS EL USO ILICITO DE ESTA SERA", 2, salto);
    salto += 4;
    pdf.text('           SANCIONADO DE ACUERDO A LEY"', 2, salto);
    salto += 4;
    pdf.text(
      "  Ley No. 453. El proveedor de servicios debe habilitar",
      2,
      salto
    );
    salto += 4;
    pdf.text("     medios e instrumentos para efectural consultas.", 2, salto);
    salto += 4;

    if( datos.sucursal == 17 ){
      
      pdf.text("Numero de Visita", 2, salto);
      pdf.text(visita.toString(), 55, salto);

    }

    

    /*  doc.save("comprobanteVenta.pdf"); */
    var string = pdf.output("datauristring");
    var embed =
      "<embed width='100%' height='100%' src='" + string + "'><embed/>";
    var x = window.open();
    x.document.open();
    x.document.write(embed);
    x.document.close();
  });
}

function generarCodigoControl(codigo_control) {
  return generateControlCode(
    codigo_control.nro_autorizacion,
    codigo_control.nro_factura,
    codigo_control.nit_ci,
    codigo_control.fecha_transaccion,
    codigo_control.total_transaccion,
    codigo_control.llave_dosificacion
  );
}

function redondear(monto) {
  let _monto = monto.toFixed(1);
  let dato = _monto.toString();
  let ultimo = _monto.toString().charAt(dato.length - 1);
  console.log("dato: ", dato);
  console.log("ultimo: ", ultimo);
  if (parseInt(ultimo) > 5) {
    _monto = Math.round(_monto);
    console.log(_monto);
  } else {
    if (parseInt(ultimo) == 0) {
      _monto = Math.round(_monto);
      console.log(_monto);
    } else {
      _monto = Math.round(_monto) + ".50";
      console.log(_monto);
    }
  }
  return _monto;
}

import jsPDF from "jspdf";
import NumeroaLetras from "../utils/NumeroaLetras.js";
import generateControlCode from "../utils/CodigoControl.js";
import html2canvas from "html2canvas";

let datos_empresa = {
  nombre: "DONESCO SRL",
  celular: "78555410",
  nit: "166172023",
};

let fecha_actual = new Date();
let hora_actual = new Date().toLocaleTimeString();

export default function downloadPDF(datos, autorizacion, visita) {
  //console.log(datos);
  //console.log(autorizacion);
  var content_qr = document.getElementById("content_qr");
  content_qr.style.opacity = 1;
  html2canvas(content_qr).then(function (canvas) {
    let pdf = new jsPDF();

    pdf.addFont("Roboto-Medium.ttf", "helvetica", "bold", 1000);

    pdf.setFontSize(10);

    pdf.text(datos_empresa.nombre, 30, 4, "center");
    pdf.text("" + datos.sucursal_nombre, 30, 8, "center");
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
    pdf.text("Actividad Economica: Restaurante", 2, 56);
    pdf.text("Fecha: " + parseFecha(fecha_actual), 2, 60);
    pdf.text("Hora: " + hora_actual, 2, 64);

    let nombre = datos.cliente.split(" ");
    let aux = 0;
    let salto = 68;
    let nomb1 = "";
    let nomb2 = "";
    let nomb3 = "";
    if (nombre.length > 1) {
      for (let index = 0; index < nombre.length; index++) {
        aux += nombre[index].length;

        if (aux < 18) {
          nomb1 += nombre[index] + " ";
        } else if (aux < 36) {
          nomb2 += nombre[index] + " ";
        } else {
          nomb3 += nombre[index] + " ";
        }
      }
      pdf.text("Cliente: " + nomb1, 2, salto);
      salto += 4;
      pdf.text("             " + nomb2, 2, salto);

      if (aux > 36) {
        salto += 4;
        pdf.text("             " + nomb3, 2, salto);
      }
    } else {
      pdf.text("Cliente: " + datos.cliente, 2, salto);
    }
    salto += 4;
    pdf.text("Nit/Ci: " + datos.nit_ci, 2, salto);
    pdf.setFontSize(11);
    salto += 4;
    pdf.text(
      "------------------------------------------------------------",
      25,
      salto,
      "center"
    );
    //x,y
    salto += 4;
    pdf.setFontSize(10);
    pdf.text("Cant", 2, salto);
    pdf.text("Concepto", 12, salto);
    pdf.text("P.U.", 50, salto);
    pdf.text("Total", 60, salto);

    salto += 4;
    datos.detalle_venta.forEach((element) => {
      let _cantidad = parseFloat(element.cantidad).toFixed(2);
      pdf.text(_cantidad.toString(), 2, salto);
      console.log(
        element.plato.toString() + " -- " + element.plato.toString().length
      );
      if (element.plato.toString().length > 17) {
        pdf.text(element.plato.toString().substring(0, 17), 12, salto);
      } else {
        pdf.text(element.plato.toString(), 12, salto);
      }

      pdf.text(element.costo.toString(), 50, salto);
      pdf.text(element.subtotal.toString(), 60, salto);
      salto += 4;
      if (element.plato.toString().length > 17) {
        pdf.text(
          element.plato
            .toString()
            .substring(17, element.plato.toString().length),
          12,
          salto
        );
        salto += 4;
      }
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
    pdf.text(datos.total_venta.toString(), 60, salto);
    salto += 4;
    pdf.text("Descuento Bs", 2, salto);
    let descuento = 0.0;
    pdf.text(descuento.toString(), 60, salto);
    salto += 4;
    pdf.text("Total Bs", 2, salto);
    let total = parseFloat(datos.total_venta - descuento).toFixed(2);
    pdf.text(total.toString(), 60, salto);
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

    salto += 8;

    var imgData = canvas.toDataURL("image/png");
    //console.log(imgData);
    var imgWidth = 130;
    var pageHeight = 230;
    var imgHeight = (canvas.height * imgWidth) / canvas.width;
    var heightLeft = imgHeight;
    var position = 0;
    pdf.addImage(imgData, "PNG", 25, salto, imgWidth, imgHeight);
    content_qr.style.opacity = 0;
    salto += 35;

    pdf.text("Codigo de Control :" + datos.codigo_control, 2, salto);
    salto += 4;
    pdf.text("Fecha Limite de Emision :" + autorizacion.fecha_fin, 2, salto);
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

    if (datos.sucursal == 18) {
      pdf.text("Numero de Visita", 2, salto);
      pdf.text(visita.toString(), 55, salto);
    }

    /*  doc.save("comprobanteVenta.pdf"); */
    var string = pdf.output("datauristring");
    console.log(string);
    var embed =
      "<embed width='100%' height='100%' src='" + string + "'><embed/>";
    var x = window.open();
    x.document.open();
    x.document.write(embed);
    x.document.close();
    //window.open("data:application/pdf," + encodeURI(string));

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

function parseFecha(fecha) {
  let fecha_actual = fecha;
  console.log(fecha.getMonth() + 1);
  console.log(fecha.getDate());
  if (fecha.getMonth() + 1 < 10 && fecha.getDate() < 10) {
    fecha_actual =
      fecha.getDate() +
      "/" +
      "0" +
      (fecha.getMonth() + 1).toString() +
      "/" +
      "0" +
      fecha.getFullYear().toString();
  } else if (fecha.getDate() < 10) {
    fecha_actual =
      fecha.getDate() +
      "/" +
      (fecha.getMonth() + 1).toString() +
      "/" +
      "0" +
      fecha.getFullYear().toString();
  } else if (fecha.getMonth() + 1 < 10) {
    fecha_actual =
      fecha.getDate() +
      "/0" +
      (fecha.getMonth() + 1).toString() +
      "/" +
      fecha.getFullYear().toString();
  }

  return fecha_actual;
}

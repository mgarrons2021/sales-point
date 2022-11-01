import jsPDF from "jspdf";
import NumeroaLetras from "../utils/NumeroaLetras.js";
import generateControlCode from "../utils/CodigoControl.js";
import html2canvas from "html2canvas";
import moment from "moment";

let datos_empresa = {
  nombre: "DONESCO SRL",
  celular: "78555410",
  nit: "166172023",
};

let fecha_actual = new Date();
let hora_actual_2 = new Date();
hora_actual_2 = hora_actual_2.getHours() + ":" + hora_actual_2.getMinutes();

export default function downloadPDF(
  datos,
  autorizacion,
  visita,
  cuf = null,
  idcliente = null,
  leyenda = null
) {
  var hora_actual;
  console.log(datos.hora_actual);
  if (datos.hora_actual) {
    let hora = moment(datos.hora_actual, "HH:mm:ss").format("HH:mm");
    hora_actual = hora;
  } else {
    hora_actual = hora_actual_2;
    console.log(hora_actual);
  }
  var fecha_actual2 =
    fecha_actual.getDate() +
    "/" +
    (fecha_actual.getMonth() + 1) +
    "/" +
    fecha_actual.getFullYear();

  if (datos.fecha_emision_manual != null && datos.hora_emision_manual != null) {
    hora_actual = moment(datos.hora_emision_manual, "HH:mm:ss").format("HH:mm");
    fecha_actual2 = moment(datos.fecha_emision_manual, "Y-MM-DD").format("DD/MM/Y");
  }
  var content_qr = document.getElementById("content_qr");
  content_qr.style.opacity = 1;
  html2canvas(content_qr).then(function (canvas) {
    let pdf = new jsPDF();

    let salto = 0;
    /* pdf.addFont("Roboto-Medium.ttf", "helvetica", "bold", 1000); */

    pdf.setFontSize(9);
    salto += 4;
    pdf.text("FACTURA", 39, salto, "center");
    salto += 4;
    pdf.text("CON DERECHO A CRÉDITO FISCAL", 39, salto, "center");
    salto += 4;
    pdf.text(datos_empresa.nombre, 40, salto, "center");
    salto += 4;

    pdf.text("" + datos.sucursal_nombre, 40, salto, "center");
    salto += 4;

    pdf.text("Nro. Punto de Venta: " + " 0", 40, salto, "center");

    salto += 4;
    pdf.text("Av. 3er anillo externo y Av. Santos Dumont", 39, salto, "center");
    salto += 4;
    pdf.text("Tel: " + datos_empresa.celular, 39, salto, "center");
    salto += 4;
    pdf.text("Santa Cruz de la Sierra", 39, salto, "center");
    salto += 4;
    pdf.text(
      "------------------------------------------------------------------------------------------------------------------",
      25,
      salto,
      "center"
    );
    salto += 4;
    pdf.text("NIT", 39, salto, "center");
    salto += 4;
    pdf.text("" + datos_empresa.nit, 39, salto, "center");
    salto += 4;
    pdf.text("Factura N*", 39, salto, "center");
    salto += 4;
    pdf.text("" + datos.nro_factura, 39, salto, "center");
    salto += 4;
    pdf.text("COD. AUTORIZACIÓN", 39, salto, "center");
    salto += 4;
    console.log(cuf.length);
    let cuf_part1 = cuf.substring(0, 39);
    let cuf_part2 = cuf.substring(40, 56);
    pdf.text(cuf_part1, 42, salto, "center");
    salto += 3;
    pdf.text(cuf_part2, 42, salto, "center");
    salto += 4;
    pdf.setFontSize(9);
    pdf.text(
      "------------------------------------------------------------------------------------------------------------------",
      25,
      salto,
      "center"
    );

    let nombre = datos.cliente.toUpperCase().split(" ");
    let aux = 0;
    salto += 4;
    let nomb1 = "";
    let nomb2 = "";
    let nomb3 = "";
    let meses = [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE",
    ];

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

      pdf.text("NOMBRE/RAZÓN SOCIAL:    " + nomb1, 2, salto);
      salto += 3;
      pdf.text(
        "                                                " + nomb2,
        2,
        salto
      );

      if (aux > 36) {
        salto += 4;
        pdf.text(
          "                                              " + nomb3,
          2,
          salto
        );
      }
    } else {
      pdf.text("NOMBRE/RAZÓN SOCIAL:    " + datos.cliente, 2, salto);
    }
    salto += 4;
    let complemento =
      datos.complemento != null && datos.complemento != ""
        ? " - " + datos.complemento
        : "";
    pdf.text(
      "                        NIT/CI/CEX:    " + datos.nit_ci + complemento,
      2,
      salto
    );
    salto += 4;
    pdf.text("                  COD. CLIENTE:    " + idcliente, 2, salto);
    salto += 4;
    pdf.text(
      "         FECHA DE EMISION:    " + fecha_actual2 + " " + hora_actual,
      2,
      salto
    );
    salto += 4;

    pdf.text(
      "------------------------------------------------------------------------------------------------------------------",
      25,
      salto,
      "center"
    );

    //x,y
    salto += 4;
    pdf.text("DETALLE", 40, salto, "center");
    salto += 4;

    //pdf.setFontSize(10);

    /* pdf.text("Cant", 2, salto);
    pdf.text("Concepto", 12, salto);
    pdf.text("P.U.", 50, salto);
    pdf.text("Total", 60, salto);
    salto += 4; */
    let subtotal_descuento = 0;
    console.log(datos.detalle_venta);
    datos.detalle_venta.forEach((element) => {
      if (element.plato.toString().length > 50) {
        pdf.text(element.plato.toString().substring(0, 50), 2, salto);
      } else {
        pdf.text(element.plato.toString(), 2, salto);
      }

      salto += 4;

      if (element.plato.toString().length > 50) {
        pdf.text(
          element.plato
            .toString()
            .substring(50, element.plato.toString().length),
          2,
          salto
        );
        salto += 4;
      }

      let _cantidad = parseFloat(element.cantidad).toFixed(2);
      pdf.text(
        _cantidad.toString() +
          " X " +
          element.costo.toString() +
          " - " +
          parseFloat(element.descuento).toFixed(2).toString(),
        2,
        salto
      );

      //pdf.text(element.costo.toString(), 50, salto);
      pdf.text(
        parseFloat(_cantidad * element.costo - element.descuento)
          .toFixed(2)
          .toString(),
        70,
        salto
      );
      salto += 4;
    });

    ////pdf.setFontSize(9);
    pdf.text(
      "------------------------------------------------------------------------------------------------------------------",
      25,
      salto,
      "center"
    );

    salto += 4;
    pdf.text("                                         Subtotal Bs.", 2, salto);
    pdf.text(
      (datos.total_venta - datos.total_descuento).toFixed(2).toString(),
      60,
      salto
    );
    salto += 4;
    pdf.text("                                     Descuento Bs.", 2, salto);
    console.log(datos.total_descuento_adicional);
    let descuento = datos.total_descuento_adicional;
    pdf.text(descuento.toString(), 60, salto);
    salto += 4;
    pdf.text(
      "                                              Total Bs.",
      2,
      salto
    );
    let total = parseFloat(
      datos.total_venta - datos.total_descuento - descuento
    ).toFixed(2);
    pdf.text(total.toString(), 60, salto);
    salto += 4;
    pdf.text("                             Monto Gift Card Bs.", 2, salto);
    let monto_gift_card = parseFloat(0).toFixed(2);
    pdf.text(monto_gift_card.toString(), 60, salto);
    salto += 4;
    pdf.text("                               Monto a Pagar Bs.", 2, salto);
    let monto_a_pagar = parseFloat(
      0 +
        parseFloat(monto_gift_card) +
        parseFloat(total) -
        parseFloat(descuento)
    ).toFixed(2);
    pdf.text(monto_a_pagar.toString(), 60, salto);
    salto += 4;
    pdf.text("          Importe Base Credito Fiscal Bs.", 2, salto);
    let importe_base_credito_fiscal = parseFloat(
      0 +
        parseFloat(monto_gift_card) +
        parseFloat(total) -
        parseFloat(descuento)
    ).toFixed(2);
    pdf.text(importe_base_credito_fiscal.toString(), 60, salto);
    salto += 4;
    pdf.setFontSize(9);
    pdf.text(
      "SON : " +
        NumeroaLetras(datos.total_venta - datos.total_descuento - descuento, {
          plural: " bolivianos",
          singular: " boliviano",
          centPlural: " centavos",
          centSingular: " centavo",
        }).toLowerCase(),
      2,
      salto
    );

    salto += 4;
    //pdf.setFontSize(9);

    pdf.text(
      "------------------------------------------------------------------------------------------------------------------",
      25,
      salto,
      "center"
    );
    //pdf.setFontSize(8);

    salto += 8;
    pdf.text('"ESTA FACTURA CONTRIBUYE AL DESARROLLO', 5, salto);
    salto += 4;
    pdf.text("        DEL PAIS EL USO ILICITO DE ESTA SERA", 5, salto);
    salto += 4;
    pdf.text('           SANCIONADO DE ACUERDO A LEY"', 5, salto);
    salto += 6;
    pdf.setFontSize(8);
    pdf.text("  " + leyenda.toString().substring(0, 53), 5, salto);
    salto += 4;
    pdf.text(
      "" + leyenda.toString().substring(53, leyenda.toString().length),
      2,
      salto
    );
    salto += 6;
    console.log(datos.evento_significativo_id);

    if (datos.evento_significativo_id == null) {
      pdf.setFontSize(9);
      pdf.text('"Este documento es la Representación Gráfica de un', 5, salto);
      salto += 4;
      pdf.text(
        "Documento Fiscal Digital emitido en una modalidad de",
        5,
        salto
      );
      salto += 4;
      pdf.text("                              facturación en línea”", 5, salto);
      salto += 6;
    } else {
      pdf.setFontSize(9);
      pdf.text('"Este documento es la Representación Gráfica de un', 5, salto);
      salto += 4;
      pdf.text("Documento Fiscal Digital emitido fuera de linea”", 5, salto);
      salto += 6;
    }

    var imgData = canvas.toDataURL("image/png");
    //console.log(imgData);
    var imgWidth = 130;
    var pageHeight = 230;
    var imgHeight = (canvas.height * imgWidth) / canvas.width;
    var heightLeft = imgHeight;
    var position = 0;
    pdf.addImage(imgData, "PNG", 30, salto, imgWidth, imgHeight);
    content_qr.style.opacity = 0;
    salto += 35;

    /* pdf.text("Codigo de Control :" + datos.codigo_control, 2, salto);
    salto += 4;
    pdf.text("Fecha Limite de Emision :" + autorizacion.fecha_fin, 2, salto);
    salto += 5; */

    if (datos.sucursal == 18) {
      pdf.text("Numero de Visita", 2, salto);
      pdf.text(visita.toString(), 55, salto);
    }

    /*  doc.save("comprobanteVenta.pdf"); */
    var string = pdf.output("datauristring");
    /* console.log(string); */
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
  /* console.log(fecha.getMonth() + 1);
  console.log(fecha.getDate()); */
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
  //patricio Y ALEX FOREVER AND EVER
  return fecha_actual;
}

function parseFecha2(fecha) {
  let fecha_actual = fecha;
  /*      console.log(fecha.getMonth() + 1);
  console.log(fecha.getDate()); */
  if (fecha.getMonth() + 1 < 10 && fecha.getDate() < 10) {
    fecha_actual =
      fecha.getFullYear() +
      "-" +
      "0" +
      (fecha.getMonth() + 1).toString() +
      "-" +
      "0" +
      fecha.getDate().toString();
  } else if (fecha.getDate() < 10) {
    fecha_actual =
      fecha.getFullYear() +
      "-" +
      (fecha.getMonth() + 1).toString() +
      "-" +
      "0" +
      fecha.getDate().toString();
  } else if (fecha.getMonth() + 1 < 10) {
    fecha_actual =
      fecha.getFullYear() +
      "-0" +
      (fecha.getMonth() + 1).toString() +
      "-" +
      fecha.getDate().toString();
  }

  return fecha_actual;
}

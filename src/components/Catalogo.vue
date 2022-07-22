<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Formulario de Registro</h5>
        <div class="formgrid grid">
          <div class="field col-2">
            <label for="lugar">Lugar</label>
            <Dropdown
              v-model="optionsPlace"
              :options="optionsPlaces"
              optionLabel="name"
              :placeholder="optionsPlace"
            />
          </div>
          <div class="field col-2">
            <label for="pago">Pago</label>
            <Dropdown
              v-model="optionsPayment"
              :options="optionsPayments"
              optionLabel="name"
              :placeholder="optionsPayment"
            />
          </div>
          <div class="field col-2">
            <label for="nit_ci">Nit/Ci</label>
            <InputText
              id="nit_ci"
              type="text"
              placeholder="Nit/Ci"
              v-model="nit_ci"
              v-on:keyup="searchCliente()"
            />
          </div>
          <div class="field col-2">
            <label for="cliente">Cliente</label>
            <InputText
              id="cliente"
              type="text"
              placeholder="Cliente"
              v-model="cliente"
            />
          </div>
          <div class="field col-2">
            <label for="empresa">Empresa</label>
            <InputText
              id="empresa"
              type="text"
              placeholder="Empresa"
              v-model="empresa"
            />
          </div>
          <div class="field col-2">
            <label for="celular">Celular</label>
            <InputText
              id="celular"
              type="text"
              placeholder="Celular"
              v-model="celular"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-6">
      <div class="card">
        <h5>Platos Ofertados</h5>
        <DataView
          :value="plates"
          :layout="layout"
          :paginator="true"
          :rows="9"
          :sortOrder="sortOrder"
          :sortField="sortField"
        >
          <template #header="">
            <div class="grid grid-nogutter">
              <div class="col-6 text-left">
                <Dropdown
                  v-model="sortKey"
                  :options="sortOptions"
                  optionLabel="nombre"
                  placeholder="Seleccione una Categoria"
                  @change="onSortChange($event)"
                />
              </div>
              <div class="col-6 text-right">
                <DataViewLayoutOptions v-model="layout" />
              </div>
            </div>
          </template>
          <template #list="slotProps">
            <div class="col-12">
              <div
                class="flex flex-column md:flex-row align-items-center p-3 w-full"
              >
                <img
                  :src="ruta + '' + slotProps.data.imagen"
                  :alt="slotProps.data.nombre"
                  class="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5"
                />
                <div class="flex-1 text-center md:text-left">
                  <div class="font-bold text-2xl">
                    {{ slotProps.data.Plato }}
                  </div>
                  <div class="flex align-items-center">
                    <i class="pi pi-tag mr-2"></i>
                  </div>
                </div>
                <div
                  class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0"
                >
                  <span
                    class="text-2xl font-semibold mb-2 align-self-center md:align-self-end"
                    >Bs. {{ slotProps.data.Precio }}</span
                  >
                  <Button
                    icon="pi pi-shopping-cart"
                    label="Add to Cart"
                  ></Button>
                </div>
              </div>
            </div>
          </template>
          <template #grid="slotProps">
            <div class="col-12 md:col-4">
              <div class="card m-3 border-1 surface-border">
                <div class="text-center">
                  <img
                    :src="ruta + '' + slotProps.data.imagen"
                    :alt="slotProps.data.nombre"
                    class="w-9 shadow-2 my-3 mx-0"
                  />
                  <div class="text-1xl font-bold">
                    {{ slotProps.data.Plato }}
                  </div>
                </div>
                <div class="flex align-items-center justify-content-between">
                  <span class="text-1xl font-semibold product-badge"
                    >Bs. {{ slotProps.data.Precio }}</span
                  >
                  <Button
                    icon="pi pi-shopping-cart "
                    style="font-size: 0.001rem"
                    v-on:click="addPlate(slotProps.data)"
                  ></Button>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
    <div class="col-6">
      <div class="card">
        <h5>Detalle de Venta</h5>
        <DataTable
          :value="carrito"
          :scrollable="false"
          scrollHeight="500px"
          :loading="loading2"
          scrollDirection="both"
          class="mt-2"
        >
          <Column :style="{ width: '150px' }" header=" ">
            <template #body="slotProps">
              <td style="text-align: right" class="text-bold">
                <Button
                  icon="pi pi-times"
                  class="p-button-danger"
                  @click="deletePlate(this.carrito.indexOf(slotProps.data))"
                />
              </td>
            </template>
          </Column>

          <Column
            field="plato"
            header="Plato"
            :style="{ width: '150px' }"
            frozen
          ></Column>
          <Column
            field="cantidad"
            header="Cantidad"
            :style="{ width: '150px' }"
          >
            <template #body="slotProps">
              <input
                type="number"
                :value="slotProps.data.cantidad"
                style="width: 100%"
                v-on:keyup="
                  calculateSubtotal(this.carrito.indexOf(slotProps.data))
                "
              />
            </template>
          </Column>
          <Column field="costo" header="Costo" :style="{ width: '150px' }">
          </Column>
          <Column
            field="subtotal"
            header="Sub Total"
            :style="{ width: '150px' }"
          >
            <template #body="slotProps">
              <td style="text-align: right" class="text-bold">
                {{ slotProps.data.subtotal }} bs.
              </td>
            </template>
          </Column>
        </DataTable>
        <div class="card">
          <div class="grid">
            <div class="col-10">
              <p>Total :</p>
            </div>
            <div class="col-2">
              <p class="text-right">{{ total }} bs.</p>
            </div>
          </div>
          <div class="card-footer">
            <div class="field col-3">
              <Button
                label="Registrar Venta"
                class="mr-2 mb-2"
                v-on:click="registerSale()"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div id="content_qr">
    <qrcode-vue :value="QRValue" size="80" level="H" />
  </div>
</template>

<script>
import jsPDF from "jspdf";
import ProductService from "../service/ProductService";
import axios from "axios";
import NumeroaLetras from "../utils/NumeroaLetras.js";
import QrcodeVue from "qrcode.vue";
import html2canvas from "html2canvas";

export default {
  data() {
    return {
      QRValue: "Hola Mundo",
      optionsPlace: {
        name: "En Restaurante",
      },
      optionsPlaces: [
        { name: "En Restaurante" },
        { name: "Para Llevar" },
        { name: "Venta Externa" },
        { name: "Delivery" },
      ],
      optionsPayment: {
        name: "Efectivo",
      },
      optionsPayments: [
        { name: "Efectivo" },
        { name: "Tarjeta Credito/Debito" },
        { name: "Comida Personal" },
      ],
      dataviewValue: null,
      layout: "grid",
      sortKey: null,
      sortOrder: null,
      sortField: null,
      sortOptions: [],
      plates: "",
      ruta: "http://192.168.0.150/eerpwebv2/public/",
      carrito: [],
      subtotal: 0,
      subtotales: [],
      total: 0,

      nit_ci: 0,
      cliente: "",
      empresa: "",
      celular: 0,
    };
  },
  components: {
    QrcodeVue,
  },
  productService: null,
  created() {
    this.productService = new ProductService();
  },
  mounted() {
    this.productService
      .getProducts()
      .then((data) => (this.dataviewValue = data));
    this.getCategorias();
  },
  updated() {
    console.log(this.subtotal);
  },
  methods: {
    updateTotal() {
      this.total = 0;
      for (let i = 0; i < this.carrito.length; i++) {
        this.total += this.carrito[i].subtotal;
      }
    },
    calculateSubtotal: function (id) {
      this.carrito[id].cantidad = event.target.value;
      this.carrito[id].subtotal =
        this.carrito[id].costo * this.carrito[id].cantidad;
      this.updateTotal();
    },
    onSortChange(event) {
      let id = event.value.id;
      this.getPlates(id);
    },
    getCategorias() {
      //axios.get("http://192.168.0.150/eerpwebv2/public/api/getPlates?"+ 'categoria_plato_id=3')
      let result = axios
        .get("http://192.168.0.150/eerpwebv2/public/api/getCategories")
        .then((res) => {
          this.sortOptions = res.data.categorias;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getPlates(id) {
      let result = axios
        .get(
          "http://192.168.0.150/eerpwebv2/public/api/getPlates?" +
            "categoria_plato_id=" +
            id +
            "&sucursal_id=" +
            3
        )
        .then((res) => {
          if (res.data.plate.length > 0) {
            this.plates = res.data.plate;
          } else {
            this.plates = null;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addPlate(data) {
      this.carrito.push({
        plato_id: data.id,
        plato: data.Plato,
        cantidad: 0,
        costo: data.Precio,
        subtotal: 0,
      });
    },
    deletePlate(id) {
      this.carrito.splice(id, 1);
      this.updateTotal();
    },
    totalVents(price) {
      return price + 1;
    },
    registerSale() {
      let turno_id = localStorage.getItem("turnoId");
      let datos_de_venta = {
        cliente: this.cliente,
        nit_ci: this.nit_ci,
        empresa: this.empresa,
        telefono: this.celular,
        total_venta: this.total,
        tipo_pago: this.optionsPayment.name,
        lugar: this.optionsPlace.name,
        turno_id: turno_id,
        user_id: 1,
        detalle_venta: this.carrito,
      };
      //console.log(datos_de_venta);

      axios
        .post(
          "http://192.168.0.150/eerpwebv2/public/api/sale_register",
          datos_de_venta
        )
        .then((result) => {
          console.log(result);
          if (result.data.status) {
            this.downloadPDF(datos_de_venta);
          }
        });
    },
    searchCliente() {
      console.log(this.nit_ci);
      if (this.nit_ci != "") {
        let result = axios
          .get(
            "http://192.168.0.150/eerpwebv2/public/api/filter_client?codigo=" +
              this.nit_ci
          )
          .then((res) => {
            let retorn = res.data;
            if (retorn.success) {
              this.celular = retorn.cliente.telefono;
              this.cliente = retorn.cliente.nombre;
              this.empresa = retorn.cliente.empresa;
            } else {
              this.celular = "";
              this.cliente = "";
              this.empresa = "";
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.celular = "";
        this.cliente = "";
        this.empresa = "";
      }
    },
    downloadPDF(datos) {
      console.log(datos);

      var content_qr = document.getElementById("content_qr");

      html2canvas(content_qr).then(function (canvas) {
        var pdf = new jsPDF();

        pdf.setFont("Arial");

        pdf.setFontSize(10);
        pdf.text("DONESCO SRL", 28, 4, "center");
        pdf.text("BODEGA PRINCIPAL", 28, 8, "center");
        pdf.setFontSize(8);
        pdf.text("Celular: 71387934", 28, 12, "center");
        pdf.text("Calle Mario Flores y Padre Adrian Melgar", 28, 16, "center");
        pdf.text("Santa Cruz - Bolivia", 28, 20, "center");
        pdf.text("SCF 1", 28, 24, "center");
        pdf.setFont("Arial", "B");
        pdf.setFontSize(11);
        pdf.text("FACTURA ORIGINAL", 28, 28, "center");
        pdf.text(
          "---------------------------------------------------",
          25,
          34,
          "center"
        );

        pdf.setFontSize(10);
        pdf.text("NIT: " + "166172023", 2, 38);
        pdf.text("FACTURA: " + "127", 2, 42);
        pdf.text("AUTORIZACION: " + "38401000410190", 2, 46);
        pdf.setFontSize(11);
        pdf.text(
          "---------------------------------------------------",
          25,
          52,
          "center"
        );

        pdf.setFontSize(10);
        pdf.text("Actividad Economica: " + datos.lugar, 2, 56);
        pdf.text("Fecha: " + new Date().toLocaleDateString(), 2, 60);
        pdf.text("Hora: " + new Date().toLocaleTimeString(), 2, 64);
        pdf.text("Cliente: " + datos.cliente, 2, 68);
        pdf.text("Nit/Ci: " + datos.nit_ci, 2, 72);

        pdf.setFontSize(11);
        pdf.text(
          "---------------------------------------------------",
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
          console.log(element);
          pdf.text(element.cantidad.toString(), 2, salto);
          pdf.text(element.plato.toString(), 12, salto);
          pdf.text(element.costo.toString(), 40, salto);
          pdf.text(element.subtotal.toString(), 55, salto);
          salto += 4;
        });
        salto += 4;
        pdf.setFontSize(11);
        pdf.text(
          "---------------------------------------------------",
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
        let descuento = 0;
        pdf.text(descuento.toString(), 55, salto);
        salto += 4;
        pdf.text("Total Bs", 2, salto);
        pdf.text((datos.total_venta - descuento).toString(), 55, salto);
        salto += 8;
        pdf.setFontSize(8);
        pdf.text(
          "Son : " +
            numeroALetras(datos.total_venta - descuento, {
              plural: "bolivianos",
              singular: "boliviano",
              centPlural: "centavos",
              centSingular: "centavo",
            }),
          2,
          salto
        );
        salto += 10;

        var imgData = canvas.toDataURL("image/png");
        var imgWidth = 250;
        var pageHeight = 310;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        var position = 0;
        pdf.addImage(imgData, "PNG", 25, salto, imgWidth, imgHeight);
        /*  doc.save("comprobanteVenta.pdf"); */
        var string = pdf.output("datauristring");
        var embed =
          "<embed width='100%' height='100%' src='" + string + "'><embed/>";
        var x = window.open();
        x.document.open();
        x.document.write(embed);
        x.document.close();
      });
    },
  },
};
var numeroALetras = (function () {
  // Código basado en https://gist.github.com/alfchee/e563340276f89b22042a
  function Unidades(num) {
    switch (num) {
      case 1:
        return "UN";
      case 2:
        return "DOS";
      case 3:
        return "TRES";
      case 4:
        return "CUATRO";
      case 5:
        return "CINCO";
      case 6:
        return "SEIS";
      case 7:
        return "SIETE";
      case 8:
        return "OCHO";
      case 9:
        return "NUEVE";
    }

    return "";
  } //Unidades()

  function Decenas(num) {
    let decena = Math.floor(num / 10);
    let unidad = num - decena * 10;

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0:
            return "DIEZ";
          case 1:
            return "ONCE";
          case 2:
            return "DOCE";
          case 3:
            return "TRECE";
          case 4:
            return "CATORCE";
          case 5:
            return "QUINCE";
          default:
            return "DIECI" + Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0:
            return "VEINTE";
          default:
            return "VEINTI" + Unidades(unidad);
        }
      case 3:
        return DecenasY("TREINTA", unidad);
      case 4:
        return DecenasY("CUARENTA", unidad);
      case 5:
        return DecenasY("CINCUENTA", unidad);
      case 6:
        return DecenasY("SESENTA", unidad);
      case 7:
        return DecenasY("SETENTA", unidad);
      case 8:
        return DecenasY("OCHENTA", unidad);
      case 9:
        return DecenasY("NOVENTA", unidad);
      case 0:
        return Unidades(unidad);
    }
  } //Unidades()

  function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0) return strSin + " Y " + Unidades(numUnidades);

    return strSin;
  } //DecenasY()

  function Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - centenas * 100;

    switch (centenas) {
      case 1:
        if (decenas > 0) return "CIENTO " + Decenas(decenas);
        return "CIEN";
      case 2:
        return "DOSCIENTOS " + Decenas(decenas);
      case 3:
        return "TRESCIENTOS " + Decenas(decenas);
      case 4:
        return "CUATROCIENTOS " + Decenas(decenas);
      case 5:
        return "QUINIENTOS " + Decenas(decenas);
      case 6:
        return "SEISCIENTOS " + Decenas(decenas);
      case 7:
        return "SETECIENTOS " + Decenas(decenas);
      case 8:
        return "OCHOCIENTOS " + Decenas(decenas);
      case 9:
        return "NOVECIENTOS " + Decenas(decenas);
    }

    return Decenas(decenas);
  } //Centenas()

  function Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let letras = "";

    if (cientos > 0)
      if (cientos > 1) letras = Centenas(cientos) + " " + strPlural;
      else letras = strSingular;

    if (resto > 0) letras += "";

    return letras;
  } //Seccion()

  function Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMiles = Seccion(num, divisor, "UN MIL", "MIL");
    let strCentenas = Centenas(resto);

    if (strMiles == "") return strCentenas;

    return strMiles + " " + strCentenas;
  } //Miles()

  function Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor);
    let resto = num - cientos * divisor;

    let strMillones = Seccion(num, divisor, "UN MILLON DE", "MILLONES DE");
    let strMiles = Miles(resto);

    if (strMillones == "") return strMiles;

    return strMillones + " " + strMiles;
  } //Millones()

  return function NumeroALetras(num, currency) {
    currency = currency || {};
    let data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: Math.round(num * 100) - Math.floor(num) * 100,
      letrasCentavos: "",
      letrasMonedaPlural: currency.plural || "PESOS CHILENOS", //'PESOS', 'Dólares', 'Bolívares', 'etcs'
      letrasMonedaSingular: currency.singular || "PESO CHILENO", //'PESO', 'Dólar', 'Bolivar', 'etc'
      letrasMonedaCentavoPlural: currency.centPlural || "CHIQUI PESOS CHILENOS",
      letrasMonedaCentavoSingular:
        currency.centSingular || "CHIQUI PESO CHILENO",
    };

    if (data.centavos > 0) {
      data.letrasCentavos =
        "CON " +
        (function () {
          if (data.centavos == 1)
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoSingular
            );
          else
            return (
              Millones(data.centavos) + " " + data.letrasMonedaCentavoPlural
            );
        })();
    }

    if (data.enteros == 0) return "CERO " + data.letrasMonedaPlural;
    if (data.enteros == 1)
      return (
        Millones(data.enteros) + " " + "00/100" + data.letrasMonedaSingular
      );
    else
      return Millones(data.enteros) + " " + "00/100 " + data.letrasMonedaPlural;
  };
})();

// Modo de uso: 500,34 USD
numeroALetras(500.34, {
  plural: "dólares estadounidenses",
  singular: "dólar estadounidense",
  centPlural: "centavos",
  centSingular: "centavo",
});
</script>

<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <div class="formgrid grid" :style="'display: flex;width:100%;'">
          <div class="field col-9">
            <h5 :style="'text-align:left;clear: both; '">
              Formulario de Registro - Nro de Transaccion:
              {{ this.nro_transaccion + 1 }}
            </h5>

          </div>
          <div class="field col-3">
            <div class="modalidadoffline">
              <div class="panel-heading">
                <h5 class="panel-title">Emision Fuera de Linea</h5>
              </div>

              <div class="panel-body">
                <label class="switch">
                  <input type="checkbox" @click="toggleCheckbox()" />
                  <div class="slider round"></div>
                </label>
              </div>
            </div>
          </div>
          <br />
          <div class="field col-2" v-if="infopersonal.sucursal == 18">
            <h5 :style="'text-align:right'">
              Nro Visitas: {{ contador_visitas }}
            </h5>
          </div>
        </div>

        <div class="formgrid grid">
          <div class="field col-2">
            <label for="lugar">Lugar</label>
            <Dropdown
              v-model="optionsPlace"
              :options="optionsPlaces"
              optionLabel="name"
              :placeholder="optionsPlace"
              @change="mostrarDeliverys()"
            />
          </div>
          <div
            class="field col-2"
            :style="isVisibilityDeliverys ? 'display:block' : 'display:none'"
          >
            <label for="delivery">Delivery</label>
            <Dropdown
              v-model="optionsDelivery"
              :options="optionsDeliverys"
              optionLabel="delivery"
              :placeholder="optionsDelivery.name"
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
            <label for="lugar">Tipo de Documento</label>
            <Dropdown
              v-model="documentoIdentidad"
              :options="documentosIdentidades"
              optionLabel="descripcion"
              :placeholder="'Seleccione tipo documento'"
              @change="obtenerIdentityDocument()"
            />
          </div>

          <div class="field col-2">
            <label for="nit_ci">Nro de Documento</label>
            <InputText
              id="nit_ci"
              type="text"
              placeholder="Nro de Documento"
              v-model="nit_ci"
              v-on:keyup="searchCliente()"
            />
          </div>
          <div class="field col-2">
            <label for="complemento">Complemento</label>
            <InputText
              id="complemento"
              type="text"
              placeholder="Complemento"
              v-model="complemento"
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
          <div class="field col-2">
            <label for="correo">Correo</label>
            <InputText
              id="correo"
              type="text"
              placeholder="Correo"
              v-model="correo"
            />
          </div>
          <div
            class="field col-2"
            :style="checkbox == true ? 'display:block' : 'display:none'"
          >
            <label for="lugar">Seleccione la Contingencia</label>
            <Dropdown
              v-model="contingencia"
              :options="contingencias"
              optionLabel="descripcion"
              :placeholder="'Seleccione una contingencia'"
              @change="obtenerEvento()"
            />
          </div>
          <div
            class="field col-2"
            :style="checkbox == true ? 'display:block' : 'display:none'"
          >
            <label for="lugar">Fecha de Emision Manual</label>
            <Calendar
              v-model="fecha_emision_manual"
              :showButtonBar="true"
              placeholder="Fecha Emision Manual"
            />
          </div>
          <div
            class="field col-2"
            :style="checkbox == true ? 'display:block' : 'display:none'"
          >
            <label for="lugar">Hora de Emision Manual</label>
            <Calendar
              v-model="hora_emision_manual"
              :showButtonBar="true"
              placeholder="Hora Emision Manual"
              :timeOnly="true"
            />
          </div>
          <div class="field col-2" v-if="infopersonal.sucursal == 18">
            <label for="codigo">Codigo</label>
            <InputText
              id="codigo"
              type="number"
              placeholder="Codigo"
              v-model="codigo"
              v-on:keyup="searchClientePhone()"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="col-7">
      <div class="card">
        <h5>Platos Ofertados</h5>
        <TabMenu :model="categorias2">
          <template #item="{ item }">
            <Button
              class="p-button-outlined p-button-secondary"
              @click="onSortChange(item.id)"
              :label="item.label"
            ></Button>
          </template>
        </TabMenu>

        <DataView
          :value="plates"
          :layout="layout"
          :paginator="true"
          :rows="9"
          :sortOrder="sortOrder"
          :sortField="sortField"
        >
          <template #grid="slotProps">
            <div class="col-12 md:col-6">
              <div
                class="
                  card
                  m-1
                  border-1
                  surface-border
                  justify-content-center
                  align-items-center
                "
              >
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
                <div class="flex align-items-center justify-content-center">
                  <div class="row">
                    <Button
                      class="p-button-raised p-button-primary mr-2 mb-2"
                      :label="'Venta N. ' + slotProps.data.Precio + ' Bs'"
                      style="padding: 5px; margin-top: 5px"
                      v-on:click="addPlateNormal(slotProps.data)"
                    ></Button>
                    <Button
                      class="p-button-raised p-button-info mr-2 mb-2"
                      :label="
                        'Delivery ' + slotProps.data.PrecioDelivery + ' Bs'
                      "
                      style="padding: 5px; margin-top: 5px"
                      v-on:click="addPlateDelivery(slotProps.data)"
                    ></Button>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </DataView>
      </div>
    </div>
    <div class="col-5">
      <div class="card">
        <h5>Detalle de Venta</h5>
        <DataTable
          :value="carrito"
          :scrollable="false"
          scrollHeight="500px"
          :loading="loading2"
          scrollDirection="both"
          class="mt-2"
          :responsiveLayout="true"
        >
          <Column :style="{ width: '50px' }" header=" ">
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
            field="descuento"
            header="Descuento"
            :style="{ width: '150px' }"
          >
            <template #body="slotProps">
              <input
                type="number"
                :value="slotProps.data.descuento"
                style="width: 100%"
                v-on:keyup="
                  calculateSubtotalDescuento(
                    this.carrito.indexOf(slotProps.data)
                  )
                "
              />
            </template>
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
          <div class="grid">
            <div class="col-10">
              <p>Total Descuento x Producto:</p>
            </div>
            <div class="col-2">
              <p class="text-right">{{ this.totalDescuento }} bs.</p>
            </div>
          </div>

          <div class="grid">
            <div class="col-10">
              <p>Total Descuento:</p>
            </div>
            <div class="col-2">
              <input
                type="number"
                style="width: 100%"
                :value="this.totalDescuentoAdicional"
              />
            </div>
          </div>
          <div class="grid">
            <div class="col-10">
              <p>Total Neto:</p>
            </div>
            <div class="col-2">
              <p class="text-right">{{ total - totalDescuento }} bs.</p>
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
  <div id="content_qr" style="opacity: 0">
    <qrcode-vue :value="QRValue" size="200" level="L" />
  </div>
  <div id="qr_code"></div>
</template>

<script>
import { inject } from "vue";
import ProductService from "../service/ProductService";
import moment from "moment";
import axios from "axios";
import QrcodeVue from "qrcode.vue";
import downloadPDF from "../utils/FacturaPDF.js";
import downloadPDFP from "../utils/FacturaPersonal.js";
import generateControlCode from "../utils/CodigoControl.js";
import QRCode from "qrcode";
export default {
  name: "catalogo",
  data() {
    return {
      hora_emision_manual: null,
      fecha_emision_manual: null,
      categorias2: [],
      checkbox: false,
      isVisibilityDeliverys: false,
      optionsDelivery: { name: "PedidosYa" },
      optionsDeliverys: [
        { delivery: "PedidosYa" },
        { delivery: "PatioService" },
        { delivery: "Yaigo" },
        { delivery: "MrDelivery" },
        { delivery: "Km6" },
        { delivery: "SuperHelper" },
        { delivery: "OrdenYa" },
        { delivery: "UbertEats" },
      ],
      nro_transaccion: 0,
      codigo: "",
      datos_empresa: {
        nombre: "DONESCO SRL",
        celular: "78555410",
        fecha: "2021-03-23",
        nit: "166172023",
      },
      QRValue: "",
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
      totalDescuento: 0,
      totalDescuentoAdicional: 0,
      totalNeto: 0,
      nit_ci: "",
      complemento: "",
      cliente: "",
      empresa: "",
      celular: "",
      correo: "",
      cufd: null,
      infopersonal: [],
      contador_visitas: 0,
      contingencias: [],
      documentosIdentidades: [],
      documentoIdentidad: 1,
      contingencia: null,
    };
  },
  components: {
    QrcodeVue,
  },
  setup() {
    const url = inject("url");
    return {
      url,
    };
  },
  productService: null,
  created() {
    this.productService = new ProductService();
   /*  axios
      .get(this.url + "conexion-siat")
      .then(response => {
        if(response.status == 500){
            this.toggleCheckbox()
        }else if(!response.data.return.transaccion){
            this.toggleCheckbox()
        }
      }) */
  },
  mounted() {
    this.get_transaction();
    this.authenticacion();
    this.productService
      .getProducts()
      .then((data) => (this.dataviewValue = data));
    this.getCategorias();
    this.getCufd();
    this.getEventsSignificative();
    this.getIdentityDocuments();
  },
  methods: {
    authenticacion() {
      if (
        localStorage.getItem("User") == null ||
        localStorage.getItem("User") == "undefined"
      ) {
        this.$router.push("/login");
      } else {
        this.infopersonal = JSON.parse(localStorage.getItem("User"));
      }

      if (
        localStorage.getItem("turnoId") == null ||
        localStorage.getItem("turnoId") == "undefined"
      ) {
        this.$router.push("/turno");
      } else {
        let result = axios
          .get(
            this.url +
              "verified_turn?id_turno=" +
              JSON.parse(localStorage.getItem("turnoId"))
          )
          .then((res) => {
            if (res.data.success == false) {
              this.$router.push("/turno");
            } else {
              if (localStorage.getItem("Orden") == null) {
                localStorage.setItem("Orden", 1);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    updateTotal() {
      this.total = 0;
      for (let i = 0; i < this.carrito.length; i++) {
        this.total += parseFloat(this.carrito[i].subtotal);
      }
    },
    updateTotalDescuento() {
      this.totalDescuento = 0;
      for (let i = 0; i < this.carrito.length; i++) {
        this.totalDescuento += parseFloat(this.carrito[i].descuento);
      }
    },
    getEventsSignificative() {
      ///getSignifficantEvents
      let result = axios
        .get(this.url + "getSignifficantEvents")
        .then((res) => {
          //console.log(res.data.events);
          this.contingencias = res.data.events;
          /*  console.log(this.contingencias); */
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getIdentityDocuments() {
      let result = axios
        .get(this.url + "getIdentityDocuments")
        .then((res) => {
          console.log(res.data.documentosIdentidades);
          this.documentosIdentidades = res.data.documentosIdentidades;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    calculateSubtotal: function (id) {
      this.carrito[id].cantidad = event.target.value;
      let subtotal_parse = this.redondear(
        this.carrito[id].costo * this.carrito[id].cantidad
      );
      let subtotal_parse_float = parseFloat(subtotal_parse);
      this.carrito[id].subtotal = subtotal_parse_float.toFixed(2);
      this.updateTotal();
    },
    calculateSubtotalDescuento: function (id) {
      this.carrito[id].descuento = event.target.value;
      /*   this.carrito[id].descuento = subtotal_parse_float.toFixed(2); */
      this.updateTotalDescuento();
    },

    onSortChange(categoria_id) {
      this.getPlates(categoria_id);
    },
    getCategorias() {
      let result = axios
        .get(
          this.url +
            "getCategories?" +
            "sucursal_id=" +
            JSON.parse(localStorage.getItem("User")).sucursal
        )
        .then((res) => {
          this.sortOptions = res.data.categorias;

          for (let i = 0; i < res.data.categorias.length; i++) {
            let element = res.data.categorias[i];
            this.categorias2.push({
              id: element.id,
              label: element.nombre,
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getPlates(id) {
      let result = axios
        .get(
          this.url +
            "getPlates?" +
            "categoria_plato_id=" +
            id +
            "&sucursal_id=" +
            JSON.parse(localStorage.getItem("User")).sucursal
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
    addPlateNormal(data) {
      this.carrito.push({
        plato_id: data.id,
        plato: data.Plato,
        cantidad: 0,
        descuento: 0,
        costo: data.Precio,
        subtotal: 0,
      });
    },
    addPlateDelivery(data) {
      this.carrito.push({
        plato_id: data.id,
        plato: data.Plato,
        cantidad: 0,
        descuento: 0,
        costo: data.PrecioDelivery,
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
      let fecha = new Date();
      let fecha_actual = this.parseFecha(fecha);
      let fecha_prueba = moment().format("dddd");
      /* console.log("patrick" + fecha_prueba); */

      let fecha_emision_manual_2;
      let hora_emision_manual_2;
      if (
        this.fecha_emision_manual != null &&
        this.hora_emision_manual != null
      ) {
        fecha_emision_manual_2 = moment(this.fecha_emision_manual).format(
          "Y-MM-DD"
        );
        hora_emision_manual_2 = moment(this.hora_emision_manual).format(
          "HH:mm:ss"
        );
      } else {
        fecha_emision_manual_2 = this.fecha_emision_manual;
        hora_emision_manual_2 = this.hora_emision_manual;
      }

      let turno_id = localStorage.getItem("turnoId");
      let datos_de_venta;
      let eventoid = this.contingencia === null ? null : this.contingencia.id;
      let identity_document_id = this.documentoIdentidad.id;

      this.$swal.fire({
        title: "Registrando la venta ...",
        allowEscapeKey: false,
        icon: "info",
        allowOutsideClick: false,
        background: "#19191a",
        showConfirmButton: false,
        onOpen: () => {
          this.$swal.showLoading();
        },
      });

      if (
        this.cliente == "" &&
        this.nit_ci == "" &&
        this.empresa == "" &&
        this.celular == "" &&
        this.correo == ""
      ) {
        console.log("Cufd: ", this.cufd);
        datos_de_venta = {
          correo: "SIN CORREO",
          cliente: "SIN NOMBRE",
          nit_ci: "0",
          complemento: this.complemento,
          nro_factura: this.cufd.numero_factura + 1,
          empresa: "SIN EMPRESA",
          telefono: 0,
          delivery: this.optionsDelivery.delivery,
          total_venta: this.total.toFixed(2),
          total_descuento: this.totalDescuento.toFixed(2),
          total_descuento_adicional: this.totalDescuentoAdicional.toFixed(2),
          tipo_pago: this.optionsPayment.name,
          lugar: this.optionsPlace.name,
          turno_id: turno_id,
          user_id: JSON.parse(localStorage.getItem("User")).user_id,
          sucursal_nombre: JSON.parse(localStorage.getItem("User"))
            .sucursal_nombre,
          detalle_venta: this.carrito,
          /*   codigo_control: this.generarCodigoControl(codigoControl).toString(), */
          qr: this.QRValue,
          sucursal: JSON.parse(localStorage.getItem("User")).sucursal,
          orden: localStorage.getItem("Orden"),
          evento_significativo_id: eventoid,
          fecha_emision_manual: fecha_emision_manual_2,
          hora_emision_manual: hora_emision_manual_2,
          documento_identidad_id: identity_document_id,
        };
      } else {
        datos_de_venta = {
          correo: this.correo,
          cliente: this.cliente,
          nit_ci: this.nit_ci == "" ? "0" : this.nit_ci.toString(),
          complemento: this.complemento,
          nro_factura: this.cufd.numero_factura + 1,
          empresa: this.empresa == "" ? "SIN EMPRESA" : this.empresa,
          telefono: this.celular,
          delivery: this.optionsDelivery.delivery,
          total_venta: this.total.toFixed(2),
          total_descuento: this.totalDescuento.toFixed(2),
          total_descuento_adicional: this.totalDescuentoAdicional.toFixed(2),
          tipo_pago: this.optionsPayment.name,
          lugar: this.optionsPlace.name,
          turno_id: turno_id,
          user_id: JSON.parse(localStorage.getItem("User")).user_id,
          sucursal_nombre: JSON.parse(localStorage.getItem("User"))
            .sucursal_nombre,
          detalle_venta: this.carrito,
          qr: this.QRValue,
          sucursal: JSON.parse(localStorage.getItem("User")).sucursal,
          orden: localStorage.getItem("Orden"),
          evento_significativo_id: eventoid,
          fecha_emision_manual: fecha_emision_manual_2,
          hora_emision_manual: hora_emision_manual_2,
          documento_identidad_id: identity_document_id,
        };
      }
      axios.post(this.url + "sale_register", datos_de_venta).then((result) => {
        let visitas = result.data.cantidad_visitas;

        if (result.data.status) {
          let cuf = result.data.cuf;
          let leyenda = result.data.leyenda.descripcion_leyenda;
          let idcliente = result.data.idcliente;
          let nro_factura = result.data.nro_factura;
          console.log(
            "datos para el QR:",
            this.datos_empresa.nit,
            cuf,
            nro_factura
          );
          this.QRValue =
            "https://pilotosiat.impuestos.gob.bo/consulta/QR?nit=" +
            this.datos_empresa.nit +
            "&cuf=" +
            cuf +
            "&numero=" +
            nro_factura +
            "&t=" +
            1;
          console.log("Este es el QR linea 719: ", this.QRValue);

          this.get_transaction();
          if (result.data.response_siat != "undefined") {
            this.$swal.close();
            this.$swal.fire({
              position: "center",
              icon: "success",
              title: "Success",
              text: "Venta Registrada Exitosamente, Fuera de Linea",
              showConfirmButton: true,
              timer: 1500,
            });
          }
          console.log(
            result.data.response_siat.RespuestaServicioFacturacion.codigoEstado
          );

          let response_siat = result.data.response_siat
            ? result.data.response_siat.RespuestaServicioFacturacion
            : "";
          this.$swal.close();

          if (response_siat != "") {
            console.log(result.data.response_siat.RespuestaServicioFacturacion);
            if (response_siat.codigoEstado == 908) {
              this.$swal.fire({
                position: "center",
                icon: "success",
                title: "Codigo Estado: " + response_siat.codigoEstado,
                text: "Codigo Descripcion: " + response_siat.codigoDescripcion,
                showConfirmButton: true,
                timer: 1500,
              });
            } else if (response_siat.codigoEstado == 902) {
              this.$swal.fire({
                position: "center",
                icon: "error",
                title: response_siat.codigoEstado,
                text:
                  response_siat.codigoDescripcion +
                  ' "' +
                  response_siat.mensajesList.descripcion +
                  '"',
                showConfirmButton: true,
                timer: 5000,
              });
            } else {
              this.$swal.fire({
                position: "center",
                icon: "error",
                title: response_siat.codigoEstado,
                text:
                  response_siat.codigoDescripcion +
                  ' "' +
                  response_siat.mensajesList.descripcion +
                  '"',
                showConfirmButton: true,
                timer: 5000,
              });
            }
          }
          if (
            result.data.response_siat.RespuestaServicioFacturacion
              .codigoEstado === 902
          ) {
            return;
          }
          if (
            result.data.response_siat == "undefined" &&
            result.data.response_siat.RespuestaServicioFacturacion
              .codigoEstado !== 902
          ) {
            setTimeout(function () {
              downloadPDF(
                datos_de_venta,
                this.cufd,
                visitas,
                cuf,
                idcliente,
                leyenda
              );
            }, 100);
          }

          if (this.optionsPayment.name == "Comida Personal") {
            this.sale_personal(datos_de_venta, 0);
          } else {
            setTimeout(function () {
              downloadPDF(
                datos_de_venta,
                this.cufd,
                visitas,
                cuf,
                idcliente,
                leyenda
              );
            }, 50);
          }

          let ord = localStorage.getItem("Orden");
          localStorage.setItem("Orden", Number(ord) + 1);
          this.carrito = [];
          this.totalDescuento = 0;
          this.totalNeto = 0;
          this.total = 0;
          this.cliente = "";
          this.nit_ci = "";
          this.empresa = "";
          this.celular = "";
          this.correo = "";
        } else {
          this.$swal.fire({
            position: "top-end",
            icon: "error",
            title: "La venta no se registro correctamente  . . . ",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    },
    parseFecha(fecha) {
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
    },
    parseFechaC_Control(fecha) {
      let fecha_actual = fecha;
      /*  console.log(fecha.getMonth() + 1);
      console.log(fecha.getDate()); */
      if (fecha.getMonth() + 1 < 10 && fecha.getDate() < 10) {
        fecha_actual =
          fecha.getFullYear() +
          "0" +
          (fecha.getMonth() + 1).toString() +
          "0" +
          fecha.getDate().toString();
      } else if (fecha.getDate() < 10) {
        fecha_actual =
          fecha.getFullYear() +
          (fecha.getMonth() + 1).toString() +
          "0" +
          fecha.getDate().toString();
      } else if (fecha.getMonth() + 1 < 10) {
        fecha_actual =
          fecha.getFullYear() +
          "0" +
          (fecha.getMonth() + 1).toString() +
          fecha.getDate().toString();
      }

      return fecha_actual;
    },
    sale_personal(datos, visitas) {
      /*    console.log("prueba"); */
      downloadPDFP(datos, visitas);
    },
    searchCliente() {
      /*   console.log(this.nit_ci); */
      if (this.nit_ci != "") {
        let result = axios
          .get(this.url + "filter_client?codigo=" + this.nit_ci)
          .then((res) => {
            let retorn = res.data;
            if (retorn.success) {
              this.celular = retorn.cliente.telefono;
              this.complemento = retorn.cliente.complemento;
              this.cliente = retorn.cliente.nombre;
              this.empresa = retorn.cliente.empresa;
              this.correo = retorn.cliente.correo;
              this.contador_visitas = retorn.cliente.contador_visitas;
            } else {
              this.celular = "";
              this.cliente = "";
              this.empresa = "";
              this.correo = "";
              this.contador_visitas = 0;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.celular = "";
        this.cliente = "";
        this.empresa = "";
        this.contador_visitas = 0;
      }
    },
    getCufd() {
      let sucursal_id = JSON.parse(localStorage.getItem("User")).sucursal;
      let result = axios
        .get(this.url + "getCufd?" + "sucursal_id=" + sucursal_id)
        .then((res) => {
          this.cufd = JSON.parse(res.data.cufd);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUserData() {},
    redondear(monto) {
      console.log(monto);
      let _monto = monto.toFixed(2);
      return _monto;
    },
    searchClientePhone() {
      if (this.codigo != "") {
        let result = axios
          .get(this.url + "filter_client_phone?celular=" + this.codigo)
          .then((res) => {
            /*  console.log(res); */
            let retorn = res.data;
            if (retorn.success) {
              this.nit_ci = retorn.cliente.ci_nit;
              this.complemento = retorn.cliente.complemento;
              this.celular = retorn.cliente.telefono;
              this.cliente = retorn.cliente.nombre;
              this.empresa = retorn.cliente.empresa;
              this.correo = retorn.cliente.correo;
              this.contador_visitas = retorn.cliente.contador_visitas;
            } else {
              this.celular = "";
              this.cliente = "";
              this.empresa = "";
              this.correo = "";
              this.contador_visitas = 0;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.celular = "";
        this.cliente = "";
        this.contador_visitas = 0;
        this.empresa = "";
      }
    },
    get_transaction() {
      let result = axios
        .get(
          this.url +
            "get_transaction?turno_id=" +
            JSON.parse(localStorage.getItem("turnoId"))
        )
        .then((res) => {
          /* console.log(res.data); */
          this.nro_transaccion = res.data.nro_transaccion;
        });
    },
    mostrarDeliverys() {
      /* console.log(this.optionsPlace.name); */

      if (this.optionsPlace.name == "Delivery") {
        this.isVisibilityDeliverys = true;
      } else {
        this.isVisibilityDeliverys = false;
      }
    },
    toggleCheckbox() {
      this.checkbox = !this.checkbox;
    },
  },
};
</script>
<style scoped lang="scss">
@import "../assets/demo/badges.scss";
body {
  text-align: center;
  background: #51c3a0;
  padding: 50px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 56px;
  height: 24px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 1.5px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #101010;
}

input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.modalidadoffline {
  display: grid;
  grid-template-columns: auto auto;
}
</style>

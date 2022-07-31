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
            <label for="contador_visitas"> Nro Visitas</label>
            <InputText
              id="contador_visitas"
              type="number"
              placeholder=""
              v-model="contador_visitas"
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
                class="
                  flex flex-column
                  md:flex-row
                  align-items-center
                  p-3
                  w-full
                "
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
                  class="
                    flex flex-row
                    md:flex-column
                    justify-content-between
                    w-full
                    md:w-auto
                    align-items-center
                    md:align-items-end
                    mt-5
                    md:mt-0
                  "
                >
                  <span
                    class="
                      text-2xl
                      font-semibold
                      mb-2
                      align-self-center
                      md:align-self-end
                    "
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
  <div id="content_qr" style="opacity: 0">
    <qrcode-vue :value="QRValue" size="80" level="H" />
  </div>
</template>

<script>
import ProductService from "../service/ProductService";
import axios from "axios";
import QrcodeVue from "qrcode.vue";
import downloadPDF from "../utils/FacturaPDF.js";
import generateControlCode from "../utils/CodigoControl.js";

export default {
  data() {
    return {
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
      nit_ci: "",
      cliente: "",
      empresa: "",
      celular: "",
      autorizacion: null,
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
    this.authenticacion();
    this.productService
      .getProducts()
      .then((data) => (this.dataviewValue = data));
    this.getCategorias();
    this.getAutorizacion();
    console.log(this.autorizacion);
  },
  updated() {
    console.log(this.subtotal);
  },
  methods: {
    authenticacion() {
      if (localStorage.getItem("User") == null) {
        this.$router.push("/login");
      }
      if (localStorage.getItem("turnoId") == null) {
        //verified_turn
        this.$router.push("/turno");

      }else{

          let result = axios
          .get("http://192.168.0.150/eerpwebv2/public/api/verified_turn?id_turno="+JSON.parse(localStorage.getItem("turnoId")))
          .then((res) => {
             console.log(res);
            if(res.data.success==false){
                this.$router.push("/turno");
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
    calculateSubtotal: function (id) {
      this.carrito[id].cantidad = event.target.value;
      let subtotal_parse = this.redondear(
        this.carrito[id].costo * this.carrito[id].cantidad
      );
      let subtotal_parse_float = parseFloat(subtotal_parse);
      this.carrito[id].subtotal = subtotal_parse_float.toFixed(2);
      this.updateTotal();
    },
    onSortChange(event) {
      let id = event.value.id;
      this.getPlates(id);
    },
    getCategorias() {
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
             JSON.parse(localStorage.getItem("User")).sucursal
        )
        .then((res) => {
          console.log(res);
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
      let fecha = new Date();
      let fecha_actual =
        fecha.getDate() +
        "-" +
        (fecha.getMonth() + 1).toString() +
        "-" +
        fecha.getFullYear();
      let turno_id = localStorage.getItem("turnoId");
      let datos_de_venta;
      if (
        this.cliente == "" &&
        this.nit_ci == "" &&
        this.empresa == "" &&
        this.celular == ""
      ) {
        let codigoControl = {
          nro_autorizacion: this.autorizacion.nro_autorizacion,
          nro_factura: this.autorizacion.nro_factura + 1,
          nit_ci: "0",
          fecha_transaccion:
            fecha.getDate().toString() +
            (fecha.getMonth() + 1).toString() +
            fecha.getFullYear().toString(),
          total_transaccion: this.total.toString(),
          llave_dosificacion: this.autorizacion.llave,
        };

        this.QRValue =
          this.datos_empresa.nit.toString() +
          "|" +
          codigoControl.nro_factura +
          "|" +
          codigoControl.nro_autorizacion +
          "|" +
          fecha_actual.replace("/", "-") +
          "|" +
          codigoControl.total_transaccion +
          "|" +
          codigoControl.total_transaccion +
          "|" +
          this.generarCodigoControl(codigoControl).toString() +
          "|" +
          codigoControl.nit_ci +
          "|" +
          "0" +
          "|" +
          "0" +
          "|" +
          "0" +
          "|";
        datos_de_venta = {
          cliente: "SIN NOMBRE",
          nit_ci: 0,
          nro_factura: this.autorizacion.nro_factura + 1,
          nro_autorizacion: this.autorizacion.nro_autorizacion,
          empresa: "SIN EMPRESA",
          telefono: 0,
          total_venta: this.total.toFixed(2),
          tipo_pago: this.optionsPayment.name,
          lugar: this.optionsPlace.name,
          turno_id: turno_id,
          user_id: JSON.parse(localStorage.getItem("User")).user_id,
          detalle_venta: this.carrito,
          codigo_control: this.generarCodigoControl(codigoControl).toString(),
          qr: this.QRValue,
          sucursal: JSON.parse(localStorage.getItem("User")).sucursal,
        };
      } else {
        let codigoControl = {
          nro_autorizacion: this.autorizacion.nro_autorizacion,
          nro_factura: this.autorizacion.nro_factura + 1,
          nit_ci: this.nit_ci.toString(),
          fecha_transaccion:
            fecha.getDate() + fecha.getMonth() + fecha.getFullYear(),
          total_transaccion: this.total.toString(),
          llave_dosificacion: this.autorizacion.llave,
        };
        this.QRValue =
          this.datos_empresa.nit.toString() +
          "|" +
          codigoControl.nro_factura +
          "|" +
          codigoControl.nro_autorizacion +
          "|" +
          fecha_actual.replace("/", "-") +
          "|" +
          codigoControl.total_transaccion +
          "|" +
          codigoControl.total_transaccion +
          "|" +
          this.generarCodigoControl(codigoControl).toString() +
          "|" +
          codigoControl.nit_ci +
          "|" +
          "0" +
          "|" +
          "0" +
          "|" +
          "0" +
          "|";
        datos_de_venta = {
          cliente: this.cliente,
          nit_ci: this.nit_ci,
          nro_factura: this.autorizacion.nro_factura + 1,
          nro_autorizacion: this.autorizacion.nro_autorizacion,
          empresa: this.empresa,
          telefono: this.celular,
          total_venta: this.total.toFixed(2),
          tipo_pago: this.optionsPayment.name,
          lugar: this.optionsPlace.name,
          turno_id: turno_id,
          user_id: JSON.parse(localStorage.getItem("User")).user_id,
          detalle_venta: this.carrito,
          codigo_control: this.generarCodigoControl(codigoControl).toString(),
          qr: this.QRValue,
          sucursal: JSON.parse(localStorage.getItem("User")).sucursal,
        };
      }
      /* console.log(datos_de_venta); */
      axios
        .post(
          "http://192.168.0.150/eerpwebv2/public/api/sale_register",
          datos_de_venta
        )
        .then((result) => {
          //console.log(result);
          console.log(result.data);
          let visitas = result.data.cantidad_visitas;
          //cantidad_visitas
          if (result.data.status) {
            this.$swal.fire({
              position: "top-end",
              icon: "success",
              title: "Venta registrada correctamente . . . ",
              showConfirmButton: false,
              timer: 1500,
            });
            downloadPDF(datos_de_venta, visitas);
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
              this.contador_visitas = retorn.cliente.contador_visitas;
            } else {
              this.celular = "";
              this.cliente = "";
              this.empresa = "";
              this.contador_visitas = "";
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
    generarCodigoControl(codigo_control) {
      return generateControlCode(
        codigo_control.nro_autorizacion,
        codigo_control.nro_factura,
        codigo_control.nit_ci,
        codigo_control.fecha_transaccion,
        codigo_control.total_transaccion,
        codigo_control.llave_dosificacion
      );
    },
    getAutorizacion() {
      let sucursal_id = JSON.parse(localStorage.getItem("User")).sucursal;
      let result = axios
        .get(
          "http://192.168.0.150/eerpwebv2/public/api/getAutorization?" +
            "sucursal_id=" +
            sucursal_id
        )
        .then((res) => {
          this.autorizacion = JSON.parse(res.data.autorizaciones);
          console.log(this.autorizacion);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    redondear(monto) {
      let _monto = monto.toFixed(1);
      let dato = _monto.toString();
      let ultimo = _monto.toString().charAt(dato.length - 1);
      console.log("dato: ",dato);
      console.log("ultimo: ",ultimo);
      if (parseInt(ultimo) > 5) {
        _monto = Math.round(_monto);
        console.log(_monto);
      } else {
        if (parseInt(ultimo) == 0) {
          _monto = Math.round(_monto);
          console.log(_monto);
        } else {
          _monto = Math.round(_monto)+ ".50" ;
          console.log(_monto);
        }
      }
      return _monto;
    },
  },
};
</script>
<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style>


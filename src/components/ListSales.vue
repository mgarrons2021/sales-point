  <template>
  <div class="col-12 md:col-12">
    <div class="card p-fluid">
      <h5>Filtrar ventas</h5>
      <div class="grid">
        <div class="field col-4">
          <label for="name1">Desde</label>
          <Calendar inputId="calendar" v-model="desde"></Calendar>
        </div>
        <div class="field col-4">
          <label for="email1">Hasta</label>
          <Calendar inputId="calendar" v-model="hasta"></Calendar>
        </div>
        <div class="field col-4">
          <br />
          <Button
            label="Filtrar"
            class="col-4"
            style="padding: 10px; margin-top: 5px"
            @click="filterDates()"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="col-12 md:col-12">
    <div class="card p-fluid">
      <DataTable
        :value="ventas"
        :scrollable="false"
        :paginator="true"
        :rows="10"
        scrollHeight="500px"
        scrollDirection="both"
        class="p-datatable-gridlines"
        responsiveLayout="scroll"
      >
        <Column :style="{ width: '150px' }" header="Fecha" field="fecha_venta">
          <template #body="slotProps">
            <td style="" class="text-bold">
              <a
                >{{ slotProps.data.fecha_venta }}
                {{ slotProps.data.hora_venta }}
              </a>
            </td>
          </template>
        </Column>

        <Column
          field="tipo_pago"
          header="Tipo Pago"
          :style="{ width: '150px' }"
          frozen
        ></Column>
        <Column
          field="total_venta"
          header="Total Venta"
          :style="{ width: '150px' }"
        >
          <template #body="slotProps">
            <td>{{ slotProps.data.total_venta }} Bs</td>
          </template>
        </Column>
        <Column
          field="estado"
          header="Estado"
          :style="{ width: '150px' }"
          frozen
        >
          <template #body="slotProps">
            <td style="text-align: right" class="text-bold">
              <Button
                v-if="slotProps.data.estado == 0"
                label="ANULADO"
                icon="pi pi-info-circle"
                class="mr-2 mb-2 p-button-danger"
                v-on:click="cambiarEstado(slotProps.data.id, 'ACTIVADO', 1,slotProps.data.turno)"
              />
              <Button
                v-else
                label="ACTIVO"
                icon="pi pi-check-circle"
                class="mr-2 mb-2 p-button-info"
                v-on:click="cambiarEstado(slotProps.data.id, 'ANULADO', 0 ,slotProps.data.turno )"
              />
            </td>
          </template>
        </Column>
        <Column field="detalle" header="Detalle" :style="{ width: '50px' }">
          <template #body="slotProps">
            <td style="text-align: right" class="text-bold">
              <Button
                icon="pi pi-eye"
                class="mr-2 mb-2 p-button-success"
                v-on:click="showDetails(slotProps.data.id)"
              />

              <Button
                icon="pi pi-print"
                class="p-button-rounded p-button-danger mr-2 mb-2"
                v-on:click="
                  print_pdf(slotProps.data.id, slotProps.data.tipo_pago)
                "
              />
            </td>
          </template>
        </Column>
      </DataTable>
    </div>
    <modal :show="showModal" :datas="detail" @close="showModal = false">
      <template #header>
        <h3>DETALLE VENTA</h3>
      </template>
    </modal>
    <div id="content_qr" style="opacity: 0">
      <qrcode-vue id="qr" :value="QRValue" size="80" level="H" />
    </div>
  </div>
</template>
<script>


import ProductService from "../service/ProductService";
import axios from "axios";
import QrcodeVue from "qrcode.vue";
import Modal from "../components/Carrito.vue";
import downloadPDF from "../utils/FacturaPDF.js";
import downloadPDFP from "../utils/FacturaPersonal.js";
import generateControlCode from "../utils/CodigoControl.js";
import { inject } from 'vue';

export default {
  name: "sales",
  data() {
    return {
      desde: "",
      hasta: "",
      ventas: [],
      detail: "",
      showModal: false,
      QRValue: "",
    };
  },
  mounted() {
    this.authenticacion();
    this.getSales(
      new Date(Date.now()).getFullYear() +
        "-" +
        (new Date(Date.now()).getMonth() + 1) +
        "-" +
        new Date(Date.now()).getUTCDate(),
      new Date(Date.now()).getFullYear() +
        "-" +
        (new Date(Date.now()).getMonth() + 1) +
        "-" +
        new Date(Date.now()).getUTCDate(),
      JSON.parse(localStorage.getItem("User")).sucursal
    );
  },
  methods: {
    authenticacion() {
      if (localStorage.getItem("User") == null) {
        this.$router.push("/login");
      }
    },
    getSales(inicio, fin, sucursal) {
      axios
        .get(
          this.url+"sales_lists?fecha_inicio='" +
            inicio +
            "'&fecha_fin='" +
            fin +
            "'&sucursal=" +
            sucursal
        )
        .then((result) => {
          if (result.data.success) {
            //console.log(result);
            this.ventas = result.data.sale;
          } else {
            this.ventas = [];
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    cambiarEstado( id, estado, cod_estado , turno ) {
      this.$swal
        .fire({
          title: "Cambiar estado ?",
          text: "Cambiara el estado a  " + estado + " ",
          icon: "info",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si cambiar",
        })
        .then((result) => {

          if (result.isConfirmed) {

            axios
              .get(
                this.url+"change_status_sale?id_venta=" +
                  id +
                  "&estado=" +
                  cod_estado+"&turno="+turno
              )
              .then((result) => {
                if (result.data.success) {
                  this.$swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "El estado se ha cambiado correctamente",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                  this.getSales(
                    new Date(Date.now()).getFullYear() +
                      "-" +
                      (new Date(Date.now()).getMonth() + 1) +
                      "-" +
                      new Date(Date.now()).getUTCDate(),
                    new Date(Date.now()).getFullYear() +
                      "-" +
                      (new Date(Date.now()).getMonth() + 1) +
                      "-" +
                      new Date(Date.now()).getUTCDate(),
                    JSON.parse(localStorage.getItem("User")).sucursal
                  );
                } else {
                  this.$swal.fire({
                    position: "top-end",
                    icon: "warning",
                    title: "El estado no se ha cambiado correctamente",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                }
              })
              .catch((e) => {
                console.log(e);
              });
            
          }

        });
    },
    showDetails(id) {
      axios
        .get(
          this.url+"sales_lists_detail?venta_id=" +
            id
        )
        .then((result) => {
          if (result.data.success) {
            this.detail = result.data.sales_detail;
            this.showModal = true;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    filterDates() {
      let d = new Date(this.desde);
      let d1 = new Date(this.hasta);
      let data1 =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getUTCDate();
      let data2 =
        d1.getFullYear() + "-" + (d1.getMonth() + 1) + "-" + d1.getUTCDate();
      this.getSales(
        data1,
        data2,
        JSON.parse(localStorage.getItem("User")).sucursal
      );
    },

    print_pdf(id_venta, tipo_pago) {
     
      if (tipo_pago == "Comida Personal") {
        axios
          .get(
            this.url+"sales_for_id_personal?id=" +
              id_venta
          )
          .then((result) => {
            if (result.data.success) {
               this.QRValue = result.data.ventas.qr;
              console.log(result.data);
              let ventas = result.data.venta_detalle;
              let detalles = [];

              for (let i = 0; i < ventas.length; i++) {
                detalles.push({
                  cantidad: ventas[i].cantidad,
                  plato: ventas[i].nombre,
                  costo: ventas[i].precio,
                  subtotal: ventas[i].subtotal,
                });
              }

              let datos_de_venta = {
                cliente: result.data.ventas.nombre,
                nit_ci: result.data.ventas.ci_nit,
                total_venta: result.data.ventas.total_venta,
                tipo_pago: result.data.ventas.tipo_pago,
                detalle_venta: detalles,
                fecha:
                  result.data.ventas.fecha_venta +
                  " " +
                  result.data.ventas.hora_venta,
                orden: 0,
                sucursal_nombre: result.data.ventas.sucursal,
                sucursal:result.data.ventas.sucursal
              };

              downloadPDFP(datos_de_venta, 0);
            } else {
              console.log(result.data);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        axios
          .get(
            this.url+"sales_for_id?id=" +
              id_venta
          )
          .then((result) => {
            if (result.data.success) {
              console.log("result de api: ",result.data);
              this.QRValue = result.data.ventas.qr;
              let ventas = result.data.venta_detalle;
              let detalles = [];

              for (let i = 0; i < ventas.length; i++) {
                detalles.push({
                  cantidad: ventas[i].cantidad,
                  plato: ventas[i].nombre,
                  costo: ventas[i].precio,
                  subtotal: ventas[i].subtotal,
                });
              }

              let datos_de_venta = {
                cliente: result.data.ventas.nombre,
                nit_ci: result.data.ventas.ci_nit,
                nro_factura: result.data.ventas.numero_factura,
                nro_autorizacion: result.data.ventas.nro_autorizacion,
                telefono:
                  result.data.ventas.telefono == null
                    ? 0
                    : result.data.ventas.telefono,
                total_venta: result.data.ventas.total_venta,
                tipo_pago: result.data.ventas.tipo_pago,
                detalle_venta: detalles,
                codigo_control: result.data.ventas.codigo_control,
                qr: this.QRValue,
                sucursal:result.data.ventas.sucursal,
              };
              
              setTimeout(function (){
                downloadPDF(datos_de_venta, result.data.ventas.contador_visitas);
              }, 1);

              
            } 
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
  },
  components: {
    Modal,
   QrcodeVue,
  },
  setup() {
    const url = inject('url');  
    return {
      url
    }
  }
};
</script>
<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style> 


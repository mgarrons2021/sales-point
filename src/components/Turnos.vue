<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h3 class="text-center">Iniciar nuevo Turno</h3>

        <h4 class="text-center">
          Sucursal: {{ infopersonal.sucursal_nombre }}
        </h4>

        <div class="mt-5 col-5 m-auto">
          <p class="text-center m-5">{{ fecha }}</p>
          <p class="text-center m-5">
            Turno : <b>{{ turno }}</b>
          </p>
          <Button
            class="form-submit w-full p-3 text-xl justify-content-between"
            @click="goTurn()"
            label="Iniciar Turno"
            type="submit"
            value="login"
          ></Button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="card">
        <DataTable
          :value="turno_habilitado"
          :scrollable="false"
          :paginator="true"
          :rows="10"
          scrollHeight="500px"
          scrollDirection="both"
          class="p-datatable-gridlines"
          responsiveLayout="scroll"
        >
          <Column
            :style="{ width: '150px' }"
            header="Fecha"
            field="fecha_venta"
          >
            <template #body="slotProps">
              <td style="" class="text-bold">
                {{ slotProps.data.fecha }}
              </td>
            </template>
          </Column>
          <Column :style="{ width: '150px' }" header="Turno" field="turno">
            <template #body="slotProps">
              <td style="" class="text-bold">
                {{ slotProps.data.turno }}
              </td>
            </template>
          </Column>
          <Column :style="{ width: '150px' }" header="Linkser" field="linkser">
            <template #body="slotProps">
              <td style="" class="text-bold">
                {{ slotProps.data.linkser }}
              </td>
            </template>
          </Column>
          <Column
            :style="{ width: '150px' }"
            header="Total Efectivo"
            field="total_efectivo"
          >
            <template #body="slotProps">
              <td style="" class="text-bold">
                {{ slotProps.data.total_efectivo }}
              </td>
            </template>
          </Column>
          <Column
            :style="{ width: '150px' }"
            header="Opciones"
            field="opciones"
          >
            <template #body="slotProps">
              <Button
                v-if="slotProps.data.turno_id != 0"
                label="Ingresar al Turno"
                class="
                  mr-2
                  mb-2
                  p-button-rounded p-button-outlined p-button-success
                "
                v-on:click="enter_the_turn(slotProps.data.turno_id)"
              />
              <span class="bg-warning" v-else>SIN TURNO</span>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { inject } from "vue";
export default {
  data() {
    return {
      turno_habilitado: [
        {
          turno_id: 0,
          fecha: "Sin fecha",
          turno: "Sin turno",
          linkser: 0,
          total_efectivo: 0,
        },
      ],
      fecha: "",
      MESES: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      Dias: [
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
        "Domingo",
      ],
      turno: "",
      infopersonal: "",
      idturn: 0,
    };
  },

  mounted() {
    this.authenticacion();
    this.obtenerDataStorage();
    this.obtenerDate();
    this.determinateAMorPM();
    this.get_open_turn();
  },
  methods: {
    authenticacion() {
      if (localStorage.getItem("User") == null) {
        this.$router.push("/login");
      }
      /* if (localStorage.getItem("turnoId") != null) {
        let result = axios
          .get(
            "http://192.168.0.150/eerpwebv2/public/api/verified_turn?id_turno=" +
              JSON.parse(localStorage.getItem("turnoId"))
          )
          .then((res) => {
            console.log(res);
            if (res.data.success == false) {
              this.$router.push("/turno");
            } else {
              this.$router.push("/catalogo");
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } */
    },
    onUpload() {
      this.$toast.add({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
        life: 3000,
      });
    },
    obtenerDate() {
      let fecha_unix = new Date();
      this.fecha =
        this.Dias[fecha_unix.getDay()] +
        " ,  " +
        fecha_unix.getDate() +
        " de  " +
        this.MESES[fecha_unix.getMonth()] +
        " de " +
        fecha_unix.getFullYear();
    },
    determinateAMorPM() {
      let var_post = {
        codigoPuntoVenta: 0,
        user_id: this.infopersonal.user_id,
        codigoFiscal: this.infopersonal.codigo_fiscal,
      };

      axios
        .post(this.url + "comprobeishon_turn", var_post)
        .then((result) => {
          /*  console.log(result); */
          let res = result.data.turno_id[0].total;
          if (res > 0) {
            this.turno = "PM";
          } else {
            this.turno = "AM";
          }
        })
        .catch((r) => {
          console.log(r);
        });
    },
    open_turn(var_post) {
      axios.post(this.url + "turn_register", var_post).then((result) => {
        /* OBTENGO EL CUFD */
        if (result.status == 200) {
          console.log("Codigo Cufd Generado Exitosamente");
          this.$swal.fire({
            position: "center",
            icon: "success",
            title: "Iniciaste un turno correctamente . . . ",
            showConfirmButton: true,
            timer: 1500,
          });
          localStorage.setItem("turnoId", result.data.turno_id);
          this.$router.push("/catalogo");
        } else {
          console.log("Something went Wrong");
        }
      });
    },
    goTurn() {
      let var_post = {
        user_id: this.infopersonal.user_id,
        sucursal_id: this.infopersonal.sucursal,
      };
      this.check_open_turn(var_post);
    },
    check_open_turn(var_post) {
      axios
        .get(
          this.url + "check_open_turn?sucursal_id=" + this.infopersonal.sucursal
        )
        .then((result) => {
          if (result.status == 200) {
            /*  console.log(result.data); */
            if (!result.data.status) {
              //Si no Hay Turnos Abiertos
              this.$swal.fire({
                title: "Abriendo Turno ...",
                allowEscapeKey: false,
                icon: "info",
                allowOutsideClick: false,
                background: "#19191a",
                showConfirmButton: false,
                onOpen: () => {
                  this.$swal.showLoading();
                },
              });
              this.open_turn(var_post);
            } else {
              //Si Hay algun turno abierto
              this.$swal.fire({
                position: "center",
                icon: "warning",
                title: "Ya existe un Turno Abierto . . . ",
                showConfirmButton: true,
                timer: 1500,
              });
            }
          }
        });
    },
    get_open_turn() {
      axios
        .get(
          this.url + "get_open_turn?sucursal_id=" + this.infopersonal.sucursal
        )
        .then((result) => {
          //1 es PM y 0s AM
          if (result.data.turno.length != 0) {
            this.turno_habilitado[0].turno_id = result.data.turno.id;
            this.turno_habilitado[0].fecha = result.data.turno.fecha;
            this.turno_habilitado[0].turno =
              result.data.turno.turno == 1 ? "PM" : "AM";
          } else {
            this.turno_habilitado = [];
          }
        });
    },
    obtenerDataStorage() {
      let dato = null;
      if (localStorage.getItem("turnoId") != "undefined") {
        dato = JSON.parse(localStorage.getItem("turnoId"));
        this.idturn = dato;
      }
      //puroo huevooo

      let dato1 = null;
      if (localStorage.getItem("User") != "undefined") {
        dato1 = JSON.parse(localStorage.getItem("User"));
        this.infopersonal = dato1;
      }
    },
    enter_the_turn(turno_id) {
      localStorage.setItem("turnoId", turno_id);
      this.$router.push("/catalogo");
    },
  },
  setup() {
    const url = inject("url");
    return {
      url,
    };
  },
};
</script>


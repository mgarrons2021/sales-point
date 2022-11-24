<style scoped>
.personal-badge {
  border-radius: 8px;
}
.badgered {
  background-color: red;
  color: white;
  padding: 4px 8px;
  text-align: center;
  border-radius: 5px;
}
.badgegreen {
  background-color: green;
  color: white;
  padding: 4px 8px;
  text-align: center;
  border-radius: 5px;
}
.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-left: 5px;
}
</style>

<template>
  <div class="layout-topbar">
    <button
      class="p-link layout-menu-button layout-topbar-button"
      @click="onMenuToggle"
    >
      <i class="pi pi-bars"></i>
    </button>
    <Button
      label="CERRAR TURNO"
      :style="isVisibilityButtonCloseTurn ? 'display:block' : 'display:none'"
      class="p-button-danger ml-5"
      @click="closeTurn()"
    >
    </Button>
    <div class="ml-auto">
      <span v-bind:class="{ badgegreen, badgered }">Conexion a SIAT</span>
      <img
        src="https://siat.impuestos.gob.bo/Autenticacion/common/images/SIAT.jpg"
        alt="Avatar"
        class="avatar"
      />
    </div>
    <!-- <Button
      label="Cambiar Color"
      class="p-button-warning ml-5"
      @click="(badgegreen= !badgegreen)"

    >  </Button>-->
    <button
      class="p-link layout-topbar-menu-button layout-topbar-button"
      v-styleclass="{
        selector: '@next',
        enterClass: 'hidden',
        enterActiveClass: 'scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'fadeout',
        hideOnOutsideClick: true,
      }"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button>
    <ul class="layout-topbar-menu hidden lg:flex origin-top">
      <li>
        <div>
          <b>{{ infopersonal.name }} </b><br />
          {{ infopersonal.sucursal_nombre }}
        </div>
      </li>
      <li>
        <button class="p-link layout-topbar-button">
          <i class="pi pi-user"></i>
          <span>Profile</span>
        </button>
      </li>
      <button
        class="p-link layout-menu-button layout-topbar-button"
        @click="closeSession()"
      >
        <i class="pi pi-power-off"></i>
      </button>
    </ul>
  </div>
</template>
<script>
import { inject } from "vue";
import axios from "axios";

export default {
  data() {
    return {
      isVisibilityButtonCloseTurn: true,
      showModal: false,
      infopersonal: "",
      badgered: false,
      badgegreen: true,
    };
  },
  methods: {
    onMenuToggle(event) {
      this.$emit("menu-toggle", event);
    },
    onTopbarMenuToggle(event) {
      this.$emit("topbar-menu-toggle", event);
    },
    topbarImage() {
      return this.$appState.darkTheme
        ? "images/logo-white.svg"
        : "images/logo-dark.svg";
    },
    verificarConexion() {},
    verificar() {
      return false;
    },
    closeTurn() {
      this.$swal
        .fire({
          title: "Cerrar turno?",
          text:
            "Cerrara el turno en  sucursal -> de " +
            this.infopersonal.sucursal_nombre +
            " ",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si cerrar",
        })
        .then((result) => {
          if (result.isConfirmed) {
            let turno = localStorage.getItem("turnoId");
            this.infopersonal = JSON.parse(localStorage.getItem("User"));
            let cerrar_turno = {
              turno_id: turno,
              sucursal_id: this.infopersonal.sucursal,
            };
            axios
              .post(this.url + "updated_turn", cerrar_turno)
              .then((result) => {
                localStorage.removeItem("turnoId");
                localStorage.setItem("Orden", 1);
                if (result.status == 200) {
                  console.log(result);
                  this.$router.push("/turno");
                } else {
                  console.log("Peticion Fallida");
                }
              });

            this.$swal.fire("Ok", "Turno cerrado correctamente", "success");
          }
        });
    },
    check_open_turn() {
      let turno_id = localStorage.getItem("turnoId");
      console.log("Turno Existe :  " + (turno_id != null).toString());
      if (turno_id == null) {
        this.isVisibilityButtonCloseTurn = false;
      } else {
        this.isVisibilityButtonCloseTurn = true;
      }
    },
    returnPerson() {
      this.infopersonal = JSON.parse(localStorage.getItem("User"));
    },
    closeSession() {
      //et dato=  (this.infopersonal==null)?'Invalid'
      let user = {
        user: this.infopersonal.codigo,
      };
      this.$swal
        .fire({
          title: "Cerrar sesion?",
          text: "",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Si cerrar",
        })
        .then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem("User");
            this.$swal.fire("Ok", "Sesion cerrada correctamente", "success");
            this.$router.push("/login");
          }
        });
    },
  },

  mounted() {
    this.returnPerson();
    this.check_open_turn();
  },
  updated() {
    this.check_open_turn();
  },
  computed: {
    darkTheme() {
      return this.$appState.darkTheme;
    },
  },
  setup() {
    const url = inject("url");
    return {
      url,
    };
  },
  created() {
    axios.get(this.url + "conexion-siat").then((response) => {
      if (response.status == 500) {
        this.badgegreen = false;
        this.badgered = true;
      } else if (!response.data.return.transaccion) {
        this.badgegreen = false;
        this.badgered = true;
      }
    });
  },
};
</script>

<template>
  <form action class="form" @submit.prevent="login" id="app">
    <div
      class="
        surface-0
        flex
        align-items-center
        justify-content-center
        min-h-screen min-w-screen
        overflow-hidden
      "
    >
      <div
        class="grid justify-content-center p-2 lg:p-0"
        style="min-width: 80%"
      >
        <div
          class="col-12 xl:col-6"
          style="
            border-radius: 56px;
            padding: 0.3rem;
            background: linear-gradient(
              180deg,
              var(--primary-color),
              rgba(33, 150, 243, 0) 30%
            );
          "
        >
          <div
            class="h-full w-full m-0 py-7 px-4"
            style="
              border-radius: 53px;
              background: linear-gradient(
                180deg,
                var(--surface-50) 38.9%,
                var(--surface-0)
              );
            "
          >
            <div class="text-center mb-5">
              <img
                src="layout/images/avatar.png"
                alt="Image"
                height="50"
                class="mb-3"
              />
              <div class="text-900 text-3xl font-medium mb-3">
                MAGNOREST
              </div>
              <span class="text-600 font-medium">Comienza ahora..</span>
            </div>

            <div class="w-full md:w-10 mx-auto">
              <InputText
                id="email"
                v-model="email"
                type="hidden"
                class="w-full mb-3"
                placeholder="Email"                 
                style="padding: 1rem"/>

              <label
                for="codigo"
                class="block text-900 font-medium text-xl mb-2"
                >Codigo Usuario*</label>
              <input
                v-model="codigo"
                class="form-input w-full mb-3"
                type="number"
                id="codigo"
                style="padding: 1rem"
                placeholder="Ingrese Codigo"/>

              <div class="flex align-items-center justify-content-between mb-5">
                <div class="flex align-items-center">
                  <Checkbox
                    id="rememberme1"
                    v-model="checked"
                    :binary="true"
                    class="mr-2"
                  ></Checkbox>
                  <label for="rememberme1">Recuerdame</label>
                </div>
                <a
                  class="
                    font-medium
                    no-underline
                    ml-2
                    text-right
                    cursor-pointer
                  "
                  style="color: var(--blue-color)"
                  >Olvidaste tu contraseña?</a
                >
              </div>
              <Button
                class="form-submit w-full p-3 text-xl"
                label="Ingresa"
                type="submit"
                value="login"
              ></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import Vue from "vue";
import axios from "axios";

export default {
  data: () => ({
    codigo: "",
    error: false,
    notificationSystem: {
      options: {
        show: {
          theme: "dark",
          icon: "icon-person",
          position: "topCenter",
          progressBarColor: "rgb(0, 255, 184)",
          buttons: [
            [
              "<button>Ok</button>",
              function (instance, toast) {
                alert("Hello world!");
              },
              true,
            ],
            [
              "<button>Close</button>",
              function (instance, toast) {
                instance.hide(
                  {
                    transitionOut: "fadeOutUp",
                    onClosing: function (instance, toast, closedBy) {
                      console.info("closedBy: " + closedBy);
                    },
                  },
                  toast,
                  "buttonName"
                );
              },
            ],
          ],
          onOpening: function (instance, toast) {
            console.info("callback abriu!");
          },
          onClosing: function (instance, toast, closedBy) {
            console.info("closedBy: " + closedBy);
          },
        },
        ballon: {
          balloon: true,
          position: "bottomCenter",
        },
        info: {
          position: "bottomLeft",
        },
        success: {
          position: "bottomRight",
        },
        warning: {
          position: "topLeft",
        },
        error: {
          position: "topRight",
        },
        question: {
          timeout: 20000,
          close: false,
          overlay: true,
          toastOnce: true,
          id: "question",
          zindex: 999,
          position: "center",
          buttons: [
            [
              "<button><b>YES</b></button>",
              function (instance, toast) {
                instance.hide({ transitionOut: "fadeOut" }, toast, "button");
              },
              true,
            ],
            [
              "<button>NO</button>",
              function (instance, toast) {
                instance.hide({ transitionOut: "fadeOut" }, toast, "button");
              },
            ],
          ],
          onClosing: function (instance, toast, closedBy) {
            console.info("Closing | closedBy: " + closedBy);
          },
          onClosed: function (instance, toast, closedBy) {
            console.info("Closed | closedBy: " + closedBy);
          },
        },
      },
    },
  }),
  methods: {
    login() {
      let codigo_auth = {
        codigo: this.codigo,
      };
      axios
      .post(
        "http://192.168.0.150/eerpwebv2/public/api/login_sales",
        codigo_auth
      )
      .then((result) => {
        if (result.data["token"] != "") {

          localStorage.setItem('User', JSON.stringify(result.data)  );
          this.$router.push("/turno");
         

        }else {
          console.log(result.data.name);
        }
      });
      
    },

    computed: {
      logoColor() {
        if (this.$appState.darkTheme) return "white";
        return "dark";
      },
    },
    mounted() {
      //   this.$toast.show("Welcome!", "Hey", this.notificationSystem.options.show);
    },
    components: {},
  },
};
</script>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
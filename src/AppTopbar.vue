<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<!--<img alt="Logo" :src="topbarImage()" /> -->
			<span>Donesco Srl</span>
		</router-link>
		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>
		
		<Button label="CERRAR TURNO" class="p-button-danger ml-5" @click="closeTurn()" />
		
		<button class="p-link layout-topbar-menu-button layout-topbar-button"
			v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', 
			leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
			<i class="pi pi-ellipsis-v"></i>
		</button>
		<ul class="layout-topbar-menu hidden lg:flex origin-top">
			<li>
				<div>
				<b>{{infopersonal.name}} </b><br>
				{{ infopersonal.sucursal_nombre}}
				</div>
			</li>
			<li>
				<button class="p-link layout-topbar-button">
					<i class="pi pi-user"></i>
					<span>Profile</span>
				</button>
			</li>
			<button class="p-link layout-menu-button layout-topbar-button" @click="closeSession()" >
				<i class="pi pi-power-off"></i>
			</button>
		</ul>            
	</div>
</template>
<script>
import axios from "axios";
export default {
    methods: {
        onMenuToggle(event) {
            this.$emit('menu-toggle', event);
        },
		onTopbarMenuToggle(event) {
            this.$emit('topbar-menu-toggle', event);
        },
		topbarImage() {
			return this.$appState.darkTheme ? 'images/logo-white.svg' : 'images/logo-dark.svg';
		},
		closeTurn(){
			this.$swal.fire({
				title: 'Cerrar turno?',
				text: "Cerrara el turno en  sucursal -> de "+(this.infopersonal.sucursal_nombre)+" " , 
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Si cerrar'
				}).then((result) => {
				if (result.isConfirmed) {
					let turno = localStorage.getItem('turnoId');
					this.infopersonal = JSON.parse(localStorage.getItem('User')) ;

					let cerrar_turno = {
						turno_id:  turno,
						sucursal_id : this.infopersonal.sucursal 
					}; 			
					axios.post("http://192.168.0.150/eerpwebv2/public/api/updated_turn",cerrar_turno)
					.then((result)=>{		
						console.log(result);
						localStorage.removeItem('turnoId');
						if (result.status == 200){
							//console.log('ok');
							this.$router.push("/turno");
						}else{
							console.log('Peticion Fallida');
						}
					});

					this.$swal.fire(
					'Ok',
					'Turno cerrado correctamente',
					'success'
					)
				}
			})
			
		},
		returnPerson(){
			this.infopersonal =JSON.parse(localStorage.getItem('User'));
		},
		closeSession(){
			let user = {
				user: this.infopersonal.codigo,
			};
			axios.post("http://192.168.0.150/eerpwebv2/public/api/logout",user).then((result)=>{
				if(result.status == 200){

					console.log('Deslogeo exitoso'); 
					this.$swal.fire({
						title: 'Cerrar sesion?',
						text: "",
						icon: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'Si cerrar'
						}).then((result) => {
						if (result.isConfirmed) {
							localStorage.removeItem('User');
							this.$swal.fire(
							'Ok',
							'Sesion cerrada correctamente',
							'success'
							);
							this.$router.push("/login");
						}
			});
				}else{

					this.$swal.fire({
				title: 'Error Algo Salio Mal',
				text: "",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Volver'
				}).then((result) => {
				if (result.isConfirmed) {
					localStorage.removeItem('User');
					this.$swal.fire(
					'Ok',
					'Sesion cerrada correctamente',
					'success'
					);
					this.$router.push("/login");
				}
			});

				}
				
			
			});
		

		
			
		}
    },
	mounted() {                           
		this.returnPerson();      
		                      
	},
	data(){
		 return{
			  showModal: false,
			  infopersonal:'',
		 }
	},

	computed: {
		darkTheme() {
			return this.$appState.darkTheme;
		},		

	},	
}
</script>

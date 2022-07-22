<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
			<h4 class="text-center " ><span class="bg-primary m-3 p-3 br-3"> Termino el Turno correctamente </span> </h4>
				<h3 class="text-center "> Iniciar  nuevo  Turno  </h3>
				
				<h4 class="text-center" v-if="idturn!=0"> Sucursal: {{ infopersonal.sucursal_nombre}}  </h4>
				<h4 class="text-center" v-else> Sucursal:  </h4>
 				<div class="mt-5 col-5 m-auto"> 
					 <p class="text-center m-5 "> {{fecha}}  </p>	
					  <p class="text-center m-5 "> Turno : <b>{{ turno}}</b>  </p>				  
					 <Button class="form-submit w-full p-3 text-xl justify-content-between  " @click="goTurn()"  label="Iniciar Turno"  type="submit" value="login"></button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>

import axios from "axios";
	export default {
		data() {
			return {
				fecha:'',
				MESES : [
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
				Dias:["Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"],
				turno:'',
				infopersonal:'',
				idturn:0,
			}
		},
		mounted(){
			this.obtenerDataStorage();
			this.obtenerDate();
			this.determinateAMorPM();
			
		},
		methods: {
			onUpload() {
				this.$toast.add({severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000});
			},
			obtenerDate(){
				let fecha_unix =  new Date();				
				this.fecha = this.Dias[fecha_unix.getDay()]+' ,  '+fecha_unix.getDate()+' de  '+ this.MESES[fecha_unix.getMonth()]+ ' de '+fecha_unix.getFullYear();
			},
			determinateAMorPM(){
				let date= new Date(Date.now());
				if(date.getHours()>=16){
					this.turno ='PM';
				}else{
					this.turno='AM';
				}				
			},
            goTurn(){	
				let var_post = {
					user_id:  this.infopersonal.user_id,
					sucursal_id : this.infopersonal.sucursal,
				};
				axios.post("http://192.168.0.150/eerpwebv2/public/api/turn_register",var_post)
				.then((result)=>{			
					console.log(result);	
					if (result.status == 200){
						localStorage.setItem('turnoId',result.data.turno_id)
						this.$router.push("/catalogo");						
					}else{
						console.log('Peticion Fallida'); 

					}
				});   
			},
			obtenerDataStorage(){
				let dato  = JSON.parse( localStorage.getItem('turnoId'));
				if(dato!=null){					
					this.idturn = dato;
				}else{
					console.log(' cerro turno ');
				}				
				let dato1  = JSON.parse( localStorage.getItem('User'));
				if(dato1!=null){
					this.infopersonal = dato1;
				}
			}
		}
	}
</script>


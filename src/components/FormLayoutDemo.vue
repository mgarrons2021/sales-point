<template>
	<div class="grid">
		<div class="col-12 md:col-6">
			<div class="card p-fluid">
				<h5>Vertical</h5>
				<div class="field">
					<label for="name1">Name</label>
					<InputText id="name1" type="text" />
				</div>
				<div class="field">
					<label for="email1">Email</label>
					<InputText id="email1" type="text" />
				</div>
				<div class="field">
					<label for="age1">Age</label>
					<InputText id="age1" type="text" />
				</div>

				<!-- <div v-for="plate in plates" >

				</div> -->

				<li v-for="plate in plates" v-bind:key="plate">
					{{plate.Plato}}
					<img  :src="ruta+''+ plate.imagen"   >
				</li>

				<!-- Llamo a Mi API Platos -->
				<Button v-on:click="getPlates" > Listar Platos</Button>
			</div>
		</div>
	</div>
</template>

<!-- I must add the script part, in order to call back from my button upthere -->
<script>
import axios from "axios";

    export default {
        name: "ApiDemo",
		data() {
			return {
				plates: '',
				ruta: 'http://192.168.0.150/eerpwebv2/public/',
			}
		},
        methods: {
            getPlates(){
				let result = axios.get("http://192.168.0.150/eerpwebv2/public/api/getPlates?"+ 'categoria_plato_id=3')
				.then((res)=>{
					this.plates = res.data.plate;
					console.log(this.plates);
				})
				.catch((err)=>{
					console.log(err)
				})
            }
        }
    }
</script>
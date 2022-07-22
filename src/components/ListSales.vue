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
              <a>{{ slotProps.data.fecha_venta }}</a>
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
               <span v-if="slotProps.data.estadp==0">ANULADO</span>
               <span v-else>ACTIVO</span>
            </td>
          </template>                    
        </Column>
        <Column field="detalle" header="Detalle" :style="{ width: '50px' }">
          <template #body="slotProps">
            <td style="text-align: right" class="text-bold">
               <Button
                icon="pi pi-eye"
                class="mr-2 mb-2 p-button-success"     
                v-on:click="showDetails(  slotProps.data.id  )"                           
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
  </div>
</template>
<script>
import axios from "axios";
import Modal from '../components/Carrito.vue';
//pi-eye
export default {
  name: "sales",
  data() {
    return {
      desde: "",
      hasta: "",
      ventas: [],
      detail:'',
      showModal: false,
    };
  },
  mounted() {
    this.getSales( new Date(Date.now()).getFullYear()+"-"+(new Date(Date.now()).getMonth()+1)+"-"+new Date(Date.now()).getUTCDate(),new Date(Date.now()).getFullYear()+"-"+(new Date(Date.now()).getMonth()+1)+"-"+new Date(Date.now()).getUTCDate() );
  },
  methods: {
    getSales(inicio,fin) {        
        axios
        .get(
          "http://192.168.0.150/eerpwebv2/public/api/sales_lists?fecha_inicio='"+inicio+"'&fecha_fin='"+fin+"'",
        )
        .then((result) => {          
            if(result.data.success){
                //console.log(result);
                this.ventas=result.data.sale;
            }else{
                this.ventas=[];
            }
        }).catch((e)=>{
            console.log(e);
        });        
    },
    showDetails(id){
        axios
        .get(
          "http://192.168.0.150/eerpwebv2/public/api/sales_lists_detail?venta_id="+id,
        )
        .then((result) => {
            if(result.data.success){
                this.detail =result.data.sales_detail;
                this.showModal=true;
            }         
        }).catch((e)=>{
            console.log(e);
        });  
    },
    filterDates(){
        let d= new Date(this.desde);
        let d1= new Date(this.hasta);
        let data1=d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getUTCDate();
        let data2=d1.getFullYear()+'-'+(d1.getMonth()+1)+'-'+d1.getUTCDate();
        this.getSales(data1,data2); 
    }

    
  },
   components: {
       Modal
    }
};
</script>
<style scoped lang="scss">
@import "../assets/demo/badges.scss";
</style>
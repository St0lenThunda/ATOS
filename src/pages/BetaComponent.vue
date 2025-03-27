<template>
  <div>
    <h1>Data from API</h1>
    <div v-if=" loading ">Loading...</div>
    <div v-else-if=" error ">{{ error }}</div>
    <pre v-else>
     {{data }}
    </pre>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from 'axios'

const data = ref( [] );
const loading = ref( true );
const error = ref( null );

// Call API on component mount
onMounted( async () => {
  try {
    const response = await api.get( 'http://localhost:3000/api/data/' ); // Use your Axios instance
    data.value = JSON.stringify(response.data,null,2);
  } catch ( err ) {
    error.value = 'Error fetching data';
    console.error( err );
  } finally {
    loading.value = false;
  }
} );


</script>
<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>

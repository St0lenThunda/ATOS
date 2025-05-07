<template>
  <q-menu context-menu>
    <q-list style="min-width: 150px">
      <!-- <q-item
        clickable
        v-close-popup
        @click="radio"
      >
        <q-item-section>Radio Dialog</q-item-section>
      </q-item> -->
      <q-item
        clickable
        v-close-popup
        @click="newNode"
        v-if="store.nodeHasChildren"
      >
        <q-item-section>Add Node</q-item-section>
      </q-item>
      <q-separator />
      <q-item
        clickable
        v-close-popup
        @click="showNodeEditor"
      >
        <q-item-section>Edit Node</q-item-section>
      </q-item>
      <q-separator />
      <q-item
        clickable
        @click="confirmDelete"
        v-close-popup
      >
        <q-item-section>Delete Node</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup>
import { useQuasar } from 'quasar'
import { useThoughtStore } from 'src/stores/thoughts'
import AddNodeDialog from 'src/components/AddNodeDialog.vue'
const store = useThoughtStore()
const $q = useQuasar()
defineProps( {
  modelValue: {
    type: Boolean,
    default: false
  }
} )
const emit = defineEmits(['ShowEdit'])

const showNodeEditor = () => {

  $q.dialog( {
     title: 'Edit current node',
      cancel: true,
      persistent: true,
  } )
    .onOk( () => {
      emit('ShowEdit', true)
      console.debug( 'OK' )
    } )
    .onCancel( () => {
      console.debug( 'Cancel' )
    } )
    .onDismiss( () => {
      console.debug( 'Called on OK or Cancel' )
    } )
}
// const radio = () => {
//   $q.dialog( {
//     title: 'Options',
//     message: 'Choose an option:',
//     options: {
//       type: 'radio',
//       model: 'opt1',
//       // inline: true
//       items: [
//         { label: 'Option 1', value: 'opt1', color: 'secondary' },
//         { label: 'Option 2', value: 'opt2' },
//         { label: 'Option 3', value: 'opt3' },
//       ],
//     },
//     cancel: true,
//     persistent: true,
//   } )
//     .onOk( ( data ) => {
//       console.debug( '>>>> OK, received', data )
//     } )
//     .onCancel( () => {
//       console.debug( '>>>> Cancel' )
//     } )
//     .onDismiss( () => {
//       console.debug( 'I am triggered on both OK and Cancel' )
//     } )
// }
const newNode = () => {
  $q.dialog( {
    component: AddNodeDialog,
    // props forwarded to your custom component
    componentProps: {
      update: false,
      headerText: 'Add New Leaf',
    },
  } )
    .onOk( () => {
      console.debug( 'OK' )
    } )
    .onCancel( () => {
      console.debug( 'Cancel' )
    } )
    .onDismiss( () => {
      console.debug( 'Called on OK or Cancel' )
    } )
}

const confirmDelete = () => {
  if ( store.nodeHasChildren ) {
    $q.dialog( {
      title: 'Confirm',
      message: 'What about the children?',
      cancel: true,
      persistent: true,
    } )
      .onOk( () => {
        store.removeNodeById( store.selectedNode.id )
      } )
      .onCancel( () => {
        // console.debug('>>>> Cancel')
      } )
      .onDismiss( () => {
        // console.debug('I am triggered on both OK and Cancel')
      } )
  } else {
    $q.dialog( {
      title: 'Are you sure',
      message: 'This cannot be undone',
      cancel: true,
      persistent: true,
    } )
      .onOk( () => {
        let id = store.selectedNode.id
        store.removeNodeById( id )
        $q.notify( `Node ${id} >>>> Deleted` )
      } )
      .onOk( () => {
        console.debug( '>>>> second OK catcher' )
      } )
      .onCancel( () => {
        // console.debug('>>>> Cancel')
      } )
      .onDismiss( () => {
        // console.debug('I am triggered on both OK and Cancel')
      } )
  }
}
</script>

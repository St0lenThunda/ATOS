<script setup lang="ts">
import { useFetch } from '@vueuse/core'
import { useToggle } from '@vueuse/shared'
import { reactive, shallowRef } from 'vue'

const url = shallowRef( 'https://httpbin.org/get' )
const refetch = shallowRef( false )

const toggleRefetch = useToggle( refetch )

const {
  data,
  error,
  abort,
  statusCode,
  isFetching,
  isFinished,
  canAbort,
  execute,
} = useFetch( url, { refetch } ).get()

const text = JSON.stringify( reactive( {
  isFinished,
  isFetching,
  canAbort,
  statusCode,
  error,
  data: data.value,
} ) )
</script>

<template>
  <div>
    <div>
      <em>The following URLs can be used to test different features of useFetch</em>
      <div class="mt-2">
        Normal Request:
        <code>
          https://httpbin.org/get
        </code>
      </div>
      <div>
        Abort Request:
        <code>
          https://httpbin.org/delay/10
        </code>
      </div>
      <div>
        Response Error:
        <code>
          http://httpbin.org/status/500
        </code>
      </div>
    </div>

    <input
      v-model="url"
      type="text"
    >
    <button @click="() => execute()">
      Execute
    </button>
    <button @click="() => toggleRefetch()">
      <i
        v-if=" refetch "
        inline-block
        align-middle
        i-carbon-checkmark
      />
      <i
        v-else
        inline-block
        align-middle
        i-carbon-error
      />

      <span class="ml-2">{{ refetch ? 'Refetch On' : 'Refetch Off' }}</span>
    </button>
    <button
      v-if=" canAbort "
      class="orange"
      @click="abort"
    >
      Abort
    </button>
    <pre class="code-block">{{ text }}</pre>
  </div>
</template>

<template>
  <div
    className="vue-jsoneditor"
    ref="editor"
  ></div>
</template>

<script>
import _ from 'lodash';
import { createJSONEditor } from 'vanilla-jsoneditor';

const supportedPropNames = [
  'content',
  'selection',
  'readOnly',
  'indentation',
  'tabSize',
  'mode',
  'mainMenuBar',
  'navigationBar',
  'statusBar',
  'askToFormat',
  'escapeControlCharacters',
  'escapeUnicodeCharacters',
  'flattenColumns',
  'parser',
  'validator',
  'validationParser',
  'pathParser',
  'queryLanguages',
  'queryLanguageId',
  'onChangeQueryLanguage',
  'onChange',
  'onRenderValue',
  'onClassName',
  'onRenderMenu',
  'onRenderContextMenu',
  'onChangeMode',
  'onSelect',
  'onError',
  'onFocus',
  'onBlur',
];
const supportedPropNamesSet = new Set( supportedPropNames );

// Filter props with Lodash
function filterProps ( props, prevProps ) {
  const clonedProps = _.cloneDeep( props );
  return _.pickBy( clonedProps, ( value, key ) =>
    supportedPropNamesSet.has( key ) && !_.isEqual( value, prevProps[key] )
  );
}

export default {
  name: 'VueJSONEditor',
  props: supportedPropNames,
  mounted () {
    const props = filterProps( this, {} );
    this.prevProps = props;

    // Initialize the JSON editor
    this.editor = createJSONEditor( {
      target: this.$refs['editor'],
      props,
    } );

    // Throttle the expand function for efficiency
    const throttledExpand = _.throttle( ( relativePath ) => {
      return relativePath.length < 2;
    }, 200 );

    this.editor.expand( [], throttledExpand );

    console.debug( 'create editor', this.editor, props );

    // Debounced updateProps function for efficiency
    this.debouncedUpdateProps = _.debounce( ( updatedProps ) => {
      this.editor.updateProps( updatedProps );
    }, 100 );
  },
  updated () {
    const updatedProps = filterProps( this, this.prevProps );
    console.debug( 'update props', _.omit( updatedProps, ['onChange', 'onRenderMenu'] ) );
    this.prevProps = updatedProps;
    this.debouncedUpdateProps( updatedProps );
  },
  beforeUnmount () {
    console.debug( 'destroy editor' );
    if ( this.debouncedUpdateProps ) {
      this.debouncedUpdateProps.cancel();
    }
    this.editor.destroy();
    this.editor = null;
  },
};
</script>

<style scoped>
.vue-jsoneditor {
  display: flex;
  flex: 1;
}
</style>

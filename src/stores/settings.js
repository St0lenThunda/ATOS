import { defineStore, acceptHMRUpdate } from 'pinia'
import { LocalStorage, Notify, setCssVar } from 'quasar';

export const useSettings = defineStore( 'settingsStore', {
  state: () => ( {
    currentTheme: null,
    themes: {
      synthwave: {
        primary: '#FF007F',
        secondary: '#00FFFF',
        accent: '#6A0DAD',
        dark: '#1A1A2E',
        darkPage: '#0F0F1E',
        positive: '#32CD32',
        negative: '#FF4500',
        info: '#1E90FF',
        warning: '#FFD700',
      },
      minimalist: {
        primary: '#607D8B',
        secondary: '#B0BEC5',
        accent: '#90A4AE',
        dark: '#263238',
        darkPage: '#1C1C1C',
        positive: '#8BC34A',
        negative: '#D32F2F',
        info: '#0288D1',
        warning: '#FBC02D',
      },
      regalElegance: {
        primary: '#6A0DAD',
        secondary: '#FFD700',
        accent: '#FFFFFF',
        dark: '#2C2C2C',
        darkPage: '#1A1A1A',
        positive: '#32CD32',
        negative: '#DC143C',
        info: '#4682B4',
        warning: '#FFA500',
      },
      nature: {
        primary: '#4CAF50',
        secondary: '#8BC34A',
        accent: '#CDDC39',
        dark: '#2E7D32',
        darkPage: '#1B5E20',
        positive: '#76FF03',
        negative: '#D50000',
        info: '#2196F3',
        warning: '#FF9800',
      },
      vibrant: {
        primary: '#FF5722',
        secondary: '#FF9800',
        accent: '#FFC107',
        dark: '#BF360C',
        darkPage: '#FF6F00',
        positive: '#4CAF50',
        negative: '#D32F2F',
        info: '#2196F3',
        warning: '#FFEB3B',
      },
      accessible: {
        primary: '#000000', // Black for strong contrast
        secondary: '#FFFFFF', // White for text clarity
        accent: '#FFD700', // Gold for emphasis
        dark: '#333333', // Dark gray for backgrounds
        darkPage: '#1A1A1A', // Very dark gray for pages
        positive: '#00FF00', // Bright green for success
        negative: '#FF0000', // Bright red for errors
        info: '#0000FF', // Bright blue for information
        warning: '#FFA500', // Orange for warnings
      },
      popCulture: {
        primary: '#FF69B4', // Hot pink
        secondary: '#FFD700', // Gold
        accent: '#8A2BE2', // Blue violet
        dark: '#2F4F4F', // Dark slate gray
        darkPage: '#1C1C1C', // Very dark gray
        positive: '#32CD32', // Lime green
        negative: '#FF4500', // Orange red
        info: '#1E90FF', // Dodger blue
        warning: '#FF6347', // Tomato red
      },
      midnight: {
        primary: '#121212', // Almost black
        secondary: '#1E1E1E', // Dark gray
        accent: '#2C2C2C', // Slightly lighter gray
        dark: '#000000', // Pure black
        darkPage: '#0A0A0A', // Very dark black
        positive: '#4CAF50', // Muted green
        negative: '#D32F2F', // Muted red
        info: '#1976D2', // Muted blue
        warning: '#FFC107', // Muted yellow
      },
      neonLights: {
        primary: '#39FF14', // Neon green
        secondary: '#FF073A', // Neon red
        accent: '#00FFFF', // Neon cyan
        dark: '#0A0A0A', // Very dark gray
        darkPage: '#1A1A1A', // Dark gray
        positive: '#32FF32', // Bright neon green
        negative: '#FF3131', // Bright neon red
        info: '#00BFFF', // Neon blue
        warning: '#FFFF00', // Neon yellow
      }
    },
  } ),
  getters: {
    getCurrentTheme ( { currentTheme } ) {
      if ( !currentTheme ) {
        const savedTheme = this.getSavedTheme()
        this.currentTheme = this.themes[savedTheme]
      }
      return this.currentTheme || this.themes.synthwave
    },
    getCurrentThemeName ( { currentTheme } ) {
      return currentTheme ? Object.keys( this.themes ).find( ( key ) => this.themes[key] === currentTheme ) : 'synthwave' // Default to 'synthwave'
    },
    getThemeNames ( { themes } ) {

      return Object.keys( themes )

    },
    getSavedTheme () {
      return LocalStorage.getItem( 'selectedTheme' ) || 'synthwave'; // Default to 'synthwave'
    }
  },
  actions: {
    setTheme ( themeName ) {
      this.currentTheme = this.themes[themeName]
      if ( !this.currentTheme ) {
        console.error( `Theme ${themeName} not found` )
        return
      }
      // // Set the CSS variables for the selected theme
      // const setCSSVar = ( key, value ) => {
      //   document.documentElement.style.setProperty( `--q-${key}`, value , 'important')
      // }
      Object.keys( this.currentTheme ).forEach( ( key ) => {
        setCssVar( key, this.currentTheme[key] )
      } )

      LocalStorage.set( 'selectedTheme', themeName ); // Save the theme
      Notify.create( {
        message: `Theme switched to ${themeName}`,
        color: 'green',
        position: 'top',
        timeout: 2000,
      } );
      console.log( 'Theme switched to:', themeName );
    }
  },
} )

if ( import.meta.hot ) {
  import.meta.hot.accept( acceptHMRUpdate( useSettings, import.meta.hot ) )
}

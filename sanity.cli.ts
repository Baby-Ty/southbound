import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'i4wpmcsq',
    dataset: 'production'
  },
  
  /**
   * Enable auto-updates for studios.
   * Learn more: https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
}) 
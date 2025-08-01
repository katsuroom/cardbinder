import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const removeCrossorigin = () => {
  return {
    name: 'remove-crossorigin-attribute',
    transformIndexHtml(html) {
      return html.replaceAll(`type="module" crossorigin`, "defer").replaceAll(`crossorigin`, "");
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), removeCrossorigin()],
  server: {
    port: 3000
  },
  base: "",    // use relative paths for assets,
})

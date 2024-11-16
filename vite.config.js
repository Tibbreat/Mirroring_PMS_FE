// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react-swc'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     open: '/pms/auth/login',
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Chạy server dev trên cổng 3000
    open: '/pms/auth/login', // Mở sẵn trang này khi server khởi động
  },
  build: {
    outDir: 'dist', // Thư mục đầu ra khi build (mặc định là "dist")
    rollupOptions: {
      output: {
        manualChunks: undefined, // Tùy chọn gộp chunk (nếu cần)
      },
    },
  },
  base: '/pms/', // Cấu hình base URL nếu ứng dụng được deploy dưới thư mục con `/pms`
});

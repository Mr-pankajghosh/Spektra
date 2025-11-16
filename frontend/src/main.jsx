// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import "stream-chat-react/dist/css/v2/index.css";
// import './index.css'
// import App from './App.jsx'

// import { BrowserRouter } from "react-router";

// import {
//   QueryClient,
//   QueryClientProvider,
// } from '@tanstack/react-query'

// const queryClient = new QueryClient()

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//    <BrowserRouter>
//        <QueryClientProvider client={queryClient}>
//           <App />
//       </QueryClientProvider>
//     </BrowserRouter>
//   </StrictMode>
// );
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "stream-chat-react/dist/css/v2/index.css";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router-dom"; // ✅ correct import
import { AuthProvider } from "./context/AuthContext.jsx"; // ✅ add this

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>   {/* ✅ wrap app with AuthProvider */}
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import "antd/dist/antd.min.css";
import "@/styles/index.scss";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppSelect from "@/pages/app/views/select";
import AppAnalysis from "@/pages/app/views/analysis";
import AppPredict from "@/pages/app/views/predict";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="select" element={<AppSelect />} />
            <Route path="analysis" element={<AppAnalysis />} />
            <Route path="predict" element={<AppPredict />} />
            <Route path="*" element={<AppSelect />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

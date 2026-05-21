import React from "react";
import Navbar from "../components/Navbar"; // Navbar bileşenini buraya göre ayarla

export default function MainLayout({ children, scene }) {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: scene.gradient, // Seçilen temanın arka planı
      color: "white", 
      padding: "20px" 
    }}>
      <Navbar />
      <main style={{ marginTop: "40px" }}>
        {children}
      </main>
    </div>
  );
}
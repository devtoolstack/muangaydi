/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import LoadingBar from './components/LoadingBar';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import Coupons from './pages/Coupons';
import TermsPage from './pages/Terms';
import PrivacyPage from './pages/Privacy';
import PolicyPage from './pages/Policy';
import SheetEmbed from './pages/SheetEmbed';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import { ProductProvider } from './ProductContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <ProductProvider>
        <Router>
          <ScrollToTop />
          <LoadingBar />
          <div className="flex flex-col min-h-screen relative">
          {/* Mesh Background */}
          <div className="mesh-gradient">
            <div className="mesh-ball-1" />
            <div className="mesh-ball-2" />
            <div className="mesh-ball-3" />
          </div>

          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/khuyen-mai" element={<Coupons />} />
              <Route path="/cam-nang" element={<BlogList />} />
              <Route path="/cam-nang/:id" element={<BlogPost />} />
              <Route path="/dieu-khoan" element={<TermsPage />} />
              <Route path="/bao-mat" element={<PrivacyPage />} />
              <Route path="/chinh-sach" element={<PolicyPage />} />
              <Route path="/sheet" element={<SheetEmbed />} />
              <Route path="/:id" element={<ProductPage />} />
            </Routes>
          </main>
          <Footer />
          <BackToTop />
        </div>
      </Router>
    </ProductProvider>
    </HelmetProvider>
  );
}

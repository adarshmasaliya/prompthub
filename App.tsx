import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PromptProvider } from './context/PromptContext';

import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import PromptDetailPage from './pages/PromptDetailPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './admin/AdminLayout';
import DashboardPage from './admin/DashboardPage';
import PromptsListPage from './admin/PromptsListPage';
import PromptEditPage from './admin/PromptEditPage';
import CategoriesListPage from './admin/CategoriesListPage';
import Header from './components/Header';
import ImageGeneratorPage from './pages/ImageGeneratorPage';

function App() {
  return (
    <AuthProvider>
      <PromptProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/admin/*" element={
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="prompts" element={<PromptsListPage />} />
                    <Route path="prompts/new" element={<PromptEditPage />} />
                    <Route path="prompts/edit/:id" element={<PromptEditPage />} />
                    <Route path="categories" element={<CategoriesListPage />} />
                    <Route path="*" element={<Navigate to="dashboard" />} />
                  </Routes>
                </AdminLayout>
              } />

              <Route path="/*" element={
                <>
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/generate" element={<ImageGeneratorPage />} />
                      <Route path="/category/:categoryId" element={<CategoryPage />} />
                      <Route path="/prompt/:promptId" element={<PromptDetailPage />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </main>
                </>
              } />
            </Routes>
          </div>
        </HashRouter>
      </PromptProvider>
    </AuthProvider>
  );
}

export default App;
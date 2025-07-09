import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import TodayView from "@/components/pages/TodayView";
import UpcomingView from "@/components/pages/UpcomingView";
import CategoryView from "@/components/pages/CategoryView";
import ArchiveView from "@/components/pages/ArchiveView";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/today" element={<TodayView />} />
          <Route path="/upcoming" element={<UpcomingView />} />
          <Route path="/categories" element={<CategoryView />} />
          <Route path="/categories/:categoryId" element={<CategoryView />} />
          <Route path="/archive" element={<ArchiveView />} />
        </Routes>
      </Layout>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;
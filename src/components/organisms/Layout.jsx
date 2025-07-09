import { useState } from "react";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import TaskEditorModal from "@/components/organisms/TaskEditorModal";

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTaskEditorOpen, setIsTaskEditorOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleQuickAdd = () => {
    setIsTaskEditorOpen(true);
  };

  const handleTaskEditorClose = () => {
    setIsTaskEditorOpen(false);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={handleMobileMenuClose}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onSearch={handleSearch}
          onQuickAdd={handleQuickAdd}
          onMobileMenuToggle={handleMobileMenuToggle}
        />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      <TaskEditorModal
        isOpen={isTaskEditorOpen}
        onClose={handleTaskEditorClose}
        onTaskSaved={() => {
          setIsTaskEditorOpen(false);
          // You might want to refresh the current page's data here
        }}
      />
    </div>
  );
};

export default Layout;
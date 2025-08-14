import Header from './Header';
import Footer from './Footer';
import FloatingWhatsAppButton from './FloatingWhatsAppButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingWhatsAppButton />
    </div>
  );
};

export default Layout; 
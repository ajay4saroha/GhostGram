
import Navbar from "@/components/customized/Navbar";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function Layout({ children }: RootLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
        <Navbar />
        {children}
        </div>
    );
}

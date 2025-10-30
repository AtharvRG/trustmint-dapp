// src/components/layout/Footer.tsx
const Footer = () => {
    return (
        <footer className="bg-dark-secondary border-t border-border mt-12">
            <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
                <p className="text-text-secondary text-sm">
                    &copy; {new Date().getFullYear()} TrustMint. The Foundation of Freelance Trust.
                </p>
                <div className="flex space-x-4 mt-4 md:mt-0">
                    <a href="#" className="text-text-secondary hover:text-brand-primary transition-colors duration-200 text-sm">Privacy Policy</a>
                    <a href="#" className="text-text-secondary hover:text-brand-primary transition-colors duration-200 text-sm">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
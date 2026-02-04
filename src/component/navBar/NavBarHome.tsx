
import { useState } from 'react';
import {
    Award,
} from 'lucide-react';


export default function NavBarHome() {

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    return (
        <div>
            <nav className="bg-emerald-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">

                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Award className="w-8 h-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-800">
                            College Ranking Analytics
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
                        {["Home", "Features", "Metrics", "About"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="relative hover:text-blue-600 transition after:absolute after:left-0 after:-bottom-1  after:w-0 after:bg-blue-600 hover:after:w-full after:transition-all"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    {/* Mobile Button */}
                    <button
                        className="md:hidden text-2xl text-gray-700"
                        onClick={() => setIsMenuOpen(prev => !prev)}
                    >
                        ☰
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden px-4 pb-4 pt-2 space-y-2 bg-emerald-50 border-t border-emerald-100">
                        {["Home", "Features", "Metrics", "About"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="block py-2 px-2 rounded-md text-gray-700 hover:bg-emerald-100 hover:text-blue-600 transition"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                )}
            </nav>

        </div>
    )
}


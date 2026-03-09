
import {
    BarChart3,
    TrendingUp,
    Award,
    Sliders,
    GitCompare,
} from 'lucide-react';


export default function TopFive() {
    return (
        <div>
            <div className="relative">
                {/* Main Card with Rankings Preview */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">Top Ranked Colleges</h3>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>

                    <div className="space-y-4 mt-4">
                        {[
                            { rank: 1, name: "IIT Bombay", city: "Mumbai, MH", score: 98.5 },
                            { rank: 2, name: "IIT Delhi", city: "Delhi, DL", score: 97.2 },
                            { rank: 3, name: "IIT Madras", city: "Chennai, TN", score: 96.8 },
                            { rank: 4, name: "BITS Pilani", city: "Pilani, RJ", score: 95.4 },
                            { rank: 5, name: "IIT Kanpur", city: "Kanpur, UP", score: 94.9 }
                        ].map((college) => (
                            <div
                                key={college.rank}
                                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:shadow-md transition cursor-pointer group"
                            >
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                                    {college.rank}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
                                        {college.name}
                                    </div>
                                    <div className="text-sm text-gray-600">{college.city}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-blue-600 text-lg">{college.score}</div>
                                    <div className="text-xs text-gray-500">Score</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Small Metrics Preview */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <BarChart3 className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                                <div className="text-xs text-gray-600">Analytics</div>
                            </div>
                            <div className="text-center">
                                <Sliders className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                                <div className="text-xs text-gray-600">Customize</div>
                            </div>
                            <div className="text-center">
                                <GitCompare className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                                <div className="text-xs text-gray-600">Compare</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-purple-400 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>

                {/* Floating Badge */}
                <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-3 z-20 animate-bounce">
                    <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <div>
                            <div className="text-xs font-bold text-gray-900">500+ Colleges</div>
                            <div className="text-xs text-gray-600">Analyzed</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

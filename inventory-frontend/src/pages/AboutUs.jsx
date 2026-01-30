import React from "react";

export default function AboutUs() {
    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">About Inventory Pro</h1>
                    <p className="text-blue-100 text-lg">Streamlining your business operations</p>
                </div>

                <div className="p-10 space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Our Mission</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Inventory Pro is designed to help small and medium businesses manage their stock,
                            track orders, and analyze sales with ease. We believe in powerful, intuitive software
                            that saves you time and reduces errors.
                        </p>
                    </section>

                    <section className="grid md:grid-cols-3 gap-6">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-2">Real-time Tracking</h3>
                            <p className="text-sm text-slate-500">Monitor stock levels instantly across all product categories.</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-2">Detailed Reporting</h3>
                            <p className="text-sm text-slate-500">Gain insights into sales trends and revenue performance.</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-2">Secure & Reliable</h3>
                            <p className="text-sm text-slate-500">Built with modern tech stacks ensuring data safety and uptime.</p>
                        </div>
                    </section>

                    <footer className="text-center pt-8 border-t border-slate-100">
                        <p className="text-slate-500 text-sm">
                            © 2026 Inventory Pro Inc. All rights reserved. <br />
                            Version 1.0.0
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}

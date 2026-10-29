import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import ProblemSolution from '@/components/landing/ProblemSolution';
import HowItWorks from '@/components/landing/HowItWorks';
import ProductShowcase from '@/components/landing/ProductShowcase';
import AudienceValue from '@/components/landing/AudienceValue';
import TrustSecurity from '@/components/landing/TrustSecurity';
import Pricing from '@/components/landing/Pricing';
import Faq from '@/components/landing/Faq';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#07111F] text-[#F7FAFC] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ProblemSolution />
        <HowItWorks />
        <ProductShowcase />
        <AudienceValue />
        <TrustSecurity />
        <Pricing />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

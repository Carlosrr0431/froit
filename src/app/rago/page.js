'use client';

import RagoNavbar from '@/components/rago/RagoNavbar';
import RagoHero from '@/components/rago/RagoHero';
import RagoFeatures from '@/components/rago/RagoFeatures';
import RagoCTA from '@/components/rago/RagoCTA';
import RagoFooter from '@/components/rago/RagoFooter';

export default function RagoPage() {
  return (
    <>
      <RagoNavbar />
      <RagoHero />
      <RagoFeatures />
      <RagoCTA />
      <RagoFooter />
    </>
  );
}

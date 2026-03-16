'use client';

import RagoNavbar from '@/components/rago/RagoNavbar';
import BudgetChat from '@/components/rago/BudgetChat';

export default function PresupuestoPage() {
  return (
    <>
      <RagoNavbar />
      <div className="pt-[4.5rem]">
        <BudgetChat />
      </div>
    </>
  );
}

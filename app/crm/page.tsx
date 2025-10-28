import { Suspense } from "react";
import { CRMClient } from "@/components/crm/crm-client";
import { getCRMOverview } from "@/lib/crm-service";

async function CRMContent() {
  const data = await getCRMOverview();
  return <CRMClient initialData={data} />;
}

export default function CRMPage() {
  return (
    <Suspense fallback={<div className="px-6 py-12 text-sm text-gray-600">Cargando CRM...</div>}>
      {/* @ts-expect-error Async Server Component */}
      <CRMContent />
    </Suspense>
  );
}

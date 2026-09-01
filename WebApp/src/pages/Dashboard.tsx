import { useEffect, useState } from 'react';
import { useAuth } from '../components/Context/AuthContext';
import { useNotify } from '../components/Context/NotifyContext';
import ClinicalOverviewPanel from '../components/common/Citas/ClinicalOverviewPanel';

export default function Dashboard() {
  const { user } = useAuth();
  const { success } = useNotify();

  
  useEffect(() => {
    success({
      titulo: `¡Bienvenido, ${user?.username}!`,
      position: 'top-right',
    });
  }, [user?.username, success]);

  return (
    <div className="">
      <ClinicalOverviewPanel />
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import {type TreatmentMedication, TreatmentMedicationAPI } from '../../api/adminApi/treatmentMedicationAPI';

const TreatmentMedications: React.FC = () => {
  const [medications, setMedications] = useState<TreatmentMedication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const data = await TreatmentMedicationAPI.getAllMedications();
        setMedications(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch medications');
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Treatment Medications</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">No.</th>
              <th className="py-2 px-4 border-b text-left">Loại thuốc</th>
              <th className="py-2 px-4 border-b text-left">Tên</th>
              <th className="py-2 px-4 border-b text-left"> Mô tả</th>
            </tr>
          </thead>
          <tbody>
            {medications.map((medication, index) => (
              <tr key={medication.medicationId} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{index + 1}</td>
                <td className="py-2 px-4 border-b">{medication.drugType}</td>
                <td className="py-2 px-4 border-b">{medication.drugName}</td>
                <td className="py-2 px-4 border-b">{medication.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TreatmentMedications;
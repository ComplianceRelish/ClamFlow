import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Shell, AlertCircle } from 'lucide-react';
import { generateLotNumber } from '../utils/codeGenerators';
import type { RawMaterial } from '../types';

export function LotCreationPage() {
  const navigate = useNavigate();
  const { rawMaterials, createLot, assignRawMaterialsToLot } = useStore();
  const [selectedMaterials, setSelectedMaterials] = React.useState<string[]>([]);

  // Filter raw materials that haven't been assigned to a lot
  const unassignedMaterials = rawMaterials.filter(material => !material.lotId);

  const calculateTotalQuantity = (selectedIds: string[]): number => {
    return selectedIds.reduce((total, id) => {
      const material = rawMaterials.find(m => m.id === id);
      return total + (material?.quantity || 0);
    }, 0);
  };

  const handleCreateLot = () => {
    if (selectedMaterials.length === 0) return;

    const lotId = crypto.randomUUID();
    const totalQuantity = calculateTotalQuantity(selectedMaterials);
    
    // Create new lot with auto-generated lot number
    createLot({
      id: lotId,
      lotNumber: generateLotNumber(),
      createdAt: new Date().toISOString(),
      createdBy: 'current-user-id', // TODO: Get from auth context
      rawMaterialIds: selectedMaterials,
      status: 'active',
      totalQuantity
    });

    // Assign raw materials to the lot
    assignRawMaterialsToLot(lotId, selectedMaterials);
    
    // Navigate to processing page
    navigate('/processing');
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2 mb-6">
          <Shell className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-medium text-gray-900">Create New Lot</h2>
        </div>

        {unassignedMaterials.length === 0 ? (
          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  No Raw Materials Available
                </h3>
                <p className="mt-2 text-sm text-yellow-700">
                  All raw materials have been assigned to lots. Wait for new raw materials to be added by operators.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Available Raw Materials
              </h3>
              <div className="mt-2 space-y-2 max-h-96 overflow-y-auto border rounded-md p-4">
                {unassignedMaterials.map((material: RawMaterial) => (
                  <label key={material.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      value={material.id}
                      checked={selectedMaterials.includes(material.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMaterials([...selectedMaterials, material.id]);
                        } else {
                          setSelectedMaterials(selectedMaterials.filter(id => id !== material.id));
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Received: {new Date(material.receivedDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantity: {material.quantity}kg | Temperature: {material.temperature}°C
                      </p>
                      <p className="text-sm text-gray-500">
                        Quality Score: {material.qualityScore}/10
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {selectedMaterials.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700">Selected Materials Summary</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Total Quantity: {calculateTotalQuantity(selectedMaterials)}kg
                </p>
                <p className="text-sm text-gray-500">
                  Items Selected: {selectedMaterials.length}
                </p>
              </div>
            )}

            <button
              onClick={handleCreateLot}
              disabled={selectedMaterials.length === 0}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Create Lot
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
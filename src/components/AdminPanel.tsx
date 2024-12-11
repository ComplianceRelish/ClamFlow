import React from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../store';
import { Shell, AlertCircle } from 'lucide-react';
import type { User, Supplier } from '../types';
import { generateUserCode, generateSupplierCode } from '../utils/codeGenerators';
import { initializeDefaultGrades } from '../utils/firebase';

const USER_ROLES = [
  { value: 'operator', label: 'Operator' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'quality', label: 'Quality Control' },
  { value: 'management', label: 'Management' },
  { value: 'admin', label: 'Admin' }
];

export function AdminPanel() {
  const { addUser, addSupplier } = useStore();
  const { register: registerUser, handleSubmit: handleUserSubmit, reset: resetUser } = useForm<User>();
  const { register: registerSupplier, handleSubmit: handleSupplierSubmit, reset: resetSupplier } = useForm<Supplier>();
  const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const onUserSubmit = (data: User) => {
    const userCode = generateUserCode();
    addUser({ 
      ...data, 
      id: crypto.randomUUID(),
      code: userCode
    });
    resetUser();
  };

  const onSupplierSubmit = (data: Supplier) => {
    const supplierCode = generateSupplierCode();
    addSupplier({ 
      ...data, 
      id: crypto.randomUUID(),
      code: supplierCode
    });
    resetSupplier();
  };

  const handleInitializeGrades = async () => {
    try {
      await initializeDefaultGrades();
      setMessage({ type: 'success', text: 'Default grades initialized successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to initialize default grades' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {message && (
        <div className={`p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex">
            <AlertCircle className={`h-5 w-5 ${
              message.type === 'success' ? 'text-green-400' : 'text-red-400'
            } mr-2`} />
            <p>{message.text}</p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Shell className="h-6 w-6 text-indigo-600" />
            <h2 className="text-lg font-medium text-gray-900">System Setup</h2>
          </div>
          <button
            onClick={handleInitializeGrades}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Initialize Default Grades
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* User Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-2 mb-4">
            <Shell className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-medium text-gray-900">User Management</h2>
          </div>
          <form onSubmit={handleUserSubmit(onUserSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                {...registerUser('name', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...registerUser('email', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                {...registerUser('role', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Role</option>
                {USER_ROLES.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add User
            </button>
          </form>
        </div>

        {/* Supplier Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-2 mb-4">
            <Shell className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-medium text-gray-900">Supplier Management</h2>
          </div>
          <form onSubmit={handleSupplierSubmit(onSupplierSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                {...registerSupplier('name', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact</label>
              <input
                type="text"
                {...registerSupplier('contact', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Supplier
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
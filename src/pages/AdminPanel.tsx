import React from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../store';
import type { User, Supplier, ProductGrade } from '../types';

export function AdminPanel() {
  const { addUser, addSupplier, addProductGrade } = useStore();
  const { register: registerUser, handleSubmit: handleUserSubmit, reset: resetUser } = useForm<User>();
  const { register: registerSupplier, handleSubmit: handleSupplierSubmit, reset: resetSupplier } = useForm<Supplier>();
  const { register: registerGrade, handleSubmit: handleGradeSubmit, reset: resetGrade } = useForm<ProductGrade>();

  const onUserSubmit = (data: User) => {
    addUser({ ...data, id: crypto.randomUUID() });
    resetUser();
  };

  const onSupplierSubmit = (data: Supplier) => {
    addSupplier({ ...data, id: crypto.randomUUID() });
    resetSupplier();
  };

  const onGradeSubmit = (data: ProductGrade) => {
    addProductGrade({ ...data, id: crypto.randomUUID() });
    resetGrade();
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {/* User Management */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">User Management</h2>
        <form onSubmit={handleUserSubmit(onUserSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...registerUser('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...registerUser('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
              {...registerUser('role')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="operator">Operator</option>
              <option value="supervisor">Supervisor</option>
              <option value="quality">Quality Control</option>
              <option value="admin">Admin</option>
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
        <h2 className="text-lg font-medium text-gray-900 mb-4">Supplier Management</h2>
        <form onSubmit={handleSupplierSubmit(onSupplierSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...registerSupplier('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              {...registerSupplier('code')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <input
              type="text"
              {...registerSupplier('contact')}
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

      {/* Product Grade Management */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Product Grade Management</h2>
        <form onSubmit={handleGradeSubmit(onGradeSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...registerGrade('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              {...registerGrade('code')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              {...registerGrade('type')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="shell-on">Shell-On</option>
              <option value="meat">Meat</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Grade
          </button>
        </form>
      </div>
    </div>
  );
}
import React from 'react';
import { useStore } from '../store';
import { Users, Truck, Tag } from 'lucide-react';

const USER_ROLES = {
  operator: 'Operator',
  supervisor: 'Supervisor',
  quality: 'Quality Control',
  management: 'Management',
  admin: 'Admin'
};

export function AdminDashboard() {
  const { users, suppliers, productGrades } = useStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Users List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <h3 className="font-medium text-indigo-900">Active Users</h3>
          </div>
          <span className="text-sm text-indigo-600 font-medium">{users.length} Total</span>
        </div>
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {users.map(user => (
            <div key={user.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                  {user.contact && (
                    <p className="text-xs text-gray-500 mt-1">{user.contact}</p>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {USER_ROLES[user.role]}
                  </span>
                  <span className="text-xs text-gray-500">{user.code}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suppliers List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-emerald-600" />
            <h3 className="font-medium text-emerald-900">Active Suppliers</h3>
          </div>
          <span className="text-sm text-emerald-600 font-medium">{suppliers.length} Total</span>
        </div>
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {suppliers.map(supplier => (
            <div key={supplier.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">{supplier.name}</p>
                  <p className="text-xs text-gray-500">{supplier.contact}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  {supplier.code}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Grades List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-amber-600" />
            <h3 className="font-medium text-amber-900">Product Grades</h3>
          </div>
          <span className="text-sm text-amber-600 font-medium">{productGrades.length} Total</span>
        </div>
        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {productGrades.map(grade => (
            <div key={grade.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{grade.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{grade.type}</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  {grade.code}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{grade.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
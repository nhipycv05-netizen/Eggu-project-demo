'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

interface Store {
  id: string;
  name_vi: string;
  name_en: string;
  address_vi: string;
  address_en: string;
  phone: string;
  opening_hours_vi: string;
  opening_hours_en: string;
  google_maps_url: string | null;
  is_active: boolean;
}

export default function StoresTab() {
  const supabase = createClient();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [nameVi, setNameVi] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [addressVi, setAddressVi] = useState('');
  const [addressEn, setAddressEn] = useState('');
  const [phone, setPhone] = useState('');
  const [openingHoursVi, setOpeningHoursVi] = useState('');
  const [openingHoursEn, setOpeningHoursEn] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const fetchStores = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*');

      if (error) throw error;
      setTimeout(() => {
        setStores(data || []);
        setLoading(false);
      }, 0);
    } catch (err) {
      console.error('Error fetching stores:', err);
      setTimeout(() => setLoading(false), 0);
    }
  }, [supabase]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleEditClick = (store: Store) => {
    setEditingStore(store);
    setNameVi(store.name_vi);
    setNameEn(store.name_en);
    setAddressVi(store.address_vi);
    setAddressEn(store.address_en);
    setPhone(store.phone);
    setOpeningHoursVi(store.opening_hours_vi);
    setOpeningHoursEn(store.opening_hours_en);
    setGoogleMapsUrl(store.google_maps_url || '');
    setIsActive(store.is_active);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingStore(null);
    setNameVi('');
    setNameEn('');
    setAddressVi('');
    setAddressEn('');
    setPhone('');
    setOpeningHoursVi('07:00 - 22:00');
    setOpeningHoursEn('07:00 - 22:00');
    setGoogleMapsUrl('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name_vi: nameVi,
      name_en: nameEn,
      address_vi: addressVi,
      address_en: addressEn,
      phone,
      opening_hours_vi: openingHoursVi,
      opening_hours_en: openingHoursEn,
      google_maps_url: googleMapsUrl || null,
      is_active: isActive,
    };

    try {
      if (editingStore) {
        const { error } = await supabase
          .from('stores')
          .update(payload)
          .eq('id', editingStore.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('stores').insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      await fetchStores();
    } catch (err) {
      console.error('Error saving store details:', err);
      alert('Failed to save store branch details');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async (id: string) => {
    if (!confirm('Are you sure you want to delete this store branch location?')) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('stores').delete().eq('id', id);
      if (error) throw error;
      await fetchStores();
    } catch (err) {
      console.error('Error deleting store branch:', err);
      alert('Failed to delete store');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1E1B18]">Stores & Branches</h2>
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Manage your physical shop locations, hotlines, and maps
          </p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="px-4 py-2 bg-[#EAAA08] text-[#1E1B18] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#EAAA08]/90 transition flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>Add New Store</span>
        </button>
      </div>

      {loading && stores.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#EAAA08] animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Branch Name</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Hours</th>
                  <th className="p-4">Active</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-400 font-bold">
                      No branches found.
                    </td>
                  </tr>
                ) : (
                  stores.map((store) => (
                    <tr key={store.id} className="hover:bg-neutral-50/50 transition">
                      <td className="p-4 space-y-0.5">
                        <p className="font-extrabold text-neutral-900">{store.name_en}</p>
                        <p className="text-[10px] text-neutral-400">{store.name_vi}</p>
                      </td>
                      <td className="p-4 max-w-xs truncate text-neutral-500 font-medium">
                        {store.address_en}
                      </td>
                      <td className="p-4 font-bold text-neutral-900">{store.phone}</td>
                      <td className="p-4 font-bold text-neutral-900">{store.opening_hours_en}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            store.is_active
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                          }`}
                        >
                          {store.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleEditClick(store)}
                          className="p-2 hover:bg-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-900 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStore(store.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#1E1B18]/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white border border-neutral-200 p-8 rounded-3xl w-full max-w-lg shadow-xl max-h-[85vh] overflow-y-auto space-y-6">
            <h3 className="text-xl font-black text-neutral-900">
              {editingStore ? 'Edit Store Branch Location' : 'Add New Branch Location'}
            </h3>

            <form onSubmit={handleSaveStore} className="space-y-4 text-xs font-semibold text-neutral-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Branch Name (EN)</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Branch Name (VI)</label>
                  <input
                    type="text"
                    required
                    value={nameVi}
                    onChange={(e) => setNameVi(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Address (EN)</label>
                <input
                  type="text"
                  required
                  value={addressEn}
                  onChange={(e) => setAddressEn(e.target.value)}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Address (VI)</label>
                <input
                  type="text"
                  required
                  value={addressVi}
                  onChange={(e) => setAddressVi(e.target.value)}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Hotline Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Maps Coordinates URL</label>
                  <input
                    type="text"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Hours (EN)</label>
                  <input
                    type="text"
                    required
                    value={openingHoursEn}
                    onChange={(e) => setOpeningHoursEn(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Hours (VI)</label>
                  <input
                    type="text"
                    required
                    value={openingHoursVi}
                    onChange={(e) => setOpeningHoursVi(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-neutral-300 text-[#EAAA08] focus:ring-[#EAAA08] w-4 h-4"
                  />
                  <span>Active Location</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-neutral-200 text-neutral-700 font-bold uppercase rounded-xl hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#EAAA08] text-[#1E1B18] font-bold uppercase rounded-xl hover:bg-[#EAAA08]/90 transition"
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

interface Faq {
  id: string;
  category: string;
  question_vi: string;
  question_en: string;
  answer_vi: string;
  answer_en: string;
  is_active: boolean;
  sort_order: number;
}

export default function FaqsTab() {
  const supabase = createClient();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [category, setCategory] = useState('');
  const [questionVi, setQuestionVi] = useState('');
  const [questionEn, setQuestionEn] = useState('');
  const [answerVi, setAnswerVi] = useState('');
  const [answerEn, setAnswerEn] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const fetchFaqs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('category', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTimeout(() => {
        setFaqs(data || []);
        setLoading(false);
      }, 0);
    } catch (err) {
      console.error('Error fetching FAQs:', err);
      setTimeout(() => setLoading(false), 0);
    }
  }, [supabase]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleEditClick = (faq: Faq) => {
    setEditingFaq(faq);
    setCategory(faq.category);
    setQuestionVi(faq.question_vi);
    setQuestionEn(faq.question_en);
    setAnswerVi(faq.answer_vi);
    setAnswerEn(faq.answer_en);
    setIsActive(faq.is_active);
    setSortOrder(faq.sort_order);
    setIsModalOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingFaq(null);
    setCategory('Ordering');
    setQuestionVi('');
    setQuestionEn('');
    setAnswerVi('');
    setAnswerEn('');
    setIsActive(true);
    setSortOrder(0);
    setIsModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      category,
      question_vi: questionVi,
      question_en: questionEn,
      answer_vi: answerVi,
      answer_en: answerEn,
      is_active: isActive,
      sort_order: Number(sortOrder),
    };

    try {
      if (editingFaq) {
        const { error } = await supabase
          .from('faqs')
          .update(payload)
          .eq('id', editingFaq.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('faqs').insert(payload);
        if (error) throw error;
      }

      setIsModalOpen(false);
      await fetchFaqs();
    } catch (err) {
      console.error('Error saving FAQ details:', err);
      alert('Failed to save FAQ entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ entry?')) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
      await fetchFaqs();
    } catch (err) {
      console.error('Error deleting FAQ:', err);
      alert('Failed to delete FAQ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-[#1E1B18]">FAQs Management</h2>
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Edit Q&A details displayed in the help panel
          </p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="px-4 py-2 bg-[#EAAA08] text-[#1E1B18] font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#EAAA08]/90 transition flex items-center space-x-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[3px]" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {loading && faqs.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-[#EAAA08] animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="p-4">Category</th>
                  <th className="p-4">Question (English)</th>
                  <th className="p-4">Question (Vietnamese)</th>
                  <th className="p-4">Sort Order</th>
                  <th className="p-4">Active</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-semibold text-neutral-700">
                {faqs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-neutral-400 font-bold">
                      No FAQ entries found.
                    </td>
                  </tr>
                ) : (
                  faqs.map((faq) => (
                    <tr key={faq.id} className="hover:bg-neutral-50/50 transition">
                      <td className="p-4 text-neutral-500 font-bold">{faq.category}</td>
                      <td className="p-4 font-extrabold text-neutral-900 max-w-xs truncate">{faq.question_en}</td>
                      <td className="p-4 font-bold text-neutral-800 max-w-xs truncate">{faq.question_vi}</td>
                      <td className="p-4 text-neutral-900 font-bold">{faq.sort_order}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            faq.is_active
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : 'bg-neutral-100 text-neutral-800 border border-neutral-200'
                          }`}
                        >
                          {faq.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleEditClick(faq)}
                          className="p-2 hover:bg-neutral-200 rounded-lg text-neutral-500 hover:text-neutral-900 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFaq(faq.id)}
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
              {editingFaq ? 'Edit FAQ Details' : 'Add New FAQ Entry'}
            </h3>

            <form onSubmit={handleSaveFaq} className="space-y-4 text-xs font-semibold text-neutral-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:border-[#EAAA08] font-bold"
                  >
                    <option value="Ordering">Ordering</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Payment">Payment</option>
                    <option value="Products">Products</option>
                    <option value="Store">Store</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-neutral-400 font-black block">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Question (EN)</label>
                <input
                  type="text"
                  required
                  value={questionEn}
                  onChange={(e) => setQuestionEn(e.target.value)}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Question (VI)</label>
                <input
                  type="text"
                  required
                  value={questionVi}
                  onChange={(e) => setQuestionVi(e.target.value)}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Answer (EN)</label>
                <textarea
                  required
                  value={answerEn}
                  onChange={(e) => setAnswerEn(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase text-neutral-400 font-black block">Answer (VI)</label>
                <textarea
                  required
                  value={answerVi}
                  onChange={(e) => setAnswerVi(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#EAAA08] resize-none"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-neutral-300 text-[#EAAA08] focus:ring-[#EAAA08] w-4 h-4"
                  />
                  <span>Active FAQ Entry</span>
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
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

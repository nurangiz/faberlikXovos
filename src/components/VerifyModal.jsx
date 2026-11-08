import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Search, X, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import { api } from '../services/api';

export default function VerifyModal({ isOpen, onClose, initialCertId = '' }) {
  const dialogRef = useRef(null);
  const [certId, setCertId] = useState(initialCertId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialCertId) setCertId(initialCertId);
  }, [initialCertId]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      if (initialCertId) handleVerify(initialCertId);
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen, initialCertId]);

  // Modern light-dismiss
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    let pressedOutside = false;
    const isOutside = (e) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    const handlePointerDown = (e) => {
      pressedOutside = isOutside(e);
    };

    const handlePointerUp = (e) => {
      if (pressedOutside && isOutside(e)) {
        onClose();
      }
    };

    const handleClose = () => {
      dialog.returnValue = '';
      onClose();
    };

    dialog.addEventListener('pointerdown', handlePointerDown);
    dialog.addEventListener('pointerup', handlePointerUp);
    dialog.addEventListener('close', handleClose);

    return () => {
      dialog.removeEventListener('pointerdown', handlePointerDown);
      dialog.removeEventListener('pointerup', handlePointerUp);
      dialog.removeEventListener('close', handleClose);
    };
  }, [onClose]);

  const handleVerify = async (idToVerify) => {
    const id = idToVerify || certId;
    if (!id.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await api.verifyCertificate(id.trim());
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="verify-dialog-title"
      className="p-0 rounded-3xl shadow-2xl max-w-lg w-full bg-white border border-rose-100 text-slate-800 backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg shadow-sm">
              <ShieldCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 id="verify-dialog-title" className="font-serif font-black text-xl text-slate-900">
                Sertifikatni Haqiqiyligini Tekshirish
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Rasmiy Davlat & Akademiya Bazasi
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-faberlic-700 flex items-center justify-center text-slate-500 transition"
            aria-label="Yopish"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search input */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Sertifikat Seriya Raqami:
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Masalan: FL-UZ-2026-0001"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-faberlic-600"
            />
            <button
              onClick={() => handleVerify()}
              disabled={loading || !certId.trim()}
              className="px-5 py-3 rounded-2xl bg-faberlic-700 hover:bg-faberlic-800 text-white font-bold text-xs sm:text-sm shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? "..." : "Tekshirish"}</span>
            </button>
          </div>
        </div>

        {/* Verification Result */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Tekshiruv Natijasi:</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {result && result.certificate && (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Sertifikat Rasmiy Tasdiqlangan va Haqiqiy!</span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Egasi:</span>
                <span className="font-bold text-slate-900">{result.certificate.user_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Unvoni:</span>
                <span className="font-semibold text-amber-800">{result.certificate.course_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hududi:</span>
                <span className="font-semibold text-slate-800">{result.certificate.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Imtihon Bali:</span>
                <span className="font-bold text-emerald-700">{result.certificate.score}% (A'lo)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Berilgan Sana:</span>
                <span className="font-medium text-slate-700">{result.certificate.issue_date}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">Seriya ID:</span>
                <span className="font-mono font-bold text-faberlic-700">{result.certificate.certificate_id}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </dialog>
  );
}

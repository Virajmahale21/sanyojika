import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import { Institution } from '../types';
import { Card } from '../components/ui/Card';
import { Building2, Search, RefreshCw, CheckCircle2 } from 'lucide-react';

export const InstitutionsList: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const res = await api.getInstitutions({ search, category: categoryFilter });
      if (res.success) {
        setInstitutions(res.data);
      }
    } catch (err) {
      console.error('Failed to load institutions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, [categoryFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInstitutions();
  };

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-gov-navy">{t('institutions.title')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {t('institutions.subtitle')}
        </p>
      </div>

      {/* Filter Card */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('institutions.searchPlaceholder')}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-gov-blue focus:outline-none"
            />
          </div>

          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-1.5 px-3 border border-slate-300 rounded bg-white"
            >
              <option value="ALL">{t('institutions.allDisciplines')}</option>
              <option value="ENGINEERING">{t('institutions.progEngg', 'Engineering & Technology')}</option>
              <option value="MANAGEMENT">{t('institutions.progManagement')}</option>
              <option value="PHARMACY">{t('institutions.progPharmacy')}</option>
            </select>
          </div>
        </form>
      </Card>

      {/* Institutions Table */}
      <Card>
        {loading ? (
          <div className="py-12 flex items-center justify-center space-x-2 text-xs text-slate-500">
            <RefreshCw className="w-4 h-4 animate-spin text-gov-blue" />
            <span>{t('institutions.loading')}</span>
          </div>
        ) : institutions.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">{t('institutions.empty')}</div>
        ) : (
          <div className="overflow-x-auto -mx-5 -my-5">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <th className="p-3 font-semibold">{t('institutions.tablePid')}</th>
                  <th className="p-3 font-semibold">{t('institutions.tableInstName')}</th>
                  <th className="p-3 font-semibold">{t('institutions.tableCategory')}</th>
                  <th className="p-3 font-semibold">{t('institutions.tableLocation')}</th>
                  <th className="p-3 font-semibold">{t('institutions.tableUniversity')}</th>
                  <th className="p-3 font-semibold">{t('institutions.tableAccreditation')}</th>
                  <th className="p-3 font-semibold">{t('institutions.tableEstYear')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {institutions.map((inst) => {
                  const instName =
                    language === 'hi' && inst.nameHi
                      ? inst.nameHi
                      : language === 'mr' && inst.nameMr
                      ? inst.nameMr
                      : inst.name;

                  return (
                    <tr key={inst.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 font-mono font-bold text-gov-navy">{inst.permanentId}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{instName}</div>
                        <div className="text-[11px] text-slate-500">{inst.officialEmail}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-700">{inst.category}</span>
                        <div className="text-[10px] text-slate-500">{inst.institutionType.replace('_', ' ')}</div>
                      </td>
                      <td className="p-3 text-slate-700">
                        <div>
                          {inst.city}, {inst.state}
                        </div>
                        <div className="text-[10px] text-gov-blue font-semibold">{inst.region?.name}</div>
                      </td>
                      <td className="p-3 text-slate-600">{inst.affiliatingUniv}</td>
                      <td className="p-3">
                        <div className="flex items-center space-x-1">
                          <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-bold border border-emerald-200">
                            NAAC: {inst.naacAccreditation || 'NA'}
                          </span>
                          {inst.nbaAccredited && (
                            <span className="bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-200">
                              NBA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 font-mono text-slate-700">{inst.establishmentYear}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

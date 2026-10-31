import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Download } from 'lucide-react';
import { StructuredVisit } from '../../types';

const LANGUAGE_DATA = [
  { name: 'Marathi (मराठी)', value: 72, color: '#087F8C' },
  { name: 'Hindi (हिन्दी)', value: 28, color: '#15966A' }
];

const ENCOUNTER_TYPES = [
  { type: 'Antenatal Care (ANC)', count: 28 },
  { type: 'Postnatal Care (PNC)', count: 14 },
  { type: 'Child Immunization', count: 12 },
  { type: 'Family Planning', count: 6 }
];

const FIELD_EXTRACTION_ACCURACY = [
  { field: 'Blood Pressure', extracted: 98, missing: 2 },
  { field: 'Maternal Weight', extracted: 95, missing: 5 },
  { field: 'Gestational Weeks', extracted: 92, missing: 8 },
  { field: 'Hemoglobin (Hb)', extracted: 89, missing: 11 },
  { field: 'Fetal Movements', extracted: 96, missing: 4 },
  { field: 'Danger Signs', extracted: 100, missing: 0 }
];

interface ReportsAnalyticsViewProps {
  records: StructuredVisit[];
}

export const ReportsAnalyticsView: React.FC<ReportsAnalyticsViewProps> = ({ records }) => {
  const [dateFilter, setDateFilter] = useState('month');

  const handleExportCSV = () => {
    const headers = [
      "Record_ID",
      "Beneficiary_Name",
      "Beneficiary_ID",
      "ASHA_Worker",
      "Language",
      "Encounter_Date",
      "BP_Systolic",
      "BP_Diastolic",
      "Weight_kg",
      "Hb_g_dl",
      "Gestational_Weeks",
      "Review_Status"
    ];

    const rows = records.map(r => [
      r.recordId,
      `"${r.beneficiaryName}"`,
      r.beneficiaryId,
      `"${r.ashaName}"`,
      r.language,
      r.recordedAt.slice(0, 10),
      r.measurements.bloodPressureSystolic.value || '',
      r.measurements.bloodPressureDiastolic.value || '',
      r.measurements.weightKg.value || '',
      r.measurements.hemoglobinGDl.value || '',
      r.pregnancyDetails.gestationalAgeWeeks.value || '',
      r.anmReviewStatus
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ASHA_Visit_Records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E4ECEC] shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-[#172B3A]">Health Indicators & Documentation Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Voice documentation completeness, language distribution, and maternal health indicators across primary health centers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-[#087F8C]"
          >
            <option value="week">This Week</option>
            <option value="month">October 2026 (Monthly)</option>
            <option value="quarter">Q3 Pilot</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-[#087F8C] hover:bg-teal-700 text-white rounded-xl font-semibold text-xs flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export CSV ({records.length})
          </button>
        </div>
      </div>

      {/* Grid of Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Language Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-[#E4ECEC] shadow-xs">
          <h3 className="text-sm font-bold text-[#172B3A] mb-1">Spoken Language Distribution</h3>
          <p className="text-xs text-slate-500 mb-4">ASHA worker spoken dialect in Pune & Nashik field visits</p>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={LANGUAGE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {LANGUAGE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visit Types */}
        <div className="bg-white p-6 rounded-2xl border border-[#E4ECEC] shadow-xs">
          <h3 className="text-sm font-bold text-[#172B3A] mb-1">Encounter Classifications</h3>
          <p className="text-xs text-slate-500 mb-4">Breakdown of maternal & child healthcare visit types</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ENCOUNTER_TYPES} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" fontSize={11} stroke="#94A3B8" />
                <YAxis dataKey="type" type="category" fontSize={11} stroke="#94A3B8" width={120} />
                <Tooltip />
                <Bar dataKey="count" fill="#15966A" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Field Extraction Accuracy & Completeness */}
      <div className="bg-white p-6 rounded-2xl border border-[#E4ECEC] shadow-xs">
        <h3 className="text-sm font-bold text-[#172B3A] mb-1">Clinical Field Extraction Completeness (%)</h3>
        <p className="text-xs text-slate-500 mb-4">
          Percentage of voice notes where vital parameters were successfully extracted vs. prompted as missing
        </p>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FIELD_EXTRACTION_ACCURACY} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="field" fontSize={11} stroke="#94A3B8" />
              <YAxis domain={[0, 100]} fontSize={11} stroke="#94A3B8" />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="extracted" name="Extracted with Evidence (%)" fill="#087F8C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="missing" name="Flagged Missing (%)" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

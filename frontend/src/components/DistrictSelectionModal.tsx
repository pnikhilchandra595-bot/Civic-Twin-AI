import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Search, Filter, Globe, Activity, 
  ShieldAlert, Waves, Compass, X, Check, ArrowRight, Layers 
} from 'lucide-react';
import { apiService } from '../services/api';
import { ALL_INDIAN_DISTRICTS, DistrictItem } from '../data/allIndianDistricts';

import { AuthUser } from './LoginPage';

interface DistrictSelectionModalProps {
  currentCityName?: string;
  authUser?: AuthUser | null;
  onSelectDistrict: (query: string, lat: number, lng: number) => void;
  onClose: () => void;
}

export const DistrictSelectionModal: React.FC<DistrictSelectionModalProps> = ({
  currentCityName,
  authUser,
  onSelectDistrict,
  onClose
}) => {
  const isNational = !authUser || authUser.userType === 'national_authority';
  const isStateOfficer = authUser?.userType === 'state_officer';
  const isDistrictOfficer = authUser?.userType === 'district_officer';
  const assignedState = authUser?.assignedState || '';
  const assignedDistrict = authUser?.assignedDistrict || '';

  const [districts, setDistricts] = useState<DistrictItem[]>(ALL_INDIAN_DISTRICTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>(() => {
    if (isStateOfficer && assignedState) return assignedState;
    return 'ALL';
  });
  const [threatFilter, setThreatFilter] = useState<'ALL' | 'CRITICAL' | 'ELEVATED' | 'MONITOR'>('ALL');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const data = await apiService.searchDistricts('');
        if (data && data.length > 0) {
          setDistricts(data as DistrictItem[]);
        }
      } catch (e) {
        console.warn('Using bundled Pan-India district dataset:', e);
      }
    };
    fetchDistricts();
  }, []);

  const allStates = useMemo(() => {
    if (isStateOfficer && assignedState) return [assignedState];
    if (isDistrictOfficer && assignedState) return [assignedState];
    const stateSet = new Set<string>();
    districts.forEach(d => {
      if (d.state) stateSet.add(d.state);
    });
    return Array.from(stateSet).sort();
  }, [districts, isStateOfficer, isDistrictOfficer, assignedState]);

  const filteredDistricts = useMemo(() => {
    return districts.filter(d => {
      // Role enforcement: District officer sees only assigned district
      if (isDistrictOfficer && assignedDistrict) {
        const dName = d.name.toLowerCase();
        const aName = assignedDistrict.toLowerCase().split(' ')[0];
        if (!dName.includes(aName)) return false;
      }
      // Role enforcement: State officer strictly sees only their state districts
      else if (isStateOfficer && assignedState && d.state.toLowerCase() !== assignedState.toLowerCase()) {
        return false;
      }

      const matchesSearch = 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.basin.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesState = (isStateOfficer || isDistrictOfficer)
        ? d.state.toLowerCase() === assignedState.toLowerCase()
        : selectedState === 'ALL' || d.state === selectedState;

      const matchesThreat = threatFilter === 'ALL' || (d.threat && d.threat === threatFilter);

      return matchesSearch && matchesState && matchesThreat;
    });
  }, [districts, searchQuery, selectedState, threatFilter, isStateOfficer, isDistrictOfficer, assignedState, assignedDistrict]);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 select-none font-sans overflow-y-auto">
      <div className="hud-panel w-full max-w-5xl rounded-3xl border border-cyan-500/40 bg-[#060a14] text-slate-100 shadow-[0_0_90px_rgba(0,210,255,0.25)] overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-cyan-500/20 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 text-cyan-300 shadow-[0_0_20px_rgba(0,210,255,0.3)]">
              <Globe className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-white uppercase tracking-wider">
                  {isDistrictOfficer
                    ? `${assignedDistrict} DDMA Municipal Triage`
                    : isStateOfficer
                    ? `${assignedState} SDMA District Atlas`
                    : 'Pan-India 780+ Districts Atlas & Digital Twin Ingestion'}
                </h2>
                {isDistrictOfficer ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-400 text-[10px] font-mono text-amber-200 font-bold flex items-center space-x-1">
                    <span>🔒 {assignedDistrict} DDMA ONLY</span>
                  </span>
                ) : isStateOfficer ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-400 text-[10px] font-mono text-purple-200 font-bold flex items-center space-x-1">
                    <span>🔒 {assignedState} SDMA ONLY ({filteredDistricts.length} Districts)</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-[10px] font-mono text-cyan-300 font-bold">
                    {districts.length} DISTRICTS REGISTERED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {isDistrictOfficer
                  ? `Authorized District DDMA view: Monitoring localized drainage basins, ward triage & pumps for ${assignedDistrict}.`
                  : isStateOfficer
                  ? `Authorized State SDMA view: Ingesting local catchment basins, river gates & infrastructure for ${assignedState}. Other states are restricted.`
                  : 'Every district, river basin, dam sluice gate, and micro-catchment across all 28 States & 8 Union Territories of India.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isStateOfficer ? `Search any district or landmark in ${assignedState}...` : "Search any district, river basin, or landmark across India..."}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>

            {/* State Filter Dropdown */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs font-mono text-slate-400 shrink-0">State:</span>
              <select
                value={selectedState}
                disabled={isStateOfficer}
                onChange={(e) => setSelectedState(e.target.value)}
                className={`px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none w-full sm:w-auto ${
                  isStateOfficer
                    ? 'bg-purple-950/80 border-purple-500 text-purple-200 cursor-not-allowed font-bold'
                    : 'bg-slate-900 border-slate-700 text-cyan-300 focus:border-cyan-400 cursor-pointer'
                }`}
              >
                {isStateOfficer ? (
                  <option value={assignedState}>🔒 {assignedState} (SDMA Jurisdiction)</option>
                ) : (
                  <>
                    <option value="ALL">All 36 States & UTs</option>
                    {allStates.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Threat Level Filter Pills */}
            <div className="flex items-center space-x-1.5 shrink-0">
              {(['ALL', 'CRITICAL', 'ELEVATED', 'MONITOR'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setThreatFilter(t)}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    threatFilter === t
                      ? t === 'CRITICAL'
                        ? 'bg-red-600 text-white shadow-lg'
                        : t === 'ELEVATED'
                        ? 'bg-amber-600 text-white shadow-lg'
                        : t === 'MONITOR'
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-cyan-600 text-white shadow-lg'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* District Grid Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-cyan-300">Loading Pan-India 780+ District Registry...</p>
            </div>
          ) : filteredDistricts.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <MapPin className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-sm font-mono text-slate-400">No districts match "{searchQuery}"</p>
              <p className="text-xs text-slate-500">Try searching for state names, major rivers, or clearing filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDistricts.map(d => {
                const isSelected = currentCityName?.toLowerCase().includes(d.name.toLowerCase());
                const threatColor = d.threat === 'CRITICAL' 
                  ? 'border-red-500/50 bg-red-950/20 text-red-300' 
                  : d.threat === 'ELEVATED'
                  ? 'border-amber-500/50 bg-amber-950/20 text-amber-300'
                  : 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300';

                return (
                  <div
                    key={d.id}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-2.5 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(0,210,255,0.2)]'
                        : 'border-slate-800 bg-[#090e1c] hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-xs font-black text-white tracking-wide">
                            {d.name}
                          </div>
                          <div className="text-[11px] font-mono text-cyan-400 font-bold">
                            {d.state}
                          </div>
                        </div>

                        {d.threat && (
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-black uppercase border ${threatColor}`}>
                            {d.threat}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 mt-2">
                        <Waves className="w-3 h-3 text-cyan-500 shrink-0" />
                        <span className="truncate">{d.basin}</span>
                      </div>

                      <div className="text-[10px] font-mono text-slate-500 mt-1">
                        GPS: {d.lat.toFixed(4)}°N, {d.lng.toFixed(4)}°E
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectDistrict(d.name, d.lat, d.lng);
                        onClose();
                      }}
                      className={`w-full py-2 rounded-xl font-mono text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500 text-black shadow-lg'
                          : 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 hover:text-white'
                      }`}
                    >
                      <span>{isSelected ? 'Currently Loaded' : 'Synthesize Digital Twin'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            Showing <strong className="text-white">{filteredDistricts.length}</strong> of <strong className="text-white">{districts.length}</strong> Indian Districts
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold cursor-pointer"
          >
            Close Atlas
          </button>
        </div>

      </div>
    </div>
  );
};

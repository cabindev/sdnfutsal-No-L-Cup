// app/common/TambonSearch.tsx
'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Search, MapPin, X } from 'lucide-react';
import { LocationData } from '../types/coach';
import { data as regionsData } from '@/app/data/regions'; // นำเข้าข้อมูลตำบลจากไฟล์

interface TambonSearchProps {
 onSelectLocation: (location: LocationData) => void;
 initialLocation?: LocationData;
}

export default function TambonSearch({ onSelectLocation, initialLocation }: TambonSearchProps) {
 const [searchQuery, setSearchQuery] = useState('');
 const [debouncedQuery] = useDebounce(searchQuery, 300);
 const [isLoading, setIsLoading] = useState(false);
 const [results, setResults] = useState<LocationData[]>([]);
 const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
   initialLocation || null
 );

 // ค้นหาเมื่อ query เปลี่ยน
 useEffect(() => {
   if (!debouncedQuery.trim()) {
     setResults([]);
     setIsDropdownOpen(false);
     return;
   }

   setIsLoading(true);
   
   try {
     const query = debouncedQuery.toLowerCase();
     
     // กรองข้อมูลตามคำค้นหา
     const filteredData = regionsData.filter(
       item => 
         item.district.toLowerCase().includes(query) ||
         item.amphoe.toLowerCase().includes(query) || 
         item.province.toLowerCase().includes(query)
     );
     
     // แปลงข้อมูลให้เข้ากับรูปแบบ LocationData
     const locationResults = filteredData.map(item => ({
       district: item.district,
       amphoe: item.amphoe,
       province: item.province,
       zone: item.zone, // ใช้ zone โดยตรงจากข้อมูล
       geocode: item.district_code.toString(), // แปลงเป็น string เพื่อให้ตรงกับ LocationData
       lat: 0, // ถ้ามีข้อมูลละติจูด ลองจิจูด ให้เพิ่มที่นี่
       lng: 0
     }));
     
     // จำกัดผลลัพธ์ไม่เกิน 10 รายการ
     setResults(locationResults.slice(0, 10));
     setIsDropdownOpen(locationResults.length > 0);
   } catch (error) {
     console.error('Error searching tambons:', error);
   } finally {
     setIsLoading(false);
   }
 }, [debouncedQuery]);

 const handleSelectLocation = (location: LocationData) => {
   setSelectedLocation(location);
   setSearchQuery('');
   setIsDropdownOpen(false);
   onSelectLocation(location);
 };

 const handleClearSelection = () => {
   setSelectedLocation(null);
   setSearchQuery('');
 };

 return (
   <div className="relative">
     <div className="relative">
       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
         <Search className="h-5 w-5 text-gray-400" />
       </div>
       
       <input
         type="text"
         className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
         placeholder="ค้นหาตำบล อำเภอ หรือจังหวัด..."
         value={searchQuery}
         onChange={(e) => setSearchQuery(e.target.value)}
         onFocus={() => {
           if (debouncedQuery && results.length > 0) {
             setIsDropdownOpen(true);
           }
         }}
         disabled={!!selectedLocation}
       />
       
       {isLoading && (
         <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
           <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full"></div>
         </div>
       )}
       
       {selectedLocation && (
         <button
           type="button"
           onClick={handleClearSelection}
           className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
         >
           <X className="h-5 w-5" />
         </button>
       )}
     </div>
     
     {/* แสดงข้อมูลตำบลที่เลือก */}
     {selectedLocation && (
       <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-100">
         <div className="flex items-start">
           <MapPin className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
           <div>
             <p className="text-sm font-medium text-gray-900">
               ตำบล{selectedLocation.district} อำเภอ{selectedLocation.amphoe} จังหวัด{selectedLocation.province}
             </p>
             {selectedLocation.zone && (
               <p className="text-xs text-gray-600">
                 ภูมิภาค: {selectedLocation.zone}
               </p>
             )}
           </div>
         </div>
       </div>
     )}
     
     {/* Dropdown แสดงผลลัพธ์การค้นหา */}
     {isDropdownOpen && (
       <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
         {results.length > 0 ? (
           <ul className="py-1">
             {results.map((result, index) => (
               <li 
                 key={`${result.district}-${result.amphoe}-${result.province}-${index}`}
                 className="cursor-pointer hover:bg-orange-50 px-4 py-2"
                 onClick={() => handleSelectLocation(result)}
               >
                 <div className="flex items-start">
                   <MapPin className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                   <div>
                     <p className="text-sm font-medium">
                       ตำบล{result.district} อำเภอ{result.amphoe}
                     </p>
                     <p className="text-xs text-gray-600">
                       จังหวัด{result.province}
                       {result.zone && ` (${result.zone})`}
                     </p>
                   </div>
                 </div>
               </li>
             ))}
           </ul>
         ) : (
           <div className="px-4 py-2 text-sm text-gray-500">ไม่พบผลลัพธ์</div>
         )}
       </div>
     )}
     
     <p className="mt-2 text-xs text-gray-500">
       {!selectedLocation ? 'กรุณาค้นหาและเลือกตำบลที่ต้องการ' : 'คุณสามารถเปลี่ยนตำบลได้โดยการกดที่ปุ่ม X'}
     </p>
   </div>
 );
}
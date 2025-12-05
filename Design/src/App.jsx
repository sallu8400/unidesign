// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import './App.css'; // Make sure this file exists with styles
// import InfiniteScroll from "react-infinite-scroll-component"; 

// function App() {
//   const [activeTab, setActiveTab] = useState('1');

//   // --- Form Data State ---
//   const [formData, setFormData] = useState({
//     DmTcTyp: "", DmSz: "", DmCtg: "", DmUom: "", DmDesc: "", DmLockYN: "N", DmValidCoCd: "",
//     DmPrdCtg: "", DmSalCtg: "", DmSalCtg2: "", DmSalCtg3: "", DmLsCtg: "", DmKt: "", DmVaCtg: "",
//     DmSetCd: "", DmOldCd: "", DmBagPcs: 0, DmParts: 0, DmPartDesc: "", DmCol: "",
//     DmHld: "N", DmHldDesc: "", DmDefSz: "", DmPrdInst: "", DmPrcsSeq: "", DmPrdSeq: "", DmDsgBy: "", 
//     DmCreatedDt: "", DmPrfVendCd: "", ModUsr: "", ModDt: "", DmDsgDt: "", DmSrcDsgCd: "",
//     DmModMkr: "", DmModRunWt: 0, DmWaxWt: 0, DmSilModWt: 0, DmCasPcWt: 0, DmTotDiaWt: 0
//   });

//   // --- States for Design Dropdown (Infinite Scroll) ---
//   const [dsgData, setDsgData] = useState([]); 
//   const [designCode, setDesignCode] = useState(""); 
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
//   const [page, setPage] = useState(1);         
//   const [hasMore, setHasMore] = useState(true); 

//   // --- States for Category Dropdown ---
//   const [catData, setCatData] = useState([]); 
//   const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

//   // --- Keyboard Navigation State ---
//   const [highlightedIndex, setHighlightedIndex] = useState(-1);
//   const resultsRef = useRef(null);

//   // --- Initial Load ---
//   useEffect(() => {
//     fetchCatList();
//     loadMoreDesigns(); 
//     // eslint-disable-next-line
//   }, []);

//   // --- Reset Highlight when data changes ---
//   useEffect(() => {
//     setHighlightedIndex(-1);
//   }, [dsgData, catData]);

//   // --- COMPLEX SEARCH LOGIC (Hybrid: Global Scroll vs Category Filter) ---
//   useEffect(() => {
//     const delaySearch = setTimeout(() => {
      
//       // Case A: Category Selected hai -> Filtered Search (With Search Text)
//       if (formData.DmTcTyp && designCode.trim() !== "" && isDropdownOpen) {
//          fetchDesignsByCategory(formData.DmTcTyp, designCode);
//       }
//       // Case B: Category Selected hai -> Show All in Category (Text Empty)
//       else if (formData.DmTcTyp && designCode.trim() === "" && isDropdownOpen) {
//          fetchDesignsByCategory(formData.DmTcTyp, "");
//       }
//       // Case C: No Category -> Global Search
//       else if (!formData.DmTcTyp && designCode.trim() !== "" && isDropdownOpen) {
//         fetchSearchResults(designCode);
//       } 
//       // Case D: No Category & Empty Text -> Standard Infinite Scroll
//       else if (!formData.DmTcTyp && designCode === "" && isDropdownOpen && !hasMore) {
//          setPage(1);
//          setHasMore(true);
//          setDsgData([]); 
//          loadMoreDesigns(1);
//       }
//     }, 500); 
//     return () => clearTimeout(delaySearch);
//   }, [designCode, isDropdownOpen, formData.DmTcTyp]);

//   // --- Search Logic for Category ---
//   useEffect(() => {
//     const delayCatSearch = setTimeout(() => {
//       if (formData.DmTcTyp && isCatDropdownOpen) {
//         fetchCatSearchResults(formData.DmTcTyp);
//       } else if (!formData.DmTcTyp) {
//         fetchCatList();
//       }
//     }, 500);
//     return () => clearTimeout(delayCatSearch);
//   }, [formData.DmTcTyp, isCatDropdownOpen]);


//   // --- API Functions ---------------------------------------

//   // 1. Infinite Scroll Fetcher (Global - No Category Filter)
//   const loadMoreDesigns = async (currentPage = page) => {
//     // Agar category selected hai to global scroll mat karo
//     if (formData.DmTcTyp) return; 

//     try {
//       const res = await axios.get("http://localhost:5000/api/users/scroll-testing", {
//         params: { page: currentPage, limit: 50, search: "" }
//       });

//       const newData = res.data;

//       if (newData.length < 50) {
//         setHasMore(false); 
//       }

//       if (currentPage === 1) {
//         setDsgData(newData);
//       } else {
//         setDsgData(prev => [...prev, ...newData]);
//       }
      
//       setPage(currentPage + 1);
//     } catch (err) {
//       console.error("Scroll API Error:", err);
//     }
//   };

//   // 2. Global Search Fetcher (No Category)
//   const fetchSearchResults = async (searchText) => {
//     try {
//       setHasMore(false); 
//       const res = await axios.get(`http://localhost:5000/api/users/search?text=${searchText}`);
//       const rawData = res.data.data ? res.data.data : res.data;
//       const safeData = rawData.slice(0, 100); 
//       setDsgData(safeData);
//     } catch (err) {
//       console.error("Search API Error:", err);
//       setDsgData([]); 
//     }
//   };

//   // 3. Category Search Fetcher
//   const fetchCatSearchResults = async (searchText) => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/users/search-dmctg?text=${searchText}`);
//       if(res.data.success) {
//           setCatData(res.data.data);
//       }
//     } catch (err) {
//       console.error("Category Search Error:", err);
//       setCatData([]); 
//     }
//   };

//   // 4. Initial Category List
//   const fetchCatList = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/users/dsgcat");
//       if(res.data.success) {
//          setCatData(res.data.data); 
//       }
//     } catch (err) {
//       console.error("Category API Error:", err);
//     }
//   };
  
//   // 5. Filtered Designs by Category (+ Optional Search)
//   // UPDATED: Now supports searchText
//   const fetchDesignsByCategory = async (category, searchText = "") => {
//     if (!category) return;
    
//     // Filter mode mein hum infinite scroll disable kar rahe hain (simplification ke liye)
//     setHasMore(false); 

//     try {
//       const res = await axios.get(`http://localhost:5000/api/users/dsgcat-by-ctg`, {
//           params: { 
//             dmctg: category,
//             text: searchText // Sending search text to backend
//           }
//       });
//       const dataToSet = res.data.data ? res.data.data : res.data;
//       setDsgData(dataToSet);
//     } catch (err) {
//       console.error("Filtered Design API Error:", err);
//       setDsgData([]);
//     }
//   };

//   // --- Handlers ------------------------------

//   const handleKeyDown = (e, data, selectCallback) => {
//     if (!data || data.length === 0) return;

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setHighlightedIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));
//       if (resultsRef.current && highlightedIndex >= 0) {
//           // Optional: logic to keep scroll in view
//       }
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
//     } else if (e.key === "Enter") {
//       e.preventDefault();
//       if (highlightedIndex >= 0 && highlightedIndex < data.length) {
//         selectCallback(data[highlightedIndex]);
//       }
//     } else if (e.key === "Escape") {
//       setIsDropdownOpen(false);
//       setIsCatDropdownOpen(false);
//     }
//   };

//   const handleCatSelect = (item) => {
//     // Backend returns 'pmcd'
//     const categoryValue = item.pmcd || item.DmCtg; 
//     setFormData(prev => ({ ...prev, DmTcTyp: categoryValue }));
//     setIsCatDropdownOpen(false);
//     setHighlightedIndex(-1);
    
//     // Reset Design field and Fetch filtered list
//     setDesignCode(""); 
//     setDsgData([]); 
//     fetchDesignsByCategory(categoryValue, ""); 
//   };

//   const handleSelect = async (item) => {
//     const selectedCode = item.DmCd;
//     setDesignCode(selectedCode); 
//     setIsDropdownOpen(false);    
//     setHighlightedIndex(-1);
  
//     try {
//       // Fetch Full Details for the selected Design
//       const res = await axios.get(`http://localhost:5000/api/users/dsgcd/${selectedCode}`);
//       let newData = {};
//       if (res.data.success && res.data.data.length > 0) {
//          newData = res.data.data[0];
//       } else {
//          newData = item;
//       }
//       // Preserve the manually selected Category (DmTcTyp)
//       setFormData(prev => ({ ...prev, ...newData, DmTcTyp: prev.DmTcTyp }));
//     } catch(err) {
//        console.log("Fetching details failed, using list data", err);
//        setFormData(prev => ({ ...prev, ...item, DmTcTyp: prev.DmTcTyp }));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? (checked ? 'Y' : 'N') : value
//     }));
//   };

//   return (
//     <div className="window-container">
//       {/* Styles */}
//       <style>{`
//         .active-row {
//           color: #132f4a;
//           background: #fffbc8 !important;
//         }
//         .grid-body::-webkit-scrollbar {
//           width: 8px;
//         }
//         .grid-body::-webkit-scrollbar-thumb {
//           background-color: #ccc;
//           border-radius: 4px;
//         }
//       `}</style>

//       {/* Menu Bar */}
//       <div className="menu-bar">
//         <div className="menu-item"><span>P</span>arameters</div>
//         <div className="menu-item"><span>M</span>asters</div>
//         <div className="menu-item"><span>T</span>ransactions</div>
//         <div className="menu-item"><span>R</span>eports</div>
//         <div className="menu-item">AddOn Menus</div>
//         <div className="menu-item"><span>W</span>indow</div>
//         <div className="menu-item"><span>Q</span>uit</div>
//       </div>

//       <div className="form-section">
        
//         {/* Header Fields */}
//         <div className="header-grid">
//           <label>Dsg Ctg/Cd</label>
//           <div className="flex-split">
            
//             {/* INPUT 1: CATEGORY SELECTION */}
//             <div className="input-wrapper" style={{position: 'relative', display: 'inline-block'}}>
//               <input 
//                 type="text" 
//                 className="w-xs" 
//                 name="DmTcTyp"
//                 value={formData.DmTcTyp || ''}
//                 onChange={(e) => {
//                     handleChange(e);
//                     setIsCatDropdownOpen(true); 
//                 }}
//                 onFocus={() => {
//                   setIsCatDropdownOpen(true);
//                   setHighlightedIndex(-1);
//                 }}
//                 onKeyDown={(e) => handleKeyDown(e, catData, handleCatSelect)}
//                 onBlur={() => setTimeout(() => setIsCatDropdownOpen(false), 200)}
//                 autoComplete="off"
//                 placeholder="Ctg"
//               />
              
//               {isCatDropdownOpen && catData.length > 0 && (
//                 <div className="dropdown-table" style={{width: '150px'}} ref={resultsRef}>
//                   <div className="grid-row grid-header">
//                     <div className="grid-cell" style={{flex: 1}}>Category</div>
//                   </div>
//                   <div className="grid-body">
//                     {catData.map((row, index) => (
//                       <div 
//                         key={index} 
//                         className={`grid-row ${index === highlightedIndex ? 'active-row' : ''}`}
//                         onMouseDown={() => handleCatSelect(row)} 
//                         ref={(el) => (index === highlightedIndex && el) ? el.scrollIntoView({ block: 'nearest' }) : null}
//                       >
//                         <div className="grid-cell" style={{flex: 1}}>
//                             {/* Displaying 'pmcd' */}
//                             {row.pmcd || row.DmCtg}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <span>/</span>
            
//             {/* INPUT 2: DESIGN SELECTION */}
//             <div className="input-wrapper" style={{position: 'relative', display: 'inline-block'}}>
//               <input 
//                 type="text" 
//                 className="w-md" 
//                 value={designCode}
//                 onChange={(e) => {
//                   setDesignCode(e.target.value);
//                   setIsDropdownOpen(true); 
//                 }}
//                 onFocus={() => {
//                   setIsDropdownOpen(true);
//                   setHighlightedIndex(-1);
//                   // Load initial data if empty and no category selected
//                   if(dsgData.length === 0 && !formData.DmTcTyp) loadMoreDesigns(1);
//                   // If category is selected, reload specific category designs
//                   if(formData.DmTcTyp && dsgData.length === 0) fetchDesignsByCategory(formData.DmTcTyp, "");
//                 }}
//                 onKeyDown={(e) => handleKeyDown(e, dsgData, handleSelect)}
//                 onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
//                 autoComplete="off"
//                 placeholder="Select Design"
//               />
              
//               {isDropdownOpen && (
//                 <div 
//                   className="dropdown-table" 
//                   ref={resultsRef} 
//                   style={{ width: '450px', display: 'flex', flexDirection: 'column' }} 
//                 >
//                   <div className="grid-row grid-header">
//                     <div className="grid-cell" style={{width: '120px'}}>Design</div>
//                     <div className="grid-cell" style={{width: '60px'}}>Size</div>
//                     <div className="grid-cell" style={{width: '60px'}}>Ctg</div>
//                     <div className="grid-cell" style={{flex: 1}}>Description</div>
//                   </div>

//                   {/* SCROLLABLE DIV */}
//                   <div 
//                     id="designScrollDiv" 
//                     className="grid-body"
//                     style={{ maxHeight: '250px', overflowY: 'auto', overflowX: 'hidden' }}
//                   >
//                      <InfiniteScroll
//                         dataLength={dsgData.length}
//                         next={() => loadMoreDesigns(page)}
//                         // Agar Category Selected hai, ya search ho raha hai, toh InfiniteScroll disable karo
//                         hasMore={(!formData.DmTcTyp && !designCode) ? hasMore : false} 
//                         loader={<h5 style={{textAlign:'center', margin:'5px'}}>Loading...</h5>}
//                         scrollableTarget="designScrollDiv" 
//                         endMessage={!designCode && <p style={{textAlign: 'center', fontSize: '10px'}}>End of List</p>}
//                       >
//                         {dsgData.map((row, index) => (
//                           <div 
//                             key={`${row.DmCd}-${index}`} 
//                             className={`grid-row ${index === highlightedIndex ? 'active-row' : ''}`}
//                             onMouseDown={() => handleSelect(row)}
//                             ref={(el) => (index === highlightedIndex && el) ? el.scrollIntoView({ block: 'nearest' }) : null}
//                             style={{cursor: 'pointer'}}
//                           >
//                             <div className="grid-cell" style={{width: '120px'}}>{row.DmCd}</div>
//                             <div className="grid-cell" style={{width: '60px'}}>{row.DmSz}</div>
//                             <div className="grid-cell" style={{width: '60px'}}>{row.DmCtg}</div>
//                             <div className="grid-cell" style={{flex: 1}}>{row.DmDesc}</div>
//                           </div>
//                         ))}
//                          {dsgData.length === 0 && (
//                             <div style={{padding: '10px', textAlign: 'center'}}>No Designs Found</div>
//                         )}
//                     </InfiniteScroll>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Form Fields - Remaining layout is standard */}
//           <label>Sz</label>
//           <input type="text" className="w-sm" name="DmSz" value={formData.DmSz || ''} onChange={handleChange} />

//           <label>Ctg</label>
//           <input type="text" className="w-full" name="DmCtg" value={formData.DmCtg || ''} onChange={handleChange} />
//           <label>Uom</label>
//           <input type="text" className="w-sm" name="DmUom" value={formData.DmUom || ''} onChange={handleChange} />

//           <div className="full-row" style={{alignItems: 'center'}}>
//             <label style={{minWidth: '65px'}}>Desc</label>
//             <input type="text" className="w-full" name="DmDesc" value={formData.DmDesc || ''} onChange={handleChange} />
//           </div>

//           <div className="full-row" style={{alignItems: 'center'}}>
//             <label style={{minWidth: '65px'}}>Dsg Lock</label>
//             <button className="disabled" style={{width: '80px', textAlign:'center'}}>Password</button>
//             <input type="password" className="w-md" name="DmLockYN" value={formData.DmLockYN || ''} readOnly />
//           </div>

//            <div className="full-row" style={{alignItems: 'center'}}>
//             <label style={{minWidth: '65px'}}>Valid Co Cds</label>
//             <input type="text" className="w-full" name="DmValidCoCd" value={formData.DmValidCoCd || ''} onChange={handleChange} />
//           </div>
//         </div>

//      <div className="tabs">
//         <div className={`tab ${activeTab === '1' ? 'active' : ''}`} onClick={() => setActiveTab('1')}>&lt;1&gt; General</div>
//         <div className={`tab ${activeTab === '2' ? 'active' : ''}`} onClick={() => setActiveTab('2')}>&lt;2&gt; Bill Of Materials</div>
//         <div className={`tab ${activeTab === '3' ? 'active' : ''}`} onClick={() => setActiveTab('3')}>&lt;3&gt; Lab Details</div>
//         <div className={`tab ${activeTab === '4' ? 'active' : ''}`} onClick={() => setActiveTab('4')}>&lt;4&gt; Analysis</div>
//         <div className={`tab ${activeTab === '5' ? 'active' : ''}`} onClick={() => setActiveTab('5')}>&lt;5&gt; History</div>
//         <div className={`tab ${activeTab === '6' ? 'active' : ''}`} onClick={() => setActiveTab('6')}>&lt;6&gt; Faults</div>
//         <div className={`tab ${activeTab === 'a' ? 'active' : ''}`} onClick={() => setActiveTab('a')}>&lt;a&gt; Images</div>
//       </div>

//       <div className="tab-content">
//         {activeTab === '1' && (
//           <>
//             <label>Prd Ctg</label>
//             <input type="text" className="w-sm" name="DmPrdCtg" value={formData.DmPrdCtg || ''} onChange={handleChange} />
            
//             <label>Sales Ctg</label>
//             <div className="flex-split">
//               <input type="text" className="w-sm" name="DmSalCtg" value={formData.DmSalCtg || ''} onChange={handleChange} />
//               <label>Sales Ctg2</label>
//               <input type="text" className="w-sm" name="DmSalCtg2" value={formData.DmSalCtg2 || ''} onChange={handleChange} />
//               <label>Sales Ctg3</label>
//               <input type="text" className="w-sm" name="DmSalCtg3" value={formData.DmSalCtg3 || ''} onChange={handleChange} />
//             </div>

//             <label>Loss Ctg</label>
//             <input type="text" className="w-sm" name="DmLsCtg" value={formData.DmLsCtg || ''} onChange={handleChange} />
            
//             <label>Karat</label>
//             <div className="grid-item-right">
//                <input type="text" className="w-sm" name="DmKt" value={formData.DmKt || ''} onChange={handleChange} />
//                <label style={{marginLeft:'20px'}}>Val Addn Ctg</label>
//                <input type="text" className="w-sm" name="DmVaCtg" value={formData.DmVaCtg || ''} onChange={handleChange} />
//             </div>

//             <label>Set Family Cd</label>
//             <input type="text" className="w-md" name="DmSetCd" value={formData.DmSetCd || ''} onChange={handleChange} />
            
//             <label>Old Cd</label>
//             <div className="grid-item-right" style={{width:'100%', justifyContent:'space-between'}}>
//               <input type="text" className="w-md" name="DmOldCd" value={formData.DmOldCd || ''} onChange={handleChange} />
//               <div style={{display:'flex', gap: '5px', alignItems:'center'}}>
//                  <label>Bag Pcs</label>
//                  <input type="text" className="w-xs text-right" name="DmBagPcs" value={formData.DmBagPcs || 0} onChange={handleChange} />
//               </div>
//             </div>

//             <label>Parts</label>
//             <input type="text" className="w-xs text-right" name="DmParts" value={formData.DmParts || 0} onChange={handleChange} />
            
//             <label>Part Desc</label>
//             <div className="grid-item-right" style={{width:'100%'}}>
//                <input type="text" style={{flex:1}} name="DmPartDesc" value={formData.DmPartDesc || ''} onChange={handleChange} />
//                <label>Colour</label>
//                <input type="text" className="w-sm" name="DmCol" value={formData.DmCol || ''} onChange={handleChange} />
//             </div>

//             <label>On Hold</label>
//             <input type="checkbox" name="DmHld" checked={formData.DmHld === 'Y'} onChange={handleChange} />
            
//             <label>Holding Desc</label>
//             <input type="text" className="w-full" name="DmHldDesc" value={formData.DmHldDesc || ''} onChange={handleChange} />

//             <label>Default Size</label>
//             <input type="text" className="w-sm" name="DmDefSz" value={formData.DmDefSz || ''} onChange={handleChange} />
            
//             <label style={{gridRow: 'span 2', alignSelf:'start'}}>Prd Instruction</label>
//             <textarea 
//               style={{gridRow: 'span 2', height: '45px', width: '100%', resize:'none'}} 
//               name="DmPrdInst" 
//               value={formData.DmPrdInst || ''} 
//               onChange={handleChange}
//             ></textarea>

//             <label>Prc Seq</label>
//             <input type="text" className="w-full" name="DmPrcsSeq" value={formData.DmPrcsSeq || ''} onChange={handleChange} />
            
//             <label>Prd Seq</label>
//             <input type="text" className="w-full" name="DmPrdSeq" value={formData.DmPrdSeq || ''} onChange={handleChange} />
            
//             <label>Designed By</label>
//             <div className="grid-item-right">
//                <input type="text" className="w-md" name="DmDsgBy" value={formData.DmDsgBy || ''} onChange={handleChange} />
//                <label style={{marginLeft: 'auto'}}>Created Date</label>
//                <input type="text" className="w-sm" style={{backgroundColor: '#808080', color: 'white'}} 
//                  value={formData.DmCreatedDt ? formData.DmCreatedDt.slice(0, 10) : ''} readOnly 
//                />
//             </div>

//             <label>Pref Vendor</label>
//             <input type="text" className="w-md" name="DmPrfVendCd" value={formData.DmPrfVendCd || ''} onChange={handleChange} />
            
//             <label>Last Modified</label>
//             <input type="text" className="w-full" readOnly 
//               value={`${formData.ModUsr || ''} / ${formData.ModDt ? formData.ModDt.slice(0, 10) : ''}`} 
//             />

//             <label>Design Date</label>
//             <input type="text" className="w-sm" placeholder="//" name="DmDsgDt" value={formData.DmDsgDt ? formData.DmDsgDt.slice(0, 10) : ''} onChange={handleChange} />
            
//             <label>Source Sketch</label>
//             <div className="grid-item-right">
//                <input type="text" className="w-md" name="DmSrcDsgCd" value={formData.DmSrcDsgCd || ''} onChange={handleChange} />
//                <label>/ Dsg Cd</label>
//             </div>

//             <label>Model Maker</label>
//             <input type="text" className="w-full" name="DmModMkr" value={formData.DmModMkr || ''} onChange={handleChange} />
            
//             <label>Model Wt With Runner</label>
//             <input type="text" className="w-sm text-right" name="DmModRunWt" value={formData.DmModRunWt || 0} onChange={handleChange} />

//             <label>Wax Wt</label>
//             <input type="text" className="w-sm text-right" name="DmWaxWt" value={formData.DmWaxWt || 0} onChange={handleChange} />
            
//             <label>Silver/Model Wt</label>
//             <input type="text" className="w-sm text-right" name="DmSilModWt" value={formData.DmSilModWt || 0} onChange={handleChange} />

//             <label>Casting Pc Wt</label>
//             <input type="text" className="w-sm text-right" name="DmCasPcWt" value={formData.DmCasPcWt || 0} onChange={handleChange} />
//             <div></div> <div></div> 
            
//             <label>Total Dia Wt</label>
//             <input type="text" className="w-sm text-right" name="DmTotDiaWt" value={formData.DmTotDiaWt || 0} onChange={handleChange} />
//             <div></div> <div></div>
//           </>
//         )}
        
//         {activeTab !== '1' && <div style={{gridColumn: '1 / -1', padding: '20px'}}>Content for Tab {activeTab}</div>}
//       </div>

//       <div className="action-footer">
//           <div className="btn-group">
//             <button>&lt;A&gt;dd</button><button>&lt;F&gt;ind</button><button>e&lt;X&gt;it</button>
//           </div>
//           <div className="btn-group">
//             <button className="disabled">Copy</button><button className="disabled">Summary</button><button className="disabled">Copy Fg Bag</button>
//           </div>
//           <div className="btn-group">
//             <button className="disabled">Job Card</button><button className="disabled">Mkt Card</button>
//           </div>
//           <div className="btn-group">
//             <button className="disabled">&lt;S&gt;ave</button><button className="disabled">&lt;C&gt;lose</button><button className="disabled">&lt;D&gt;elete</button>
//           </div>
//       </div>
//     </div>
//     </div>
//   );
// }

// export default App;




///---------------------Component----------------------------

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import './App.css';

// // Importing the 3 components
// import AppLayout from "./components/AppLayout";
// import SearchHeader from "./components/SearchHeader";
// import TabForm from "./components/TabForm";
// const apiUrl = import.meta.env.VITE_API_URL;
// function App() {
//   const [activeTab, setActiveTab] = useState('1');

//   // --- Form Data State ---
//   const [formData, setFormData] = useState({
//     DmTcTyp: "", DmSz: "", DmCtg: "", DmUom: "", DmDesc: "", DmLockYN: "N", DmValidCoCd: "",
//     DmPrdCtg: "", DmSalCtg: "", DmSalCtg2: "", DmSalCtg3: "", DmLsCtg: "", DmKt: "", DmVaCtg: "",
//     DmSetCd: "", DmOldCd: "", DmBagPcs: 0, DmParts: 0, DmPartDesc: "", DmCol: "",
//     DmHld: "N", DmHldDesc: "", DmDefSz: "", DmPrdInst: "", DmPrcsSeq: "", DmPrdSeq: "", DmDsgBy: "",
//     DmCreatedDt: "", DmPrfVendCd: "", ModUsr: "", ModDt: "", DmDsgDt: "", DmSrcDsgCd: "",
//     DmModMkr: "", DmModRunWt: 0, DmWaxWt: 0, DmSilModWt: 0, DmCasPcWt: 0, DmTotDiaWt: 0
//   });

//   // --- Search & Dropdown States ---
//   const [dsgData, setDsgData] = useState([]);
//   const [designCode, setDesignCode] = useState("");
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const designInputRef = useRef(null); 
//   const [catData, setCatData] = useState([]);
//   const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  
//   const [highlightedIndex, setHighlightedIndex] = useState(-1);
//   const resultsRef = useRef(null);

//   // --- Initial Load ---
//   useEffect(() => {
 
//     fetchCatList();
//     loadMoreDesigns();

//   }, []);

//   useEffect(() => { setHighlightedIndex(-1); }, [dsgData, catData]);

//   // --- COMPLEX SEARCH LOGIC ---
//   useEffect(() => {
//     const delaySearch = setTimeout(() => {
//       if (formData.DmTcTyp && designCode.trim() !== "" && isDropdownOpen) {
//         fetchDesignsByCategory(formData.DmTcTyp, designCode);
//       } else if (formData.DmTcTyp && designCode.trim() === "" && isDropdownOpen) {
//         fetchDesignsByCategory(formData.DmTcTyp, "");
//       } else if (!formData.DmTcTyp && designCode.trim() !== "" && isDropdownOpen) {
//         fetchSearchResults(designCode);
//       } else if (!formData.DmTcTyp && designCode === "" && isDropdownOpen && !hasMore) {
//         setPage(1); setHasMore(true); setDsgData([]); loadMoreDesigns(1);
//       }
//     }, 500);
//     return () => clearTimeout(delaySearch);
//   }, [designCode, isDropdownOpen, formData.DmTcTyp]);

//   useEffect(() => {
//     const delayCatSearch = setTimeout(() => {
//       if (formData.DmTcTyp && isCatDropdownOpen) fetchCatSearchResults(formData.DmTcTyp);
//       else if (!formData.DmTcTyp) fetchCatList();
//     }, 500);
//     return () => clearTimeout(delayCatSearch);
//   }, [formData.DmTcTyp, isCatDropdownOpen]);

//   // --- API Functions ---
//   const loadMoreDesigns = async (currentPage = page) => {
//     if (formData.DmTcTyp) return;
//     try {
//       const res = await axios.get(  `${apiUrl}/scroll-testing`, { params: { page: currentPage, limit: 50, search: "" } });
//       const newData = res.data;
//       if (newData.length < 50) setHasMore(false);
//       setDsgData(prev => currentPage === 1 ? newData : [...prev, ...newData]);
//       setPage(currentPage + 1);
//     } catch (err) { console.error("Scroll API Error:", err); }
//   };

//   const fetchSearchResults = async (text) => {
//     try {
//       setHasMore(false);
//       const res = await axios.get(`${apiUrl}/search?text=${text}`  );
//       setDsgData((res.data.data || res.data).slice(0, 100));
//     } catch (err) { setDsgData([]); }
//   };

//   const fetchCatSearchResults = async (text) => {
//     try {
//       const res = await axios.get(  `${apiUrl}/search-dmctg?text=${text}` );
//       if (res.data.success) setCatData(res.data.data);
//     } catch (err) { setCatData([]); }
//   };

//   const fetchCatList = async () => {
//     try {
//       const res = await axios.get(`${apiUrl}/dsgcat`);
//       console.log(res.data,"fetchCatList")
//       if (res.data.success) setCatData(res.data.data);
//     } catch (err) { console.error("Category API Error:", err); }
//   };

// // 5. Filtered Designs by Category (+ Client-Side Search Fix)
//   const fetchDesignsByCategory = async (category, searchText = "") => {
//     if (!category) return;
    
//     setHasMore(false); // Filter mode mein scroll off

//     try {
//       // 1. API Call (Data mangwana)
//       const res = await axios.get(`${apiUrl}/dsgcat-by-ctg`, {
//           params: { 
//             dmctg: category,
//             text: searchText 
//           }
//       });
      
//       let fetchedData = res.data.data ? res.data.data : res.data;

//       // 🔥 FIX: Agar search text hai, toh hum browser mein bhi filter karenge
//       // (Safety: Agar backend filter nahi kar raha, toh ye code karega)
//       if (searchText && searchText.trim() !== "") {
//         const lowerText = searchText.toLowerCase();
        
//         fetchedData = fetchedData.filter(item => {
//            // Design Code ya Description match kare
//            const codeMatch = item.DmCd && item.DmCd.toLowerCase().includes(lowerText);
//            const descMatch = item.DmDesc && item.DmDesc.toLowerCase().includes(lowerText);
           
//            return codeMatch || descMatch;
//         });
//       }

//       setDsgData(fetchedData);

//     } catch (err) {
//       console.error("Filtered Design API Error:", err);
//       setDsgData([]);
//     }
//   };

//   // --- Handlers ---
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (checked ? 'Y' : 'N') : value }));
//   };

//   const handleKeyDown = (e, data, selectCallback) => {
//     if (!data || data.length === 0) return;
//     if (e.key === "ArrowDown") {
//       e.preventDefault(); setHighlightedIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));
//     } else if (e.key === "ArrowUp") {
//       e.preventDefault(); setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
//     } else if (e.key === "Enter") {
//       e.preventDefault(); if (highlightedIndex >= 0) selectCallback(data[highlightedIndex]);
//     } else if (e.key === "Escape") {
//       setIsDropdownOpen(false); setIsCatDropdownOpen(false);
//     }
//   };

//   const handleCatSelect = (item) => {
//     const categoryValue = item.pmcd || item.DmCtg;
//     setFormData(prev => ({ ...prev, DmTcTyp: categoryValue }));
//     setIsCatDropdownOpen(false); setHighlightedIndex(-1);
//     setDesignCode(""); setDsgData([]); fetchDesignsByCategory(categoryValue, "");


//    setTimeout(() => {
//       if (designInputRef.current) {
       
//         designInputRef.current.focus();
//       }
//     }, 100);
//   };

//   const handleSelect = async (item) => {
//     const selectedCode = item.DmCd;
//     setDesignCode(selectedCode); setIsDropdownOpen(false); setHighlightedIndex(-1);
//     try {
//       const res = await axios.get(`${apiUrl}/dsgcd/${selectedCode}`);
//       const newData = (res.data.success && res.data.data.length > 0) ? res.data.data[0] : item;
//       setFormData(prev => ({ ...prev, ...newData, DmTcTyp: prev.DmTcTyp }));
//     } catch (err) {
//       setFormData(prev => ({ ...prev, ...item, DmTcTyp: prev.DmTcTyp }));
//     }
//   };

//   return (
//     <AppLayout>
//       <SearchHeader
//         formData={formData} handleChange={handleChange} handleKeyDown={handleKeyDown}
//         resultsRef={resultsRef} highlightedIndex={highlightedIndex} setHighlightedIndex={setHighlightedIndex}
//         // Search Props
//         designCode={designCode} setDesignCode={setDesignCode} isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}
//         dsgData={dsgData} handleSelect={handleSelect} loadMoreDesigns={loadMoreDesigns} hasMore={hasMore} page={page}
//         // Cat Props
//         catData={catData} isCatDropdownOpen={isCatDropdownOpen} setIsCatDropdownOpen={setIsCatDropdownOpen} handleCatSelect={handleCatSelect}
//         designInputRef={designInputRef}
//      />
//       <TabForm
//         activeTab={activeTab} setActiveTab={setActiveTab}
//         formData={formData} handleChange={handleChange}
//       />
//     </AppLayout>
//   );
// }

// export default App;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import './index.css';

// Importing the 3 components
import AppLayout from "./components/AppLayout";
import SearchHeader from "./components/SearchHeader";
import TabForm from "./components/TabForm";
const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const [activeTab, setActiveTab] = useState('1');

  // --- Form Data State ---
  const [formData, setFormData] = useState({
    DmTcTyp: "", DmSz: "", DmCtg: "", DmUom: "", DmDesc: "", DmLockYN: "N", DmValidCoCd: "",
    DmPrdCtg: "", DmSalCtg: "", DmSalCtg2: "", DmSalCtg3: "", DmLsCtg: "", DmKt: "", DmVaCtg: "",
    DmSetCd: "", DmOldCd: "", DmBagPcs: 0, DmParts: 0, DmPartDesc: "", DmCol: "",
    DmHld: "N", DmHldDesc: "", DmDefSz: "", DmPrdInst: "", DmPrcsSeq: "", DmPrdSeq: "", DmDsgBy: "",
    DmCreatedDt: "", DmPrfVendCd: "", ModUsr: "", ModDt: "", DmDsgDt: "", DmSrcDsgCd: "",
    DmModMkr: "", DmModRunWt: 0, DmWaxWt: 0, DmSilModWt: 0, DmCasPcWt: 0, DmTotDiaWt: 0
  });

  // --- Search & Dropdown States ---
  const [dsgData, setDsgData] = useState([]);
  const [designCode, setDesignCode] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const designInputRef = useRef(null); 
  const [catData, setCatData] = useState([]);
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const resultsRef = useRef(null);

  // --- Initial Load ---
  useEffect(() => {
    fetchCatList();
    loadMoreDesigns();
    // eslint-disable-next-line
  }, []);

  useEffect(() => { setHighlightedIndex(-1); }, [dsgData, catData]);

  // --- COMPLEX SEARCH LOGIC ---
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      
      // Case A: Category Selected + Text Typed
      if (formData.DmTcTyp && designCode.trim() !== "" && isDropdownOpen) {
         console.log("🔍 Logic: Case A (Category + Search Text)");
         fetchDesignsByCategory(formData.DmTcTyp, designCode);
      }
      // Case B: Category Selected + Empty Text (Show All in Cat)
      else if (formData.DmTcTyp && designCode.trim() === "" && isDropdownOpen) {
         console.log("🔍 Logic: Case B (Category Only)");
         fetchDesignsByCategory(formData.DmTcTyp, "");
      }
      // Case C: No Category + Text Typed (Global Search)
      else if (!formData.DmTcTyp && designCode.trim() !== "" && isDropdownOpen) {
        console.log("🔍 Logic: Case C (Global Search)");
        fetchSearchResults(designCode);
      } 
      // Case D: No Category + Empty Text (Reset to Infinite Scroll)
      else if (!formData.DmTcTyp && designCode === "" && isDropdownOpen && !hasMore) {
         console.log("🔍 Logic: Case D (Resetting to Global Scroll)");
         setPage(1); 
         setHasMore(true); 
         setDsgData([]); 
         loadMoreDesigns(1);
      }
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [designCode, isDropdownOpen, formData.DmTcTyp]);

  // --- Category Search Logic ---
  useEffect(() => {
    const delayCatSearch = setTimeout(() => {
      if (formData.DmTcTyp && isCatDropdownOpen) {
        fetchCatSearchResults(formData.DmTcTyp);
      } else if (!formData.DmTcTyp) {
        fetchCatList();
      }
    }, 500);
    return () => clearTimeout(delayCatSearch);
  }, [formData.DmTcTyp, isCatDropdownOpen]);

  // --- API Functions ---

  // 1. Infinite Scroll Fetcher
  const loadMoreDesigns = async (currentPage = page) => {
    if (formData.DmTcTyp) return;
    
    console.log(`🚀 [API CALL] loadMoreDesigns | Page: ${currentPage}`);
    
    try {
      const res = await axios.get(`${apiUrl}/scroll-testing`, { params: { page: currentPage, limit: 50, search: "" } });
      const newData = res.data;
      if (newData.length < 50) setHasMore(false);
      setDsgData(prev => currentPage === 1 ? newData : [...prev, ...newData]);
      setPage(currentPage + 1);
    } catch (err) { console.error("Scroll API Error:", err); }
  };

  // 2. Global Search Fetcher
  const fetchSearchResults = async (text) => {
    console.log(`🚀 [API CALL] fetchSearchResults | Searching: "${text}"`);
    try {
      setHasMore(false);
      const res = await axios.get(`${apiUrl}/search?text=${text}`);
      setDsgData((res.data.data || res.data).slice(0, 100));
    } catch (err) { setDsgData([]); }
  };

  // 3. Category Search Fetcher
  const fetchCatSearchResults = async (text) => {
    console.log(`🚀 [API CALL] fetchCatSearchResults | Searching Cat: "${text}"`);
    try {
      const res = await axios.get(`${apiUrl}/search-dmctg?text=${text}`);
      if (res.data.success) setCatData(res.data.data);
    } catch (err) { setCatData([]); }
  };

  // 4. Initial Category List
  const fetchCatList = async () => {
    console.log(`🚀 [API CALL] fetchCatList | Loading All Categories`);
    try {
      const res = await axios.get(`${apiUrl}/dsgcat`);
      if (res.data.success) setCatData(res.data.data);
    } catch (err) { console.error("Category API Error:", err); }
  };

  // 5. Filtered Designs by Category (+ Client-Side Search Fix)
  const fetchDesignsByCategory = async (category, searchText = "") => {
    if (!category) return;
    
    console.log(`🚀 [API CALL] fetchDesignsByCategory | Cat: "${category}", Text: "${searchText}"`);
    
    setHasMore(false); // Filter mode mein scroll off

    try {
      // API Call
      const res = await axios.get(`${apiUrl}/dsgcat-by-ctg`, {
          params: { 
            dmctg: category,
            text: searchText 
          }
      });
      
      let fetchedData = res.data.data ? res.data.data : res.data;

      // 🔥 Client-Side Filtering Log
      if (searchText && searchText.trim() !== "") {
        console.log(`⚙️ [CLIENT FILTER] Applying filter for: "${searchText}"`);
        const lowerText = searchText.toLowerCase();
        
        fetchedData = fetchedData.filter(item => {
           const codeMatch = item.DmCd && item.DmCd.toLowerCase().includes(lowerText);
           const descMatch = item.DmDesc && item.DmDesc.toLowerCase().includes(lowerText);
           return codeMatch || descMatch;
        });
        console.log(`✅ [CLIENT FILTER] Result count: ${fetchedData.length}`);
      }

      setDsgData(fetchedData);

    } catch (err) {
      console.error("Filtered Design API Error:", err);
      setDsgData([]);
    }
  };

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? (checked ? 'Y' : 'N') : value }));
  };

  const handleKeyDown = (e, data, selectCallback) => {
    if (!data || data.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault(); setHighlightedIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault(); if (highlightedIndex >= 0) selectCallback(data[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false); setIsCatDropdownOpen(false);
    }
  };

  const handleCatSelect = (item) => {
    console.log(`👉 [USER ACTION] Category Selected: ${item.pmcd || item.DmCtg}`);
    const categoryValue = item.pmcd || item.DmCtg;
    setFormData(prev => ({ ...prev, DmTcTyp: categoryValue }));
    setIsCatDropdownOpen(false); 
    setHighlightedIndex(-1);
    
    setDesignCode(""); 
    setDsgData([]); 
    
    // Trigger API fetch for this category
    fetchDesignsByCategory(categoryValue, "");

    // Focus Shift Logic
    setTimeout(() => {
      if (designInputRef.current) {
        console.log("⚡ [FOCUS] Shifting focus to Design Input");
        designInputRef.current.focus();
      }
    }, 100);
  };

  const handleSelect = async (item) => {
    const selectedCode = item.DmCd;
    console.log(`👉 [USER ACTION] Design Selected: ${selectedCode}`);
    
    setDesignCode(selectedCode); 
    setIsDropdownOpen(false); 
    setHighlightedIndex(-1);
    
    try {
      console.log(`🚀 [API CALL] Fetching Details for: ${selectedCode}`);
      const res = await axios.get(`${apiUrl}/dsgcd/${selectedCode}`);
      const newData = (res.data.success && res.data.data.length > 0) ? res.data.data[0] : item;
      setFormData(prev => ({ ...prev, ...newData, DmTcTyp: prev.DmTcTyp }));
    } catch (err) {
      console.error("Detail Fetch Error", err);
      setFormData(prev => ({ ...prev, ...item, DmTcTyp: prev.DmTcTyp }));
    }
  };

  return (
    <AppLayout>
      <SearchHeader
        formData={formData} handleChange={handleChange} handleKeyDown={handleKeyDown}
        resultsRef={resultsRef} highlightedIndex={highlightedIndex} setHighlightedIndex={setHighlightedIndex}
        // Search Props
        designCode={designCode} setDesignCode={setDesignCode} isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}
        dsgData={dsgData} handleSelect={handleSelect} loadMoreDesigns={loadMoreDesigns} hasMore={hasMore} page={page}
        // Cat Props
        catData={catData} isCatDropdownOpen={isCatDropdownOpen} setIsCatDropdownOpen={setIsCatDropdownOpen} handleCatSelect={handleCatSelect}
        designInputRef={designInputRef}
     />
      <TabForm
        activeTab={activeTab} setActiveTab={setActiveTab}
        formData={formData} handleChange={handleChange}
      />
    </AppLayout>
  );
}

export default App;
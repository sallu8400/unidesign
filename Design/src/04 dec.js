// import './App.css';
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function App() {
//   const [activeTab, setActiveTab] = useState('1');

//   // --- Form Data State ---
//   const [formData, setFormData] = useState({
//     DmTcTyp: "", // Category Code
//     DmSz: "", DmCtg: "", Dm: "", DmDesc: "", DmLockYN: "N", DmValidCoCd: "",
//     DmPrdCtg: "", DmSalCtg: "", DmSalCtg2: "", DmSalCtg3: "",
//     DmLsCtg: "", DmKt: "", DmVaCtg: "",
//     DmSetCd: "", DmOldCd: "", DmBagPcs: 0,
//     DmParts: 0, DmPartDesc: "", DmCol: "",
//     DmHld: "N", DmHldDesc: "",
//     DmDefSz: "", DmPrdInst: "",
//     DmPrcsSeq: "", DmPrdSeq: "", DmDsgBy: "", DmCreatedDt: "",
//     DmPrfVendCd: "", ModUsr: "", ModDt: "",
//     DmDsgDt: "", DmSrcDsgCd: "",
//     DmModMkr: "", DmModRunWt: 0,
//     DmWaxWt: 0, DmSilModWt: 0, DmCasPcWt: 0, DmTotDiaWt: 0
//   });

//   // --- States ---
//   const [dsgData, setDsgData] = useState([]); 
//   const [designCode, setDesignCode] = useState(""); 
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

//   const [catData, setCatData] = useState([]); 
//   const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

//   useEffect(() => {
//     fetchCatList();
//     fetchDsgList(); 
//   }, []);

//   // --- Search Logic for Design Code (2nd Input) ---
//   useEffect(() => {
//     const delaySearch = setTimeout(() => {
//       if (designCode && isDropdownOpen) {
//         fetchSearchResults(designCode);
//       }
//     }, 500); 
//     return () => clearTimeout(delaySearch);
//   }, [designCode, isDropdownOpen]);

//   // --- Search Logic for Category (1st Input) ---
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


//   // --- API Functions ---

//   const fetchSearchResults = async (searchText) => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/users/search?text=${searchText}`);
//       const dataToSet = res.data.data ? res.data.data : res.data;
//       setDsgData(dataToSet);
//     } catch (err) {
//       console.error("Search API Error:", err);
//       setDsgData([]); 
//     }
//   };

//   const fetchCatSearchResults = async (searchText) => {
//     try {
//       console.log(`Searching Category for: ${searchText}`);
//       const res = await axios.get(`http://localhost:5000/api/users/search-dmctg?text=${searchText}`);
      
//       // Fixed: Ensure we set the array correctly based on your API response structure
//       const dataToSet = res.data.data ? res.data.data : res.data;
//       setCatData(dataToSet);
//     } catch (err) {
//       console.error("Category Search API Error:", err);
//       setCatData([]); 
//     }
//   };

//   const fetchDsgList = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/users/dsgcd");
//       const dataToSet = res.data.data ? res.data.data : res.data;
//       setDsgData(dataToSet);
//     } catch (err) {
//       console.error("List API Error:", err);
//     }
//   };

//   const fetchCatList = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/users/dsgcat");
//       const dataToSet = res.data.data ? res.data.data : res.data; 
//       setCatData(dataToSet);
//     } catch (err) {
//       console.error("Category API Error:", err);
//     }
//   };
  
//   const fetchDesignsByCategory = async (category) => {
//     if (!category) return;
//     try {
//       const res = await axios.get(`http://localhost:5000/api/users/dsgcat-by-ctg?dmctg=${category}`);
//       const dataToSet = res.data.data ? res.data.data : res.data;
//       setDsgData(dataToSet);
//     } catch (err) {
//       console.error("Filtered Design API Error:", err);
//       setDsgData([]);
//     }
//   };

//   // --- Handlers ------------------------------

//   const handleCatSelect = (item) => {
//     // FIX: Accessing 'DmCtg' instead of 'dmctg'
//     const categoryValue = item.DmCtg || item.dmctg; 
    
//     setFormData(prev => ({ ...prev, DmTcTyp: categoryValue }));
//     setIsCatDropdownOpen(false);
//     setDesignCode(""); 
//     setDsgData([]); 
//     fetchDesignsByCategory(categoryValue);
//   };

//   const handleSelect = async (item) => {
//     const selectedCode = item.DmCd;
//     setDesignCode(selectedCode); 
//     setIsDropdownOpen(false);    
  
//     try {
//       const res = await axios.get(`http://localhost:5000/api/users/dsgcd/${selectedCode}`);
//       let newData = {};
//       if (res.data.success && res.data.data.length > 0) {
//          newData = res.data.data[0];
//       } else {
//          newData = item;
//       }
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
//                 onFocus={() => setIsCatDropdownOpen(true)}
//                 onBlur={() => setTimeout(() => setIsCatDropdownOpen(false), 200)}
//                 autoComplete="off"
//                 placeholder="Ctg"
//               />
              
//               {isCatDropdownOpen && catData.length > 0 && (
//                 <div className="dropdown-table" style={{width: '150px'}}>
//                   <div className="grid-row grid-header">
//                     <div className="grid-cell" style={{flex: 1}}>Category</div>
//                   </div>
//                   <div className="grid-body">
//                     {catData.map((row, index) => (
//                       <div 
//                         key={index} 
//                         className="grid-row"
//                         onMouseDown={() => handleCatSelect(row)} 
//                       >
//                         {/* FIX: Using 'DmCtg' property from API response */}
//                         <div className="grid-cell" style={{flex: 1}}>
//                             {row.DmCtg || row.dmctg}
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
//                 onFocus={() => setIsDropdownOpen(true)}
//                 onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
//                 autoComplete="off"
//                 placeholder="Select Design"
//               />
              
//               {isDropdownOpen && dsgData.length > 0 && (
//                 <div className="dropdown-table">
//                   <div className="grid-row grid-header">
//                     <div className="grid-cell" style={{width: '120px'}}>Design</div>
//                     <div className="grid-cell" style={{width: '60px'}}>Size</div>
//                     <div className="grid-cell" style={{width: '60px'}}>Dsg Ct</div>
//                     <div className="grid-cell" style={{flex: 1}}>Description</div>
//                   </div>
//                   <div className="grid-body">
//                     {dsgData.map((row, index) => (
//                       <div 
//                         key={index} 
//                         className="grid-row"
//                         onMouseDown={() => handleSelect(row)}
//                       >
//                         <div className="grid-cell" style={{width: '120px'}}>{row.DmCd}</div>
//                         <div className="grid-cell" style={{width: '60px'}}>{row.DmSz}</div>
//                         <div className="grid-cell" style={{width: '60px'}}>{row.DmCtg}</div>
//                         <div className="grid-cell" style={{flex: 1}}>{row.DmDesc}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Rest of the form inputs... */}
//           <label>Sz</label>
//           <input type="text" className="w-sm" name="DmSz" value={formData.DmSz || ''} onChange={handleChange} />

//           <label>Ctg</label>
//           <input type="text" className="w-full" name="DmCtg" value={formData.DmCtg || ''} onChange={handleChange} />
//           <label>Uom</label>
//           <input type="text" className="w-sm" name="DmUom" value={formData.DmUom || ''} onChange={handleChange} />

//           {/* ... [Rest of the JSX remains the same] ... */}
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
//       </div>
//     </div>
//   );
// }

// export default App;

///  ------------------------2-----------------------------------

// import './App.css';
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";

// function App() {
//   const [activeTab, setActiveTab] = useState('1');

//   // --- Form Data State ---
//   const [formData, setFormData] = useState({
//     DmTcTyp: "", // Category Code
//     DmSz: "", DmCtg: "", DmUom: "", DmDesc: "", DmLockYN: "N", DmValidCoCd: "",
//     DmPrdCtg: "", DmSalCtg: "", DmSalCtg2: "", DmSalCtg3: "",
//     DmLsCtg: "", DmKt: "", DmVaCtg: "",
//     DmSetCd: "", DmOldCd: "", DmBagPcs: 0,
//     DmParts: 0, DmPartDesc: "", DmCol: "",
//     DmHld: "N", DmHldDesc: "",
//     DmDefSz: "", DmPrdInst: "",
//     DmPrcsSeq: "", DmPrdSeq: "", DmDsgBy: "", DmCreatedDt: "",
//     DmPrfVendCd: "", ModUsr: "", ModDt: "",
//     DmDsgDt: "", DmSrcDsgCd: "",
//     DmModMkr: "", DmModRunWt: 0,
//     DmWaxWt: 0, DmSilModWt: 0, DmCasPcWt: 0, DmTotDiaWt: 0
//   });

//   // --- States ---
//   const [dsgData, setDsgData] = useState([]); 
//   const [designCode, setDesignCode] = useState(""); 
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

//   const [catData, setCatData] = useState([]); 
//   const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

//   // --- NEW: Keyboard Navigation State ---
//   const [highlightedIndex, setHighlightedIndex] = useState(-1);
//   const resultsRef = useRef(null);

//   useEffect(() => {
//     fetchCatList();
//     fetchDsgList(); 
//   }, []);

//   // --- Reset Highlight when data changes ---
//   useEffect(() => {
//     setHighlightedIndex(-1);
//   }, [dsgData, catData]);

//   // --- Search Logic for Design Code (2nd Input) ---
//   useEffect(() => {
//     const delaySearch = setTimeout(() => {
//       if (designCode && isDropdownOpen) {
//         fetchSearchResults(designCode);
//       }
//     }, 500); 
//     return () => clearTimeout(delaySearch);
//   }, [designCode, isDropdownOpen]);

//   // --- Search Logic for Category (1st Input) ---
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


//   // --- API Functions ---
//   const fetchSearchResults = async (searchText) => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/users/search?text=${searchText}`);
//       const dataToSet = res.data.data ? res.data.data : res.data;
//       setDsgData(dataToSet);
//     } catch (err) {
//       console.error("Search API Error:", err);
//       setDsgData([]); 
//     }
//   };

//   const fetchCatSearchResults = async (searchText) => {
//     try {
//       console.log(`Searching Category for: ${searchText}`);
//       const res = await axios.get(`http://localhost:5000/api/users/search-dmctg?text=${searchText}`);
//       const dataToSet = res.data.data ? res.data.data : res.data;
//       setCatData(dataToSet);
//     } catch (err) {
//       console.error("Category Search API Error:", err);
//       setCatData([]); 
//     }
//   };

//   const fetchDsgList = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/users/dsgcd");
//       const dataToSet = res.data.data ? res.data.data : res.data;
//       setDsgData(dataToSet);
//     } catch (err) {
//       console.error("List API Error:", err);
//     }
//   };

//   const fetchCatList = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/users/dsgcat");
//       const dataToSet = res.data.data ? res.data.data : res.data; 
//       setCatData(dataToSet);
//     } catch (err) {
//       console.error("Category API Error:", err);
//     }
//   };
  
//   const fetchDesignsByCategory = async (category) => {
//     if (!category) return;
//     try {
//       const res = await axios.get(`http://localhost:5000/api/users/dsgcat-by-ctg?dmctg=${category}`);
//       const dataToSet = res.data.data ? res.data.data : res.data;
//       setDsgData(dataToSet);
//     } catch (err) {
//       console.error("Filtered Design API Error:", err);
//       setDsgData([]);
//     }
//   };

//   // --- Handlers ------------------------------

//   // NEW: Generic Key Down Handler
//   const handleKeyDown = (e, data, selectCallback) => {
//     if (!data || data.length === 0) return;

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setHighlightedIndex((prev) => (prev < data.length - 1 ? prev + 1 : prev));
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
//     const categoryValue = item.DmCtg || item.dmctg; 
//     setFormData(prev => ({ ...prev, DmTcTyp: categoryValue }));
//     setIsCatDropdownOpen(false);
//     setHighlightedIndex(-1); // Reset
//     setDesignCode(""); 
//     setDsgData([]); 
//     fetchDesignsByCategory(categoryValue);
//   };

//   const handleSelect = async (item) => {
//     const selectedCode = item.DmCd;
//     setDesignCode(selectedCode); 
//     setIsDropdownOpen(false);    
//     setHighlightedIndex(-1); // Reset
  
//     try {
//       const res = await axios.get(`http://localhost:5000/api/users/dsgcd/${selectedCode}`);
//       let newData = {};
//       if (res.data.success && res.data.data.length > 0) {
//          newData = res.data.data[0];
//       } else {
//          newData = item;
//       }
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
//       {/* UPDATED STYLE: Text color set to YELLOW (#FFFF00) */}
//       <style>{`
//         .active-row {
//         color: #132f4a;
//     background: #fffbc8 !important
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
//                   setHighlightedIndex(-1); // Reset index on focus
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
//                         // Add active-row class if index matches
//                         className={`grid-row ${index === highlightedIndex ? 'active-row' : ''}`}
//                         onMouseDown={() => handleCatSelect(row)} 
//                         // Auto-scroll logic
//                         ref={(el) => (index === highlightedIndex && el) ? el.scrollIntoView({ block: 'nearest' }) : null}
//                       >
//                         <div className="grid-cell" style={{flex: 1}}>
//                             {row.DmCtg || row.dmctg}
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
//                   setHighlightedIndex(-1); // Reset index on focus
//                 }}
//                 onKeyDown={(e) => handleKeyDown(e, dsgData, handleSelect)}
//                 onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
//                 autoComplete="off"
//                 placeholder="Select Design"
//               />
//               {console.log(dsgData,"dsgData")}
//               {isDropdownOpen && dsgData.length > 0 && (
//                 <div className="dropdown-table" ref={resultsRef}>
//                   <div className="grid-row grid-header">
//                     <div className="grid-cell" style={{width: '120px'}}>Design</div>
//                     <div className="grid-cell" style={{width: '60px'}}>Size</div>
//                     <div className="grid-cell" style={{width: '60px'}}>Dsg Ct</div>
//                     <div className="grid-cell" style={{flex: 1}}>Description</div>
//                   </div>
//                   <div className="grid-body">
//                     {dsgData.map((row, index) => (
//                       <div 
//                         key={index} 
//                         // Add active-row class if index matches
//                         className={`grid-row ${index === highlightedIndex ? 'active-row' : ''}`}
//                         onMouseDown={() => handleSelect(row)}
//                         // Auto-scroll logic
//                         ref={(el) => (index === highlightedIndex && el) ? el.scrollIntoView({ block: 'nearest' }) : null}
//                       >
//                         <div className="grid-cell" style={{width: '120px'}}>{row.DmCd}</div>
//                         <div className="grid-cell" style={{width: '60px'}}>{row.DmSz}</div>
//                         <div className="grid-cell" style={{width: '60px'}}>{row.DmCtg}</div>
//                         <div className="grid-cell" style={{flex: 1}}>{row.DmDesc}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Rest of the form inputs... */}
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
//       </div>
//     </div>
//   );
// }

// export default App;


///--------------------------3333333333333333333-------------------------

// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import InfiniteScroll from "react-infinite-scroll-component";

// function App() {
//   const [designs, setDesigns] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [isOpen, setIsOpen] = useState(false); // Dropdown khulne/band hone ke liye
//   const [selectedItem, setSelectedItem] = useState(null); // Jo item select kiya

//   const LIMIT = 50; // Ek baar mein 50 items mangayenge

//   // Data Fetching Function
//   const fetchDesigns = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/users/scroll-testing", {
//         params: { page: page, limit: LIMIT, search: "" }
//       });

//       const newData = res.data;

//       // Agar data LIMIT se kam aaya, matlab aage aur data nahi hai
//       if (newData.length < LIMIT) {
//         setHasMore(false);
//       }

//       setDesigns(prev => [...prev, ...newData]);
//       setPage(prev => prev + 1);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // First load
//   useEffect(() => {
//     fetchDesigns();
//   }, []);

//   // Dropdown open/close handler
//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   // Item select handler
//   const handleSelect = (item) => {
//     setSelectedItem(item);
//     setIsOpen(false); // Select karne ke baad dropdown band karein
//     console.log("Selected ID:", item.DmCd); // Backend ID
//   };

//   return (
//     <div style={{ width: "400px", margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
//       <h3>Big Data Dropdown (3.9 Lakh Records)</h3>
      
//       {/* 1. THE DROPDOWN HEADER (Jo dikhta hai band hone par) */}
//       <div 
//         onClick={toggleDropdown}
//         style={{
//           border: "1px solid #ccc",
//           padding: "10px",
//           borderRadius: "4px",
//           cursor: "pointer",
//           background: "#fff",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center"
//         }}
//       >
//         <span>
//           {selectedItem ? `${selectedItem.DmDesc} (${selectedItem.DmCtg})` : "-- Select Design --"}
//         </span>
//         <span style={{ fontSize: "12px" }}>▼</span>
//       </div>

//       {/* 2. THE DROPDOWN LIST (Jo click karne par khulta hai) */}
//       {isOpen && (
//         <div 
//           id="scrollableDiv"
//           style={{
//             border: "1px solid #ccc",
//             borderTop: "none",
//             maxHeight: "300px", // Height fix rakhein scroll ke liye
//             overflowY: "auto",
//             borderRadius: "0 0 4px 4px",
//             boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//             position: "absolute", // Taaki content ke upar aaye
//             width: "400px",
//             zIndex: 1000,
//             background: "#fff"
//           }}
//         >
//           <InfiniteScroll
//             dataLength={designs.length}
//             next={fetchDesigns}
//             hasMore={hasMore}
//             loader={<h5 style={{ textAlign: "center", margin: "5px" }}>Loading...</h5>}
//             scrollableTarget="scrollableDiv" // ID match honi chahiye parent div se
//             endMessage={<p style={{ textAlign: "center", fontSize: "12px" }}>End of list</p>}
//           >
//             <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
//               {designs.map((d, index) => (
//                 <li
//                   key={`${d.DmCd}-${index}`} // Unique key
//                   onClick={() => handleSelect(d)}
//                   style={{
//                     padding: "10px",
//                     borderBottom: "1px solid #f0f0f0",
//                     cursor: "pointer",
//                     background: selectedItem?.DmCd === d.DmCd ? "#e6f7ff" : "white"
//                   }}
//                   onMouseEnter={(e) => e.currentTarget.style.background = "#f9f9f9"}
//                   onMouseLeave={(e) => e.currentTarget.style.background = selectedItem?.DmCd === d.DmCd ? "#e6f7ff" : "white"}
//                 >
//                   <strong>{d.DmDesc}</strong>
//                   <div style={{ fontSize: "12px", color: "#666" }}>Category: {d.DmCtg} | Code: {d.DmCd}</div>
//                 </li>
//               ))}
//             </ul>
//           </InfiniteScroll>
//         </div>
//       )}

//       <p style={{ marginTop: "20px" }}>Selected Value: {selectedItem ? selectedItem.DmCd : "None"}</p>
//     </div>
//   );
// }

// export default App;
////--------------------4-------------------


// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import './App.css';
// import InfiniteScroll from "react-infinite-scroll-component"; // Ye library install honi chahiye: npm i react-infinite-scroll-component

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
//   const [page, setPage] = useState(1);         // Current Page Number
//   const [hasMore, setHasMore] = useState(true); // Kya aur data bacha hai?

//   // --- States for Category Dropdown ---
//   const [catData, setCatData] = useState([]); 
//   const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

//   // --- Keyboard Navigation State ---
//   const [highlightedIndex, setHighlightedIndex] = useState(-1);
//   const resultsRef = useRef(null);

//   // --- Initial Load ---
//   useEffect(() => {
//     fetchCatList();
//     loadMoreDesigns(); // Start loading first 50 designs
//     // eslint-disable-next-line
//   }, []);

//   // --- Reset Highlight when data changes ---
//   useEffect(() => {
//     setHighlightedIndex(-1);
//   }, [dsgData, catData]);

//   // --- Search Logic for Design Code (Hybrid: Scroll vs Search) ---
//   useEffect(() => {
//     const delaySearch = setTimeout(() => {
//       // Agar user ne kuch type kiya hai -> Search API call karein
//       if (designCode.trim() !== "" && isDropdownOpen) {
//         fetchSearchResults(designCode);
//       } 
//       // Agar input khali kar diya -> Wapas Infinite Scroll mode (Page 1)
//       else if (designCode === "" && isDropdownOpen && !hasMore) {
//          setPage(1);
//          setHasMore(true);
//          setDsgData([]); 
//          loadMoreDesigns(1);
//       }
//     }, 500); 
//     return () => clearTimeout(delaySearch);
//   }, [designCode, isDropdownOpen]);

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

//   // 1. Infinite Scroll Fetcher (Modified)
//   const loadMoreDesigns = async (currentPage = page) => {
//     try {
//       // Backend Endpoint must support pagination (page & limit)
//       const res = await axios.get("http://localhost:5000/api/users/scroll-testing", {
//         params: { page: currentPage, limit: 50, search: "" }
//       });

//       const newData = res.data;

//       if (newData.length < 50) {
//         setHasMore(false); // Aur data nahi hai
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

//   // 2. Search Fetcher
//   const fetchSearchResults = async (searchText) => {
//     try {
//       setHasMore(false); // Search mode me scroll band kar do
//       const res = await axios.get(`http://localhost:5000/api/users/search?text=${searchText}`);
//       const dataToSet = res.data.data ? res.data.data : res.data;
//       setDsgData(dataToSet);
//     } catch (err) {
//       console.error("Search API Error:", err);
//       setDsgData([]); 
//     }
//   };

//   // 3. Category APIs
//   const fetchCatSearchResults = async (searchText) => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/users/search-dmctg?text=${searchText}`);
//       const dataToSet = res.data.data ? res.data.data : res.data;
//       setCatData(dataToSet);
//     } catch (err) {
//       console.error("Category Search Error:", err);
//       setCatData([]); 
//     }
//   };

//   const fetchCatList = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/users/dsgcat");
//       const dataToSet = res.data.data ? res.data.data : res.data; 
//       setCatData(dataToSet);
//     } catch (err) {
//       console.error("Category API Error:", err);
//     }
//   };
  
//   const fetchDesignsByCategory = async (category) => {
//     if (!category) return;
//     // Category select karne par filter lagayein
//     setDesignCode("");
//     setHasMore(false); // Category filtering me scroll logic complex ho sakta hai, abhi ke liye direct load
//     try {
//       const res = await axios.get(`http://localhost:5000/api/users/dsgcat-by-ctg?dmctg=${category}`);
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
      
//       // Auto Scroll dropdown to highlighted item
//       if(resultsRef.current) {
//           const rowHeight = 30; // Approx row height
//           // Simple scroll adjustment
//           // Better logic handles inside map ref
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
//     const categoryValue = item.DmCtg || item.dmctg; 
//     setFormData(prev => ({ ...prev, DmTcTyp: categoryValue }));
//     setIsCatDropdownOpen(false);
//     setHighlightedIndex(-1);
//     setDesignCode(""); 
//     setDsgData([]); 
//     fetchDesignsByCategory(categoryValue);
//   };

//   const handleSelect = async (item) => {
//     const selectedCode = item.DmCd;
//     setDesignCode(selectedCode); 
//     setIsDropdownOpen(false);    
//     setHighlightedIndex(-1);
  
//     try {
//       const res = await axios.get(`http://localhost:5000/api/users/dsgcd/${selectedCode}`);
//       let newData = {};
//       if (res.data.success && res.data.data.length > 0) {
//          newData = res.data.data[0];
//       } else {
//          newData = item;
//       }
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
//         /* Custom Scrollbar for dropdown */
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
//                             {row.DmCtg || row.dmctg}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             <span>/</span>
            
//             {/* INPUT 2: DESIGN SELECTION WITH INFINITE SCROLL */}
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
//                   // Load data if empty
//                   if(dsgData.length === 0) loadMoreDesigns(1);
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
//                   style={{ width: '450px', display: 'flex', flexDirection: 'column' }} // Width badhayi taaki data dikhe
//                 >
//                   <div className="grid-row grid-header">
//                     <div className="grid-cell" style={{width: '120px'}}>Design</div>
//                     <div className="grid-cell" style={{width: '60px'}}>Size</div>
//                     <div className="grid-cell" style={{width: '60px'}}>Ctg</div>
//                     <div className="grid-cell" style={{flex: 1}}>Description</div>
//                   </div>

//                   {/* SCROLLABLE DIV FOR INFINITE SCROLL */}
//                   <div 
//                     id="designScrollDiv" // IMPORTANT: Ye ID infinite scroll target karega
//                     className="grid-body"
//                     style={{ maxHeight: '250px', overflowY: 'auto', overflowX: 'hidden' }}
//                   >
//                      <InfiniteScroll
//                         dataLength={dsgData.length}
//                         next={() => loadMoreDesigns(page)}
//                         hasMore={designCode ? false : hasMore} // Search hai to infinite scroll off
//                         loader={<h5 style={{textAlign:'center', margin:'5px'}}>Loading...</h5>}
//                         scrollableTarget="designScrollDiv" // ID Match honi chahiye
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
//                          {dsgData.length === 0 && !hasMore && (
//                             <div style={{padding: '10px', textAlign: 'center'}}>No Designs Found</div>
//                         )}
//                     </InfiniteScroll>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Rest of the form inputs... */}
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
import './App.css';
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [activeTab, setActiveTab] = useState('1');

  // --- 1. Form Data State (Saare fields ko store karne ke liye) ---
  const [formData, setFormData] = useState({
    DmSz: "", DmCtg: "", DmUom: "", DmDesc: "", DmLockYN: "N", DmValidCoCd: "",
    DmPrdCtg: "", DmSalCtg: "", DmSalCtg2: "", DmSalCtg3: "",
    DmLsCtg: "", DmKt: "", DmVaCtg: "",
    DmSetCd: "", DmOldCd: "", DmBagPcs: 0,
    DmParts: 0, DmPartDesc: "", DmCol: "",
    DmHld: "N", DmHldDesc: "",
    DmDefSz: "", DmPrdInst: "",
    DmPrcsSeq: "", DmPrdSeq: "", DmDsgBy: "", DmCreatedDt: "",
    DmPrfVendCd: "", ModUsr: "", ModDt: "",
    DmDsgDt: "", DmSrcDsgCd: "",
    DmModMkr: "", DmModRunWt: 0,
    DmWaxWt: 0, DmSilModWt: 0, DmCasPcWt: 0, DmTotDiaWt: 0
  });

  // --- Dropdown States ---
  const [dsgData, setDsgData] = useState([]); 
  const [designCode, setDesignCode] = useState(""); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 

  // Initial List Load
  useEffect(() => {
    fetchDsgList();
  }, []);

  const fetchDsgList = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/dsgcd");
      const dataToSet = res.data.data ? res.data.data : res.data;
      setDsgData(dataToSet);
    } catch (err) {
      console.error("List API Error:", err);
    }
  };

  // --- 2. Select hone par Details Fetch karna ---
  const handleSelect = async (item) => {
    const selectedCode = item.DmCd;
    setDesignCode(selectedCode); // Input box update
    setIsDropdownOpen(false);    // Close dropdown

    try {
      // Specific Product API Call
      const res = await axios.get(`http://localhost:5000/api/users/dsgcd/${selectedCode}`);
      
      if (res.data.success && res.data.data.length > 0) {
        const details = res.data.data[0];
        console.log("Details Fetched:", details);
        
        // State update with new data
        setFormData(details);
      }
    } catch (err) {
      console.error("Details API Error:", err);
    }
  };

  // Input Change Handler (Agar user edit karna chahe)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'Y' : 'N') : value
    }));
  };

  return (
    <div className="window-container">
      {/* Menu Bar */}
      <div className="menu-bar">
        <div className="menu-item"><span>P</span>arameters</div>
        <div className="menu-item"><span>M</span>asters</div>
        <div className="menu-item"><span>T</span>ransactions</div>
        <div className="menu-item"><span>R</span>eports</div>
        <div className="menu-item">AddOn Menus</div>
        <div className="menu-item"><span>W</span>indow</div>
        <div className="menu-item"><span>Q</span>uit</div>
      </div>

      <div className="form-section">
        
        {/* Header Fields */}
        <div className="header-grid">
          {/* Row 1: Dropdown Logic */}
          <label>Dsg Ctg/Cd</label>
          <div className="flex-split">
            <input type="text" className="w-xs" />
            <span>/</span>
            
            <div className="input-wrapper" style={{position: 'relative', display: 'inline-block'}}>
              <input 
                type="text" 
                className="w-md" 
                value={designCode}
                onChange={(e) => setDesignCode(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                autoComplete="off"
                placeholder="Select Design"
              />
              
              {isDropdownOpen && dsgData.length > 0 && (
                <div className="dropdown-table">
                  <div className="grid-row grid-header">
                    <div className="grid-cell" style={{width: '120px'}}>Design</div>
                    <div className="grid-cell" style={{flex: 1}}>Description</div>
                  </div>
                  <div className="grid-body">
                    {dsgData.map((row, index) => (
                      <div 
                        key={index} 
                        className="grid-row"
                        onMouseDown={() => handleSelect(row)}
                      >
                        <div className="grid-cell" style={{width: '120px'}}>{row.DmCd}</div>
                        <div className="grid-cell" style={{flex: 1}}>{row.DmDesc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* --- 3. Input Binding starts here --- */}
          <label>Sz</label>
          <input type="text" className="w-sm" name="DmSz" value={formData.DmSz || ''} onChange={handleChange} />

          {/* Row 2 */}
          <label>Ctg</label>
          <input type="text" className="w-full" name="DmCtg" value={formData.DmCtg || ''} onChange={handleChange} />
          <label>Uom</label>
          <input type="text" className="w-sm" name="DmUom" value={formData.DmUom || ''} onChange={handleChange} />

          {/* Row 3 */}
          <div className="full-row" style={{alignItems: 'center'}}>
            <label style={{minWidth: '65px'}}>Desc</label>
            <input type="text" className="w-full" name="DmDesc" value={formData.DmDesc || ''} onChange={handleChange} />
          </div>

          {/* Row 4 */}
          <div className="full-row" style={{alignItems: 'center'}}>
            <label style={{minWidth: '65px'}}>Dsg Lock</label>
            <button className="disabled" style={{width: '80px', textAlign:'center'}}>Password</button>
            <input type="password" className="w-md" name="DmLockYN" value={formData.DmLockYN || ''} readOnly />
          </div>

          {/* Row 5 */}
           <div className="full-row" style={{alignItems: 'center'}}>
            <label style={{minWidth: '65px'}}>Valid Co Cds</label>
            <input type="text" className="w-full" name="DmValidCoCd" value={formData.DmValidCoCd || ''} onChange={handleChange} />
          </div>
        </div>

     <div className="tabs">
        <div className={`tab ${activeTab === '1' ? 'active' : ''}`} onClick={() => setActiveTab('1')}>&lt;1&gt; General</div>
        {/* Other tabs... */}
        <div className={`tab ${activeTab === '2' ? 'active' : ''}`} onClick={() => setActiveTab('2')}>&lt;2&gt; BOM</div>
        <div className={`tab ${activeTab === '3' ? 'active' : ''}`} onClick={() => setActiveTab('3')}>&lt;3&gt; Lab</div>
        <div className={`tab ${activeTab === '4' ? 'active' : ''}`} onClick={() => setActiveTab('4')}>&lt;4&gt; Analysis</div>
        <div className={`tab ${activeTab === '5' ? 'active' : ''}`} onClick={() => setActiveTab('5')}>&lt;5&gt; History</div>
        <div className={`tab ${activeTab === '6' ? 'active' : ''}`} onClick={() => setActiveTab('6')}>&lt;6&gt; Faults</div>
        <div className={`tab ${activeTab === 'a' ? 'active' : ''}`} onClick={() => setActiveTab('a')}>&lt;a&gt; Images</div>
      </div>

      <div className="tab-content">
        {/* --- TAB 1: GENERAL --- */}
        {activeTab === '1' && (
          <>
            <label>Prd Ctg</label>
            <input type="text" className="w-sm" name="DmPrdCtg" value={formData.DmPrdCtg || ''} onChange={handleChange} />
            
            <label>Sales Ctg</label>
            <div className="flex-split">
              <input type="text" className="w-sm" name="DmSalCtg" value={formData.DmSalCtg || ''} onChange={handleChange} />
              <label>Sales Ctg2</label>
              <input type="text" className="w-sm" name="DmSalCtg2" value={formData.DmSalCtg2 || ''} onChange={handleChange} />
              <label>Sales Ctg3</label>
              <input type="text" className="w-sm" name="DmSalCtg3" value={formData.DmSalCtg3 || ''} onChange={handleChange} />
            </div>

            <label>Loss Ctg</label>
            <input type="text" className="w-sm" name="DmLsCtg" value={formData.DmLsCtg || ''} onChange={handleChange} />
            
            <label>Karat</label>
            <div className="grid-item-right">
               <input type="text" className="w-sm" name="DmKt" value={formData.DmKt || ''} onChange={handleChange} />
               <label style={{marginLeft:'20px'}}>Val Addn Ctg</label>
               <input type="text" className="w-sm" name="DmVaCtg" value={formData.DmVaCtg || ''} onChange={handleChange} />
            </div>

            <label>Set Family Cd</label>
            <input type="text" className="w-md" name="DmSetCd" value={formData.DmSetCd || ''} onChange={handleChange} />
            
            <label>Old Cd</label>
            <div className="grid-item-right" style={{width:'100%', justifyContent:'space-between'}}>
              <input type="text" className="w-md" name="DmOldCd" value={formData.DmOldCd || ''} onChange={handleChange} />
              <div style={{display:'flex', gap: '5px', alignItems:'center'}}>
                 <label>Bag Pcs</label>
                 <input type="text" className="w-xs text-right" name="DmBagPcs" value={formData.DmBagPcs || 0} onChange={handleChange} />
              </div>
            </div>

            <label>Parts</label>
            <input type="text" className="w-xs text-right" name="DmParts" value={formData.DmParts || 0} onChange={handleChange} />
            
            <label>Part Desc</label>
            <div className="grid-item-right" style={{width:'100%'}}>
               <input type="text" style={{flex:1}} name="DmPartDesc" value={formData.DmPartDesc || ''} onChange={handleChange} />
               <label>Colour</label>
               <input type="text" className="w-sm" name="DmCol" value={formData.DmCol || ''} onChange={handleChange} />
            </div>

            <label>On Hold</label>
            <input type="checkbox" name="DmHld" checked={formData.DmHld === 'Y'} onChange={handleChange} />
            
            <label>Holding Desc</label>
            <input type="text" className="w-full" name="DmHldDesc" value={formData.DmHldDesc || ''} onChange={handleChange} />

            <label>Default Size</label>
            <input type="text" className="w-sm" name="DmDefSz" value={formData.DmDefSz || ''} onChange={handleChange} />
            
            <label style={{gridRow: 'span 2', alignSelf:'start'}}>Prd Instruction</label>
            <textarea 
              style={{gridRow: 'span 2', height: '45px', width: '100%', resize:'none'}} 
              name="DmPrdInst" 
              value={formData.DmPrdInst || ''} 
              onChange={handleChange}
            ></textarea>

            <label>Prc Seq</label>
            <input type="text" className="w-full" name="DmPrcsSeq" value={formData.DmPrcsSeq || ''} onChange={handleChange} />
            
            <label>Prd Seq</label>
            <input type="text" className="w-full" name="DmPrdSeq" value={formData.DmPrdSeq || ''} onChange={handleChange} />
            
            <label>Designed By</label>
            <div className="grid-item-right">
               <input type="text" className="w-md" name="DmDsgBy" value={formData.DmDsgBy || ''} onChange={handleChange} />
               <label style={{marginLeft: 'auto'}}>Created Date</label>
               {/* Date ko thoda clean dikhane ke liye slice kar rahe hain */}
               <input type="text" className="w-sm" style={{backgroundColor: '#808080', color: 'white'}} 
                 value={formData.DmCreatedDt ? formData.DmCreatedDt.slice(0, 10) : ''} readOnly 
               />
            </div>

            <label>Pref Vendor</label>
            <input type="text" className="w-md" name="DmPrfVendCd" value={formData.DmPrfVendCd || ''} onChange={handleChange} />
            
            <label>Last Modified</label>
            <input type="text" className="w-full" readOnly 
              value={`${formData.ModUsr || ''} / ${formData.ModDt ? formData.ModDt.slice(0, 10) : ''}`} 
            />

            <label>Design Date</label>
            <input type="text" className="w-sm" placeholder="//" name="DmDsgDt" value={formData.DmDsgDt ? formData.DmDsgDt.slice(0, 10) : ''} onChange={handleChange} />
            
            <label>Source Sketch</label>
            <div className="grid-item-right">
               <input type="text" className="w-md" name="DmSrcDsgCd" value={formData.DmSrcDsgCd || ''} onChange={handleChange} />
               <label>/ Dsg Cd</label>
            </div>

            <label>Model Maker</label>
            <input type="text" className="w-full" name="DmModMkr" value={formData.DmModMkr || ''} onChange={handleChange} />
            
            <label>Model Wt With Runner</label>
            <input type="text" className="w-sm text-right" name="DmModRunWt" value={formData.DmModRunWt || 0} onChange={handleChange} />

            <label>Wax Wt</label>
            <input type="text" className="w-sm text-right" name="DmWaxWt" value={formData.DmWaxWt || 0} onChange={handleChange} />
            
            <label>Silver/Model Wt</label>
            <input type="text" className="w-sm text-right" name="DmSilModWt" value={formData.DmSilModWt || 0} onChange={handleChange} />

            <label>Casting Pc Wt</label>
            <input type="text" className="w-sm text-right" name="DmCasPcWt" value={formData.DmCasPcWt || 0} onChange={handleChange} />
            <div></div> <div></div> 
            
            <label>Total Dia Wt</label>
            <input type="text" className="w-sm text-right" name="DmTotDiaWt" value={formData.DmTotDiaWt || 0} onChange={handleChange} />
            <div></div> <div></div>
          </>
        )}

        {/* Placeholders for other tabs */}
        {activeTab !== '1' && <div style={{gridColumn: '1 / -1', padding: '20px'}}>Content for Tab {activeTab}</div>}
      </div>

      <div className="action-footer">
          <div className="btn-group">
            <button>&lt;A&gt;dd</button><button>&lt;F&gt;ind</button><button>e&lt;X&gt;it</button>
          </div>
          <div className="btn-group">
            <button className="disabled">Copy</button><button className="disabled">Summary</button><button className="disabled">Copy Fg Bag</button>
          </div>
          <div className="btn-group">
            <button className="disabled">Job Card</button><button className="disabled">Mkt Card</button>
          </div>
          <div className="btn-group">
            <button className="disabled">&lt;S&gt;ave</button><button className="disabled">&lt;C&gt;lose</button><button className="disabled">&lt;D&gt;elete</button>
          </div>
      </div>
      </div>
    </div>
  );
}

export default App;
import React from "react";

const TabForm = ({ activeTab, setActiveTab, formData, handleChange }) => {
  return (
    <>
      <div className="tabs">
        {['1', '2', '3', '4', '5', '6', 'a'].map((t) => (
          <div key={t} className={`tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            &lt;{t}&gt; {t === '1' ? 'General' : t === 'a' ? 'Images' : `Tab ${t}`}
          </div>
        ))}
      </div>

      <div className="tab-content">
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
              <label style={{ marginLeft: '20px' }}>Val Addn Ctg</label>
              <input type="text" className="w-sm" name="DmVaCtg" value={formData.DmVaCtg || ''} onChange={handleChange} />
            </div>

            <label>Set Family Cd</label>
            <input type="text" className="w-md" name="DmSetCd" value={formData.DmSetCd || ''} onChange={handleChange} />

            <label>Old Cd</label>
            <div className="grid-item-right" style={{ width: '100%', justifyContent: 'space-between' }}>
              <input type="text" className="w-md" name="DmOldCd" value={formData.DmOldCd || ''} onChange={handleChange} />
              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                <label>Bag Pcs</label>
                <input type="text" className="w-xs text-right" name="DmBagPcs" value={formData.DmBagPcs || 0} onChange={handleChange} />
              </div>
            </div>

            <label>Parts</label>
            <input type="text" className="w-xs text-right" name="DmParts" value={formData.DmParts || 0} onChange={handleChange} />

            <label>Part Desc</label>
            <div className="grid-item-right" style={{ width: '100%' }}>
              <input type="text" style={{ flex: 1 }} name="DmPartDesc" value={formData.DmPartDesc || ''} onChange={handleChange} />
              <label>Colour</label>
              <input type="text" className="w-sm" name="DmCol" value={formData.DmCol || ''} onChange={handleChange} />
            </div>

            <label>On Hold</label>
            <input type="checkbox" name="DmHld" checked={formData.DmHld === 'Y'} onChange={handleChange} />

            <label>Holding Desc</label>
            <input type="text" className="w-full" name="DmHldDesc" value={formData.DmHldDesc || ''} onChange={handleChange} />

            <label>Default Size</label>
            <input type="text" className="w-sm" name="DmDefSz" value={formData.DmDefSz || ''} onChange={handleChange} />

            <label style={{ gridRow: 'span 2', alignSelf: 'start' }}>Prd Instruction</label>
            <textarea
              style={{ gridRow: 'span 2', height: '45px', width: '100%', resize: 'none' }}
              name="DmPrdInst" value={formData.DmPrdInst || ''} onChange={handleChange}
            ></textarea>

            <label>Prc Seq</label>
            <input type="text" className="w-full" name="DmPrcsSeq" value={formData.DmPrcsSeq || ''} onChange={handleChange} />

            <label>Prd Seq</label>
            <input type="text" className="w-full" name="DmPrdSeq" value={formData.DmPrdSeq || ''} onChange={handleChange} />

            <label>Designed By</label>
            <div className="grid-item-right">
              <input type="text" className="w-md" name="DmDsgBy" value={formData.DmDsgBy || ''} onChange={handleChange} />
              <label style={{ marginLeft: 'auto' }}>Created Date</label>
              <input type="text" className="w-sm" style={{ backgroundColor: '#808080', color: 'white' }}
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
        {activeTab !== '1' && <div style={{ gridColumn: '1 / -1', padding: '20px' }}>Content for Tab {activeTab}</div>}
      </div>
    </>
  );
};

export default TabForm;
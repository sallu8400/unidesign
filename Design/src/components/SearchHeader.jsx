import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const SearchHeader = ({
  formData, handleChange, handleKeyDown, resultsRef, highlightedIndex, setHighlightedIndex,
  // Design Search Props
  designCode, setDesignCode, isDropdownOpen, setIsDropdownOpen, dsgData, handleSelect, loadMoreDesigns, hasMore, page,
  // Category Search Props
  catData, isCatDropdownOpen, setIsCatDropdownOpen, handleCatSelect, designInputRef
}) => {
  return (
    <div className="header-grid">
      <label>Dsg Ctg/Cd</label>
      <div className="flex-split">
        
        {/* --- INPUT 1: CATEGORY SELECTION --- */}
        <div className="input-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
          <input
            type="text" className="w-xs" name="DmTcTyp"
            value={formData.DmTcTyp || ''}
            onChange={(e) => { handleChange(e); setIsCatDropdownOpen(true); }}
            onFocus={() => { setIsCatDropdownOpen(true); setHighlightedIndex(-1); }}
            onKeyDown={(e) => handleKeyDown(e, catData, handleCatSelect)}
            onBlur={() => setTimeout(() => setIsCatDropdownOpen(false), 200)}
            autoComplete="off" placeholder="Ctg"
          />
          
          {isCatDropdownOpen && catData.length > 0 && (
            <div className="dropdown-table" style={{ width: '150px' }} ref={resultsRef}>
              <div className="grid-row grid-header"><div className="grid-cell" style={{ flex: 1 }}>Category</div></div>
              <div className="grid-body">
                {catData.map((row, index) => (
                  <div
                    key={index} 
                    className={`grid-row ${index === highlightedIndex ? 'active-row' : ''}`}
                    onMouseDown={() => handleCatSelect(row)}
                    // 🔥 FIX: Ye line scroll control karti hai
                    ref={(el) => (index === highlightedIndex && el) ? el.scrollIntoView({ block: 'nearest' }) : null}
                  >
                    <div className="grid-cell" style={{ flex: 1 }}>{row.pmcd || row.DmCtg}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <span>/</span>

        {/* --- INPUT 2: DESIGN SELECTION (Infinite Scroll) --- */}
        <div className="input-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
          <input
           ref={designInputRef} 
            type="text" className="w-md" value={designCode}
            onChange={(e) => { setDesignCode(e.target.value); setIsDropdownOpen(true); }}
            onFocus={() => { setIsDropdownOpen(true); setHighlightedIndex(-1); if (dsgData.length === 0) loadMoreDesigns(1); }}
            onKeyDown={(e) => handleKeyDown(e, dsgData, handleSelect)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            autoComplete="off" placeholder="Select Design"
          />
          
          {isDropdownOpen && (
            <div className="dropdown-table" ref={resultsRef} style={{ width: '450px', display: 'flex', flexDirection: 'column' }}>
              <div className="grid-row grid-header">
                <div className="grid-cell" style={{ width: '120px' }}>Design</div>
                <div className="grid-cell" style={{ width: '60px' }}>Size</div>
                <div className="grid-cell" style={{ width: '60px' }}>Ctg</div>
                <div className="grid-cell" style={{ flex: 1 }}>Description</div>
              </div>
              
              <div id="designScrollDiv" className="grid-body" style={{ maxHeight: '250px', overflowY: 'auto', overflowX: 'hidden' }}>
                <InfiniteScroll
                  dataLength={dsgData.length}
                  next={() => loadMoreDesigns(page)}
                  hasMore={(!formData.DmTcTyp && !designCode) ? hasMore : false}
                  loader={<h5 style={{ textAlign: 'center', margin: '5px' }}>Loading...</h5>}
                  scrollableTarget="designScrollDiv"
                >
                  {dsgData.map((row, index) => (
                    <div
                      key={`${row.DmCd}-${index}`} 
                      className={`grid-row ${index === highlightedIndex ? 'active-row' : ''}`}
                      onMouseDown={() => handleSelect(row)} 
                      style={{ cursor: 'pointer' }}
                      // 🔥 FIX: Ye line Design dropdown ka scroll control karti hai
                      ref={(el) => (index === highlightedIndex && el) ? el.scrollIntoView({ block: 'nearest' }) : null}
                    >
                      <div className="grid-cell" style={{ width: '120px' }}>{row.DmCd}</div>
                      <div className="grid-cell" style={{ width: '60px' }}>{row.DmSz}</div>
                      <div className="grid-cell" style={{ width: '60px' }}>{row.DmCtg}</div>
                      <div className="grid-cell" style={{ flex: 1 }}>{row.DmDesc}</div>
                    </div>
                  ))}
                  {dsgData.length === 0 && <div style={{ padding: '10px', textAlign: 'center' }}>No Designs Found</div>}
                </InfiniteScroll>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Simple Header Fields --- */}
      <label>Sz</label>
      <input type="text" className="w-sm" name="DmSz" value={formData.DmSz || ''} onChange={handleChange} />

      <label>Ctg</label>
      <input type="text" className="w-full" name="DmCtg" value={formData.DmCtg || ''} onChange={handleChange} />
      <label className="">Uom</label>
      <input type="text" className="w-sm" name="DmUom" value={formData.DmUom || ''} onChange={handleChange} />

      <div className="full-row" style={{ alignItems: 'center' }}>
        <label style={{ minWidth: '65px' }}>Desc</label>
        <input type="text" className="w-full" name="DmDesc" value={formData.DmDesc || ''} onChange={handleChange} />
      </div>

      <div className="full-row" style={{ alignItems: 'center' }}>
        <label style={{ minWidth: '65px' }}>Dsg Lock</label>
             <input type="checkbox" name="DmHld" />
        <button className="disabled" style={{ width: '80px', textAlign: 'center' }}>Password</button>
        <input type="password" className="w-md" name="DmLockYN" value={formData.DmLockYN || ''} readOnly />
      </div>

      <div className="full-row" style={{ alignItems: 'center' }}>
        <label style={{ minWidth: '65px' }}>Valid Co Cds</label>
        <input type="text" className="w-full" name="DmValidCoCd" value={formData.DmValidCoCd || ''} onChange={handleChange} />
      </div>
    </div>
  );
};

export default SearchHeader;
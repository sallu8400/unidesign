import React from "react";

const AppLayout = ({ children }) => {
  return (
    <div className="window-container">
      {/* Styles for scrollbars and active rows */}
      <style>{`
        .active-row { color: #132f4a; background: #fffbc8 !important; }
        .grid-body::-webkit-scrollbar { width: 8px; }
        .grid-body::-webkit-scrollbar-thumb { background-color: #ccc; border-radius: 4px; }
      `}</style>

      {/* Top Menu Bar */}
      <div className="menu-bar">
        <div className="menu-item"><span>P</span>arameters</div>
        <div className="menu-item"><span>M</span>asters</div>
        <div className="menu-item"><span>T</span>ransactions</div>
        <div className="menu-item"><span>R</span>eports</div>
        <div className="menu-item">AddOn Menus</div>
        <div className="menu-item"><span>W</span>indow</div>
        <div className="menu-item"><span>Q</span>uit</div>
      </div>

      {/* Main Content (Header + Tabs) will be rendered here */}
      <div className="form-section">
        {children}
      </div>

      {/* Bottom Action Footer */}
      <div className="action-footer">
        {/* <h1 className="text-3xl bg-rose"></h1> */}
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
  );
};

export default AppLayout;
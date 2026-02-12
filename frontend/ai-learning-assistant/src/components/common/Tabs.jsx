import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-slate-200 mb-6">
      <nav className="flex items-center gap-8">

        {tabs.map((tab) => {
          const isActive = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`
                relative pb-4 text-sm font-medium transition-all duration-200
                ${isActive
                  ? "text-emerald-600"
                  : "text-slate-600 hover:text-slate-900"
                }
              `}
            >
              {tab.label}

              {/* Active underline */}
              {isActive && (
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-emerald-500 rounded-full" />
              )}
            </button>
          );
        })}

      </nav>
    </div>
  );
};

export default Tabs;

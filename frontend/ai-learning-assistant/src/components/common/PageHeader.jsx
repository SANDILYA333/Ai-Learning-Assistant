import React from "react";

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-10">

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight mb-2">
            {title}
          </h1>

          {subtitle && (
            <p className="text-slate-500 text-sm max-w-xl">
              {subtitle}
            </p>
          )}
        </div>

        {children && (
          <div className="flex items-center gap-3">
            {children}
          </div>
        )}
      </div>

    </div>
  );
};

export default PageHeader;

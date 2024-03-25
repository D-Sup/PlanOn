import React from "react";

const FormField = ({ children, label }: { children: React.ReactNode, label: string }) => {

  const childProps = React.isValidElement(children) ? children.props : {};

  return (
    <div className={`flex ${childProps.type !== "textarea" && "items-center"} gap-[15px]`} >
      <p className={`${childProps.type === "textarea" && "pt-[8px]"} min-w-[30px] text-lg text-white text-center`}>{label}</p>
      {children}
    </div>
  );
};

export default FormField;
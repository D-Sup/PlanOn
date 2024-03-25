interface CheckBoxProps {
  id: number,
  checked: boolean,
  checkedBox: number[];
  handleFunc: (id: number) => void;
}

const CheckBox = ({ id, checked, checkedBox, handleFunc }: CheckBoxProps) => {

  return (
    <div className="absolute top-0 w-full h-full cursor-pointer"
      key={id}
      onClick={() => handleFunc(id)}
    >
      <label className="absolute top-1 right-1 block text-xs font-bold text-white user-select-none shadow-outline-white rounded-full">
        {checkedBox &&
          <div
            className={`absolute right-0 h-[25px] w-[25px] rounded-full transition duration-100 border text-sm text-center ${checked ? "text-[#FFF]" : ""}`}
            style={{ backgroundColor: checked ? "#000" : "rgba(255,255,255,0.5)" }}
            onChange={(e) => {
              e.stopPropagation()
              handleFunc(id)
            }}
          >
            <span className="absolute-center">{checked && checkedBox.indexOf(id) + 1}</span>
          </div>}
      </label >
      <input
        className="absolute opacity-100 cursor-pointer h-0 w-0"
        id={String(id)}
        type="checkbox"
      // checked={checked}
      />
    </div >
  );
};

export default CheckBox;

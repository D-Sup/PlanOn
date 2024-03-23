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
      <label htmlFor={String(id)} className="absolute top-1 right-1 block text-xs font-bold text-white user-select-none shadow-outline-white rounded-full">
        <input
          className="absolute opacity-100 cursor-pointer h-0 w-0"
          id={String(id)}
          type="checkbox"
          onChange={() => handleFunc(id)}
          checked={checked}
        />
        {checkedBox &&
          <div
            className={`absolute right-0 h-[25px] w-[25px] rounded-full transition duration-100 border text-sm text-center ${checked ? "text-white" : ""}`}
            style={{ backgroundColor: checked ? "var(--black)" : "rgba(255,255,255,0.5)" }}
          >
            <span className="absolute-center">{checked && checkedBox.indexOf(id) + 1}</span>
          </div>}
      </label >
    </div >
  );
};

export default CheckBox;

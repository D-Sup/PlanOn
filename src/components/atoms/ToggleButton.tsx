interface ToggleButton {
  options: string[],
  selected: boolean,
  handleFunc: () => void
}

const ToggleButton = ({ options, selected, handleFunc }: ToggleButton): JSX.Element => {

  return (
    <button className={`px-[12px] py-[5px] rounded-full border-[1px] border-white text-black text-[8px] font-bold ${selected ? "text-white" : "bg-white"}`} type="button"
      onClick={handleFunc}>
      {selected ? options[0] : options[1]}
    </button>
  )
}

export default ToggleButton
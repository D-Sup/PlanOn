import { useRecoilState } from "recoil";
import { inputValue } from "@/store";

import IconSearch from "../../assets/images/icon-search.svg?react";
import IconCircleX from "../../assets/images/icon-circle-x.svg?react";

interface SearchBarProps {
  height?: number,
  handleFunc?: () => void
}

const SearchBar = ({ height = 38, handleFunc }: SearchBarProps) => {

  const [inputState, setInputState] = useRecoilState(inputValue)

  return (
    <div className="pl-[15px] pr-[10px] flex items-center w-full rounded-[10px] bg-input shadow-lg" style={{ height: `${height}px` }}>
      <IconSearch className="mr-[10px]" width={15} height={15} fill={"var(--gray-old)"} />
      <label htmlFor="search-bar" className="a11y-hidden">search-bar</label>
      <input
        className="w-full text-md text-white"
        id="search-bar"
        type="text"
        placeholder="검색"
        onChange={(e) => setInputState(e.target.value)}
        onClick={handleFunc}
        value={handleFunc ? "" : inputState}
        autoComplete="off"
        readOnly={!!handleFunc}
      />
      <button type="button">
        {!handleFunc && <IconCircleX
          className="transition duration-300"
          style={{ opacity: `${inputState.length > 0 ? 1 : 0}` }}
          width={15}
          height={15}
          fill={"var(--gray-old)"}
          onClick={() => setInputState("")}
        />}
      </button>
    </div>
  )
}

export default SearchBar
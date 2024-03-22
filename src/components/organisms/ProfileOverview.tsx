import ProfileAvatar from "../atoms/ProfileAvatar"

const ProfileOverview = ({ data }: { data: any }) => {

  const isEdit = true;

  return (
    <div className="flex flex-col items-center">
      <ProfileAvatar
        className="w-[100px] h-[100px]"
        src="https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_1280.jpg"
        alt="profile-image"
      />
      <h2 className="mt-[10px] mb-[5px] text-xlg text-white font-bold">동섭</h2>
      <p className="text-sm text-gray-old">안녕하세요~ 안동섭입니다.</p>

      <div className="my-[20px] px-[20px] w-full flex gap-[20px]">
        <button className={`w-8/12 h-[37px] rounded-[5px]  text-md ${isEdit ? "bg-white text-black" : "bg-input text-gray-old"}`} type="button">
          {isEdit ? "팔로우" : "팔로우 취소"}
        </button>
        <button className="w-4/12 h-[37px] rounded-[5px] bg-input text-md text-gray-old" type="button">
          메시지
        </button>
      </div>

      <ul className="w-full flex justify-evenly">
        <li className="text-center">
          <strong className="block text-md text-white leading-none">34</strong>
          <span className="block text-sm text-gray-old">팔로워</span>
        </li>
        <li className="text-center">
          <strong className="block text-md text-white leading-none">10</strong>
          <span className="block text-sm text-gray-old">게시물</span>
        </li>
        <li className="text-center">
          <strong className="block text-md text-white leading-none">34</strong>
          <span className="block text-sm text-gray-old">팔로워</span>
        </li>
      </ul>
    </div>
  )
}

export default ProfileOverview
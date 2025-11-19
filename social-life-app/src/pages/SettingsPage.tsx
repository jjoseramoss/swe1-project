import ChangeTheme from "../components/common/ChangeTheme"

const SettingsPage = () => {
  return (
    <div className="flex justify-center items-center h-screen  text-black">

        <div className="flex flex-col gap-2 bg-gray-300 w-100 h-100 rounded items-center">
            <h1 className="text-3xl pt-2">SETTINGS: </h1>
            <hr />
            <ul className="">
                <li className="flex justify-around items-center">
                    <ChangeTheme />
                </li>
            </ul>
        </div>

    </div>
  )
}

export default SettingsPage
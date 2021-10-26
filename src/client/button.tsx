import { React, tw } from "../../frontend_deps.ts";

interface Props {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<Props> = ({onClick, children}) => (
    <button
        className={tw`p-4 text-white bg-purple-500 hover:(bg-indigo-200 text-black) disabled:bg-gray-400`}
        onClick={onClick}>
        {children}
    </button>
);

export default Button;
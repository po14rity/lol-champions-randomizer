import bottom from '../assets/icons/lol-role-icon-bot.svg';
import top from '../assets/icons/lol-role-icon-top.svg';
import mid from '../assets/icons/lol-role-icon-mid.svg';
import support from '../assets/icons/lol-role-icon-support.svg';
import jungle from '../assets/icons/lol-role-icon-jungle.svg';

// Пропсы компонента как интерфейс
interface ChampionRoleBtnProps {
    role: string;
    isActive: boolean;
    onToggle: (role: string) => void;
}

export default function ChampionRoleBtn({role, isActive, onToggle}: ChampionRoleBtnProps) {
    const links: Record<string, string> = {
        "bottom": bottom,
        "top": top,
        "mid": mid,
        "support": support,
        "jungle": jungle
    }

    return (
        <button onClick={() => onToggle(role)} className={`p-2 rounded-lg transition-all duration-200 ${isActive ? 'bg-blue-600 ring-2 ring-blue-400 scale-105' : 'bg-gray-800 hover:bg-gray-700'}`}>
            <img src={links[role]} alt={role} className="w-10 h-10" />
        </button>
    )
}
import Icons1 from '@expo/vector-icons/MaterialCommunityIcons';
import Icons2 from '@expo/vector-icons/MaterialIcons';
import { COLORS } from '../../../styles/constants';

const iconSize = 30;
const iconColor = COLORS.primary;

export default [
    {
        name: "Plumbing",
        icon: <Icons1 name='pipe-wrench' size={iconSize} color={iconColor}/>,
    },
    {
        name: "Electrical",
        icon: <Icons2 name='electrical-services' size={iconSize} color={iconColor}/>,
    },
    {
        name: "Cleaning",
        icon: <Icons1 name='broom' size={iconSize} color={iconColor}/>,
    },
    {
        name: "Repairs",
        icon: <Icons1 name='hammer-wrench' size={iconSize} color={iconColor}/>,
    },
    {
        name: "Technician",
        icon: <Icons1 name='hammer-screwdriver' size={iconSize} color={iconColor}/>,
    },
    {
        name: "Pest Control",
        icon: <Icons1 name='bug' size={iconSize} color={iconColor}/>,
    },
    {
        name: "Upholstery",
        icon: <Icons1 name='sofa-single' size={iconSize} color={iconColor}/>,
    },

]
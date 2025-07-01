import Icons1 from '@expo/vector-icons/MaterialCommunityIcons';
import Icons2 from '@expo/vector-icons/MaterialIcons';
import { COLORS } from '../styles/constants';


const ServiceIconList = [
   {
      id: 1,
      getIcon: (size, color) => <Icons1 name="pipe-wrench" size={size} color={color} />,
   },
   {
      id: 2,
      getIcon: (size, color) => <Icons2 name="electrical-services" size={size} color={color} />,
   },
   {
      id: 3,
      getIcon: (size, color) => <Icons1 name="broom" size={size} color={color} />,
   },
   {
      id: 4,
      getIcon: (size, color) => <Icons1 name="hammer-wrench" size={size} color={color} />,
   },
   {
      id: 5,
      getIcon: (size, color) => <Icons2 name="severe-cold" size={size} color={color} />,
   },
   {
      id: 6,
      getIcon: (size, color) => <Icons1 name="bug" size={size} color={color} />,
   },
   {
      id: 7,
      getIcon: (size, color) => <Icons1 name="sofa-single" size={size} color={color} />,
   },
 ];

export const ServiceIconMap = ({serviceId , iconColor = COLORS.primary, iconSize = 24}) => {
   const iconEntry = ServiceIconList.find(service => service.id === serviceId);

   if (!iconEntry) return null;
 
   return iconEntry.getIcon(iconSize, iconColor);
}

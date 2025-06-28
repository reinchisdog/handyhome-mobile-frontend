import Icons1 from '@expo/vector-icons/MaterialCommunityIcons';
import Icons2 from '@expo/vector-icons/MaterialIcons';
import { COLORS } from '../styles/constants';


const ServiceIconList = [
   {
     name: "Plumbing",
     getIcon: (size, color) => <Icons1 name="pipe-wrench" size={size} color={color} />,
   },
   {
     name: "Electrical",
     getIcon: (size, color) => <Icons2 name="electrical-services" size={size} color={color} />,
   },
   {
     name: "Cleaning",
     getIcon: (size, color) => <Icons1 name="broom" size={size} color={color} />,
   },
   {
     name: "Appliance Repair",
     getIcon: (size, color) => <Icons1 name="hammer-wrench" size={size} color={color} />,
   },
   {
     name: "Aircon Technician",
     getIcon: (size, color) => <Icons2 name="severe-cold" size={size} color={color} />,
   },
   {
     name: "Pest Control",
     getIcon: (size, color) => <Icons1 name="bug" size={size} color={color} />,
   },
   {
     name: "Upholstery",
     getIcon: (size, color) => <Icons1 name="sofa-single" size={size} color={color} />,
   },
 ];

export const ServiceIconMap = ({serviceName , iconColor = COLORS.primary, iconSize = 24}) => {
   const iconEntry = ServiceIconList.find(service => service.name === serviceName);

   if (!iconEntry) return null;
 
   return iconEntry.getIcon(iconSize, iconColor);
}

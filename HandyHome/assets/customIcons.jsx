import React from 'react';
import Svg, { Path } from "react-native-svg"

const iconList = [
   {
      name: 'gcash',
      component: (props) => (
         <Svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 48 48" {...props}>
            <Path
               fill="none"
               stroke={props.fill}
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={4}
               d="M33.824 33.23a16.12 16.12 0 0 0-.01-18.475m-1.806-2.149a16.114 16.114 0 1 0 0 22.788"
            />
            <Path
               fill="none"
               stroke={props.fill}
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth={4}
               d="M26.461 16.923A9.18 9.18 0 1 0 29.794 24h-8.066m17.648 13.109a22.9 22.9 0 0 0-.015-26.24"
            />
         </Svg>
      )
   },
]

export default CustomIcon = ({ name, size=24, color='currentColor', ...props }) => {
   const iconEntry = iconList.find((icon) => icon.name === name);

   if (!iconEntry) return null;

   const SvgIcon = iconEntry.component;

   return <SvgIcon width={size} height={size} fill={color} {...props}/>
}

